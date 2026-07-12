import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Button } from "../../components/ui";
import { useTranslation } from "react-i18next";

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <Text style={styles.icon}>!</Text>
      <Text
        style={[
          styles.title,
          { color: theme.colors.neutral.dark300, fontFamily: theme.fontFamily.english },
        ]}
      >
        {t("common.error")}
      </Text>
      <Text
        style={[
          styles.message,
          { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english },
        ]}
      >
        {message || "Something went wrong. Please try again."}
      </Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} variant="primary" style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
    color: "#d32f2f",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});
