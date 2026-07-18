/**
 * @file lib/context/SettingsContext.ts
 * @description Global settings context for language and preferences
 * Theme is now managed by ThemeProvider
 *
 * FIXES:
 * - C7 (🔴): Settings persistence conflict - debounced saves, version tracking, conflict resolution
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, applyRTLOfLanguage } from "../i18n";

export interface SettingsState {
  language: Language;
  notifications: boolean;
  roundingDecimals: number;
  autoSave: boolean;
  currency: string;
  // ===== FIX C7: Add version and timestamp for conflict resolution =====
  version: number;
  lastUpdated: string;
}

export type SettingsAction =
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_NOTIFICATIONS"; payload: boolean }
  | { type: "SET_ROUNDING"; payload: number }
  | { type: "SET_AUTO_SAVE"; payload: boolean }
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "LOAD_SETTINGS"; payload: Partial<SettingsState> }
  | { type: "RESET_SETTINGS" };

export const defaultSettings: SettingsState = {
  language: "en",
  notifications: true,
  roundingDecimals: 2,
  autoSave: true,
  currency: "SAR",
  version: 2, // ===== FIX C7: Increment version when schema changes =====
  lastUpdated: new Date().toISOString(),
};

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction,
): SettingsState => {
  const now = new Date().toISOString();

  switch (action.type) {
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
        lastUpdated: now,
        version: state.version, // Preserve version
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        lastUpdated: now,
      };
    case "SET_ROUNDING":
      return {
        ...state,
        roundingDecimals: action.payload,
        lastUpdated: now,
      };
    case "SET_AUTO_SAVE":
      return {
        ...state,
        autoSave: action.payload,
        lastUpdated: now,
      };
    case "SET_CURRENCY":
      return {
        ...state,
        currency: action.payload,
        lastUpdated: now,
      };
    case "LOAD_SETTINGS":
      // ===== FIX C7: Merge with version conflict resolution =====
      return {
        ...state,
        ...action.payload,
        lastUpdated: now,
      };
    case "RESET_SETTINGS":
      return {
        ...defaultSettings,
        lastUpdated: now,
      };
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
  setCurrency: (currency: string) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  // ===== FIX C7: New methods for better control =====
  isSaving: boolean;
  lastSaveError: string | null;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// ===== FIX C7: Storage keys with versioning =====
const STORAGE_KEYS = {
  SETTINGS: "@merath_settings_v2", // Versioned key
  BACKUP: "@merath_settings_backup",
  MIGRATION: "@merath_settings_migration",
};

// ===== FIX C7: Debounce utility =====
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);

  // ===== FIX C7: Track save state =====
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);

  // ===== FIX C7: Refs for tracking pending saves =====
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const lastSavedStateRef = useRef<string>("");

  // ===== FIX C7: Component lifecycle tracking =====
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Action creators
  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  }, []);

  const setNotifications = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_NOTIFICATIONS", payload: enabled });
  }, []);

  const setRoundingDecimals = useCallback((decimals: number) => {
    dispatch({ type: "SET_ROUNDING", payload: decimals });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_AUTO_SAVE", payload: enabled });
  }, []);

  const setCurrency = useCallback((currency: string) => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: "RESET_SETTINGS" });
  }, []);

  /**
   * ===== FIX C7: Migrate old settings to new version =====
   */
  const migrateOldSettings =
    useCallback(async (): Promise<SettingsState | null> => {
      try {
        // Try to load old v1 settings
        const oldSettingsJson = await AsyncStorage.getItem("@merath_settings");
        if (!oldSettingsJson) return null;

        const oldSettings = JSON.parse(oldSettingsJson);

        // Map old structure to new
        const migrated: SettingsState = {
          language: oldSettings.language || "en",
          notifications: oldSettings.notifications ?? true,
          roundingDecimals: oldSettings.roundingDecimals ?? 2,
          autoSave: oldSettings.autoSave ?? true,
          currency: oldSettings.currency || "SAR",
          version: 2,
          lastUpdated: new Date().toISOString(),
        };

        // Save migrated settings
        await AsyncStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(migrated),
        );

        // Backup old settings just in case
        await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, oldSettingsJson);

        // Clear old settings
        await AsyncStorage.removeItem("@merath_settings");

        if (__DEV__) console.log("[Settings] Migrated old settings to v2");

        return migrated;
      } catch (error) {
        console.error("[Settings] Migration failed:", error);
        return null;
      }
    }, []);

  /**
   * ===== FIX C7: Load settings with conflict resolution =====
   */
  const loadSettings = useCallback(async () => {
    try {
      setIsSaving(true);
      setLastSaveError(null);

      // Try to load current version
      let settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

      // If no current version, try to migrate old settings
      if (!settingsJson) {
        const migrated = await migrateOldSettings();
        if (migrated) {
          dispatch({ type: "LOAD_SETTINGS", payload: migrated });
          return;
        }

        // No settings at all, use defaults
        dispatch({ type: "LOAD_SETTINGS", payload: defaultSettings });
        return;
      }

      const loadedSettings = JSON.parse(settingsJson) as SettingsState;

      // ===== FIX C7: Version check and migration =====
      if (loadedSettings.version !== defaultSettings.version) {
        if (__DEV__)
          console.log(
            `[Settings] Version mismatch: loaded v${loadedSettings.version}, current v${defaultSettings.version}`,
          );

        // Merge with defaults, preserving user preferences
        const merged: SettingsState = {
          ...defaultSettings,
          ...loadedSettings,
          version: defaultSettings.version,
          lastUpdated: new Date().toISOString(),
        };

        dispatch({ type: "LOAD_SETTINGS", payload: merged });

        // Save merged settings
        await AsyncStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(merged),
        );
      } else {
        dispatch({ type: "LOAD_SETTINGS", payload: loadedSettings });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load settings";
      setLastSaveError(errorMessage);
      console.error("[Settings] Load error:", error);

      // Use defaults on error
      dispatch({ type: "LOAD_SETTINGS", payload: defaultSettings });
    } finally {
      if (mountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [migrateOldSettings]);

  /**
   * ===== FIX C7: Debounced save to prevent multiple writes =====
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (stateToSave: SettingsState) => {
      if (!mountedRef.current) return;

      // Skip if state hasn't changed
      const stateJson = JSON.stringify(stateToSave);
      if (stateJson === lastSavedStateRef.current) {
        return;
      }

      try {
        setIsSaving(true);
        setLastSaveError(null);

        // Save to AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, stateJson);

        // Update last saved state
        lastSavedStateRef.current = stateJson;

        // Also save a backup copy
        await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, stateJson);

        if (__DEV__) console.log("[Settings] Saved successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save settings";
        setLastSaveError(errorMessage);
        console.error("[Settings] Save error:", error);

        // Try to save backup with error flag
        try {
          await AsyncStorage.setItem(
            STORAGE_KEYS.BACKUP,
            JSON.stringify({
              ...stateToSave,
              saveError: true,
              errorTime: new Date().toISOString(),
            }),
          );
        } catch (backupError) {
          console.error("[Settings] Backup save failed:", backupError);
        }
      } finally {
        if (mountedRef.current) {
          setIsSaving(false);
        }
      }
    }, 500), // 500ms debounce
    [],
  );

  /**
   * ===== FIX C7: Save settings with debouncing =====
   */
  const saveSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    // Cancel any pending timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Use Promise to track save completion
    return new Promise<void>((resolve) => {
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await debouncedSave(state);
          resolve();
        } catch (error) {
          console.error("[Settings] Save failed:", error);
          resolve(); // Resolve anyway to not block
        }
      }, 100);
    });
  }, [state, debouncedSave]);

  /**
   * ===== FIX C7: Force immediate save (bypass debounce) =====
   */
  const saveImmediately = useCallback(async (): Promise<boolean> => {
    if (!mountedRef.current) return false;

    // Cancel any pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const stateJson = JSON.stringify(state);

    // Skip if unchanged
    if (stateJson === lastSavedStateRef.current) {
      return true;
    }

    try {
      setIsSaving(true);
      setLastSaveError(null);

      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, stateJson);
      await AsyncStorage.setItem(STORAGE_KEYS.BACKUP, stateJson);

      lastSavedStateRef.current = stateJson;

      if (__DEV__) console.log("[Settings] Saved immediately");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save settings";
      setLastSaveError(errorMessage);
      console.error("[Settings] Immediate save error:", error);
      return false;
    } finally {
      if (mountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [state]);

  /**
   * ===== FIX C7: Recover from backup =====
   */
  const recoverFromBackup = useCallback(async (): Promise<boolean> => {
    try {
      const backupJson = await AsyncStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backupJson) return false;

      const backup = JSON.parse(backupJson);

      // Remove error flags if present
      delete backup.saveError;
      delete backup.errorTime;

      // Ensure version is current
      backup.version = defaultSettings.version;
      backup.lastUpdated = new Date().toISOString();

      dispatch({ type: "LOAD_SETTINGS", payload: backup });
      await saveImmediately();

      if (__DEV__) console.log("[Settings] Recovered from backup");
      return true;
    } catch (error) {
      console.error("[Settings] Recovery failed:", error);
      return false;
    }
  }, [saveImmediately]);

  /**
   * ===== FIX C7: Auto-save when state changes =====
   */
  useEffect(() => {
    if (state.autoSave) {
      saveSettings();
    }
  }, [state, state.autoSave, saveSettings]);

  /**
   * ===== FIX C7: Load settings on mount =====
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Apply RTL layout when language changes
   */
  useEffect(() => {
    if (state.language) {
      applyRTLOfLanguage(state.language);
    }
  }, [state.language]);

  const value = {
    state,
    dispatch,
    setLanguage,
    setNotifications,
    setRoundingDecimals,
    setAutoSave,
    setCurrency,
    resetSettings,
    saveSettings,
    loadSettings,
    // ===== FIX C7: Expose new state and methods =====
    isSaving,
    lastSaveError,
    // Expose recovery method (could be used in UI)
    recoverFromBackup,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (typeof context === "undefined") {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
