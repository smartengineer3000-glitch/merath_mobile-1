import { TextStyle } from 'react-native';

export interface AppTheme {
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    error: string;
    errorContainer: string;
    success: string;
    successContainer: string;
    warning: string;
    warningContainer: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    shadow: string;
    scrim: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: { sm: number; md: number; lg: number; xl: number; full: number };
  typography: {
    displayLarge: TextStyle;
    headlineLarge: TextStyle;
    headlineMedium: TextStyle;
    headlineSmall: TextStyle;
    titleLarge: TextStyle;
    titleMedium: TextStyle;
    titleSmall: TextStyle;
    bodyLarge: TextStyle;
    bodyMedium: TextStyle;
    bodySmall: TextStyle;
    labelLarge: TextStyle;
    labelMedium: TextStyle;
    labelSmall: TextStyle;
  };
  elevation: { level0: number; level1: number; level2: number; level3: number; level4: number; level5: number };
}

export const lightTheme: AppTheme = {
  colors: {
    primary: '#1B6B4A',
    primaryContainer: '#D4E8D4',
    secondary: '#C5A04E',
    secondaryContainer: '#F2E6C4',
    background: '#FCFCFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F3',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    success: '#2E7D32',
    successContainer: '#D9F0D9',
    warning: '#E65100',
    warningContainer: '#FFDBC8',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#C4C0CA',
    inverseSurface: '#313034',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#8CDA8C',
    shadow: '#000000',
    scrim: '#000000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
  typography: {
    displayLarge: { fontFamily: 'ScheherazadeNew-Bold', fontSize: 57, lineHeight: 64 },
    headlineLarge: { fontFamily: 'ScheherazadeNew-Bold', fontSize: 32, lineHeight: 40 },
    headlineMedium: { fontFamily: 'ScheherazadeNew-Bold', fontSize: 28, lineHeight: 36 },
    headlineSmall: { fontFamily: 'ScheherazadeNew-SemiBold', fontSize: 24, lineHeight: 32 },
    titleLarge: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '600', fontSize: 22, lineHeight: 28 },
    titleMedium: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '500', fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
    titleSmall: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '500', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    bodyLarge: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '400', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
    bodyMedium: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '400', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
    bodySmall: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '400', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
    labelLarge: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '500', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
    labelMedium: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '500', fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
    labelSmall: { fontFamily: 'IBM Plex Sans Arabic', fontWeight: '500', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
  },
  elevation: { level0: 0, level1: 1, level2: 3, level3: 6, level4: 8, level5: 12 },
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  colors: {
    primary: '#8CDA8C',
    primaryContainer: '#004D31',
    secondary: '#DFC07A',
    secondaryContainer: '#5E4300',
    background: '#1C1B1F',
    surface: '#252529',
    surfaceVariant: '#49454F',
    error: '#FFB4AB',
    errorContainer: '#93000A',
    success: '#81C784',
    successContainer: '#004D25',
    warning: '#FFB951',
    warningContainer: '#6E2A00',
    onPrimary: '#00391E',
    onSecondary: '#3E2B00',
    onBackground: '#E6E1E5',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#49454F',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313034',
    inversePrimary: '#1B6B4A',
    shadow: '#000000',
    scrim: '#000000',
  },
};

export type Theme = AppTheme;
export type ThemeMode = 'light' | 'dark' | 'system';
import { useAppTheme } from '../../hooks/useAppTheme';
export const useTheme = useAppTheme;
