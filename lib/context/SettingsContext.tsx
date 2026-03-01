/**
 * @file lib/context/SettingsContext.ts
 * @description Global settings context for language and preferences
 */

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n';

export interface SettingsState {
  language: Language;
  notifications: boolean;
  roundingDecimals: number;
  autoSave: boolean;
  version: number;
  lastUpdated: string;
}

export type SettingsAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_ROUNDING'; payload: number }
  | { type: 'SET_AUTO_SAVE'; payload: boolean }
  | { type: 'LOAD_SETTINGS'; payload: Partial<SettingsState> }
  | { type: 'RESET_SETTINGS' };

export const defaultSettings: SettingsState = {
  language: 'en',
  notifications: true,
  roundingDecimals: 2,
  autoSave: true,
  version: 2,
  lastUpdated: new Date().toISOString()
};

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  const now = new Date().toISOString();
  
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload, lastUpdated: now };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, lastUpdated: now };
    case 'SET_ROUNDING':
      return { ...state, roundingDecimals: action.payload, lastUpdated: now };
    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.payload, lastUpdated: now };
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload, lastUpdated: now };
    case 'RESET_SETTINGS':
      return { ...defaultSettings, lastUpdated: now };
    default:
      return state;
  }
};

interface SettingsContextType {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  setLanguage: (language: Language) => void;
  setNotifications: (enabled: boolean) => void;
  setRoundingDecimals: (decimals: number) => void;
  setAutoSave: (enabled: boolean) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  isSaving: boolean;
  lastSaveError: string | null;
  recoverFromBackup: () => Promise<boolean>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  SETTINGS: '@merath_settings_v2',
  BACKUP: '@merath_settings_backup'
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const lastSavedStateRef = useRef<string>('');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, []);

  const setNotifications = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled });
  }, []);

  const setRoundingDecimals = useCallback((decimals: number) => {
    dispatch({ type: 'SET_ROUNDING', payload: decimals });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settingsJson) {
        const loadedSettings = JSON.parse(settingsJson);
        dispatch({ type: 'LOAD_SETTINGS', payload: loadedSettings });
      }
    } catch (error) {
      console.error('[Settings] Load error:', error);
    }
  }, []);

  const debouncedSave = useCallback(
    debounce(async (stateToSave: SettingsState) => {
      if (!mountedRef.current) return;
      
      const stateJson = JSON.stringify(stateToSave);
      if (stateJson === lastSavedStateRef.current) return;
      
      try {
        setIsSaving(true);
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, stateJson);
        await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, stateJson);
        lastSavedStateRef.current = stateJson;
        setLastSaveError(null);
      } catch (error) {
        setLastSaveError(error instanceof Error ? error.message : 'Save failed');
      } finally {
        setIsSaving(false);
      }
    }, 500),
    []
  );

  const saveSettings = useCallback(async () => {
    await debouncedSave(state);
  }, [state, debouncedSave]);

  const saveImmediately = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      const stateJson = JSON.stringify(state);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, stateJson);
      await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, stateJson);
      lastSavedStateRef.current = stateJson;
      setLastSaveError(null);
      return true;
    } catch (error) {
      setLastSaveError(error instanceof Error ? error.message : 'Save failed');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [state]);

  const recoverFromBackup = useCallback(async (): Promise<boolean> => {
    try {
      const backupJson = await AsyncStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backupJson) return false;
      
      const backup = JSON.parse(backupJson);
      backup.version = defaultSettings.version;
      backup.lastUpdated = new Date().toISOString();
      
      dispatch({ type: 'LOAD_SETTINGS', payload: backup });
      await saveImmediately();
      return true;
    } catch (error) {
      console.error('[Settings] Recovery failed:', error);
      return false;
    }
  }, [saveImmediately]);

  useEffect(() => {
    if (state.autoSave) {
      saveSettings();
    }
  }, [state, state.autoSave, saveSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const value = {
    state,
    dispatch,
    setLanguage,
    setNotifications,
    setRoundingDecimals,
    setAutoSave,
    resetSettings,
    saveSettings,
    loadSettings,
    isSaving,
    lastSaveError,
    recoverFromBackup
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (typeof context === 'undefined') {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
