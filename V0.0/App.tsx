import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeModeProvider } from "./lib/context/ThemeModeContext";
import { ThemeProvider } from './lib/context/ThemeProvider';
import { SettingsProvider } from './lib/context/SettingsContext';
import { ErrorBoundary } from "./ErrorBoundary";
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeModeProvider><ThemeProvider>
        <SettingsProvider>
          <View style={{ flex:1 }}>
            <StatusBar barStyle="dark-content" />
            <ErrorBoundary><RootNavigator /></ErrorBoundary>
          </View>
        </SettingsProvider>
      </ThemeProvider></ThemeModeProvider>
    </SafeAreaProvider>
  );
}
