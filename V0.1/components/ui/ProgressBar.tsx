import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  color,
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const { theme } = useAppTheme();
  const fill = Math.min(1, Math.max(0, progress));
  const barColor = color || theme.colors.primary.main;

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.neutral.light400,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {label || `${Math.round(fill * 100)}%`}
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.neutral.light100,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${fill * 100}%`,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  track: {
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
