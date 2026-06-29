/**
 * @file components/LoadingScreen.tsx
 * @description Loading screen component with spinner and message
 */

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppTheme } from "../lib/context/ThemeProvider";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      <Text style={[styles.message, { color: theme.colors.neutral.dark200 }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "400",
  },
});
