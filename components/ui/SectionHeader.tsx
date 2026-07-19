import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.title,
          {
            flex: actionLabel ? 1 : undefined,
            color: theme.colors.neutral.dark300,
            fontFamily: theme.fontFamily.english,
          },
        ]}
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <Text
          onPress={onAction}
          style={[
            styles.action,
            {
              color: theme.colors.primary.main,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {actionLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  action: {
    fontSize: 13,
    fontWeight: "500",
  },
});
