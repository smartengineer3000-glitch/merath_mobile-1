import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

export function LoadingScreen({ message }: { message?: string }) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logo,
            {
              backgroundColor: theme.colors.primary.main,
              borderRadius: 24,
            },
          ]}
        >
          <Text style={styles.logoText}>M</Text>
        </View>
      </View>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary.main}
        style={styles.spinner}
      />
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.neutral.light400,
            fontFamily: theme.fontFamily.english,
          },
        ]}
      >
        {message || "Loading app..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
  },
});
