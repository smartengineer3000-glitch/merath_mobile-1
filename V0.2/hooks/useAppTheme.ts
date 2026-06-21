import { useContext } from 'react';
import { ThemeContext } from '../lib/context/ThemeProvider';
import { lightTheme, AppTheme } from '../lib/design/theme';

export const useAppTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (!context) return lightTheme;
  return (context as any).theme ?? context ?? lightTheme;
};
