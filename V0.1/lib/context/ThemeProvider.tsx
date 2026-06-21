/**
 * @file lib/context/ThemeProvider.tsx
 * @description Single source of truth for theme management
 * Uses the comprehensive design system from lib/design/theme.ts
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme, ThemeMode } from '../design/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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
  const [mode, dispatch] = useReducer(
    themeReducer, 
    systemScheme === 'dark' ? 'dark' : 'light'
  );

  // Load saved preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('@merath_theme_mode');
        if (saved === 'light' || saved === 'dark') {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: saved });
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Save preference when changed
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('@merath_theme_mode', mode);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
    saveTheme();
  }, [mode]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  }, []);

  // Use your comprehensive design system themes
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const isDark = mode === 'dark';

  const value = {
    mode,
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
};