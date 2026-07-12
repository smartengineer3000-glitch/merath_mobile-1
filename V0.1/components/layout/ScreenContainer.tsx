import React from "react";
import { View, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface ScreenContainerProps {
  children: React.ReactNode;
  padding?: boolean;
  backgroundColor?: string;
  edges?: ("top" | "bottom" | "left" | "right")[];
  style?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  padding = true,
  backgroundColor,
  edges = ["top", "bottom"],
  style,
}: ScreenContainerProps) {
  const { theme } = useAppTheme();
  const bgColor = backgroundColor || theme.colors.background.light;

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safe, { backgroundColor: bgColor }]}
    >
      <View style={[styles.container, padding && styles.padded, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 16,
  },
});
