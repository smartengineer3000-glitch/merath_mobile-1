/**
 * @file lib/context/SettingsContext.ts
 * @description Global settings context for language and preferences
 * Theme is now managed by ThemeProvider
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n';

export interface SettingsState {
  language: Language;
  notifications: boolean;
  roundingDecimals: number;
  autoSave: boolean;
}

export type SettingsAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_ROUNDING'; payload: number }
  | { type: 'SET_AUTO_SAVE'; payload: boolean }
  | { type: 'LOAD_SETTINGS'; payload: Partial<SettingsState> };

export const defaultSettings: SettingsState = {
  language: 'en',
  notifications: true,
  roundingDecimals: 2,
  autoSave: true,
};

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_ROUNDING':
      return { ...state, roundingDecimals: action.payload };
    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.payload };
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
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
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);

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

  const saveSettings = useCallback(async () => {
    try {
      await AsyncStorage.setItem('@merath_settings', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [state]);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('@merath_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        state,
        dispatch,
        setLanguage,
        setNotifications,
        setRoundingDecimals,
        setAutoSave,
        saveSettings,
        loadSettings,
      }}
    >
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