import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={48}
          color={theme.colors.neutral.light300}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.neutral.dark200,
            fontFamily: theme.fontFamily.english,
          },
        ]}
      >
        {title}
      </Text>
      {message && (
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.neutral.light400,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
