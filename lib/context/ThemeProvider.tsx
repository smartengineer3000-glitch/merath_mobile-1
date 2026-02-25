/**
 * @file lib/context/ThemeProvider.tsx
 * @description Theme provider component with light/dark mode support
 * Manages theme context and persists preferences to AsyncStorage
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeMode, Theme, ThemeContext as BaseThemeContext } from '../design/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContextValue = createContext<ThemeContextValue | undefined>(undefined);

type ThemeAction =
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_FROM_STORAGE'; payload: ThemeMode };

const themeReducer = (state: ThemeMode, action: ThemeAction): ThemeMode => {
  switch (action.type) {
    case 'SET_MODE':
      return action.payload;
    case 'TOGGLE_THEME':
      return state === 'light' ? 'dark' : 'light';
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    default:
      return state;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const initialMode: ThemeMode =
    systemScheme === 'dark' ? 'dark' : 'light';

  const [mode, dispatch] = useReducer(themeReducer, initialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem('@merath_theme_mode');
        if (saved === 'light' || saved === 'dark') {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: saved });
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('@merath_theme_mode', mode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };

    saveThemePreference();
  }, [mode]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  }, []);

  const value: ThemeContextValue = {
    mode,
    theme,
    isDark: mode === 'dark',
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContextValue.Provider value={value}>
      {children}
    </ThemeContextValue.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContextValue);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
};
