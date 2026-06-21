import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Theme } from "../lib/design/theme";
import { lightTheme } from "../lib/design/theme";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  theme?: Theme;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (__DEV__) {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const theme = this.props.theme ?? lightTheme;
      const dynamicStyles = createDynamicStyles(theme);

      return (
        <View style={dynamicStyles.container}>
          <Text style={dynamicStyles.icon}>⚠️</Text>
          <Text style={dynamicStyles.title}>Something went wrong</Text>
          <Text style={dynamicStyles.message}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={dynamicStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const createDynamicStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: theme.colors.background.lightVariant,
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.neutral.dark300,
      marginBottom: 8,
    },
    message: {
      fontSize: 16,
      color: theme.colors.neutral.main,
      textAlign: "center",
      marginBottom: 24,
    },
    button: {
      backgroundColor: theme.colors.primary.main,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: theme.colors.background.light,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default ErrorBoundary;
