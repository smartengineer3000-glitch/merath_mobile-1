import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface DividerProps {
  vertical?: boolean;
  spacing?: number;
}

export function Divider({ vertical = false, spacing }: DividerProps) {
  const { theme } = useAppTheme();

  if (vertical) {
    return (
      <View
        style={[
          styles.vertical,
          {
            backgroundColor: theme.colors.neutral.light200,
            marginHorizontal: spacing ?? theme.spacing.sm,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          backgroundColor: theme.colors.neutral.light200,
          marginVertical: spacing ?? theme.spacing.sm,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
});
