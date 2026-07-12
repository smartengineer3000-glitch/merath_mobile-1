import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import type { Theme } from "../../lib/design/theme";

interface ErrorBoundaryProps {
  children: ReactNode;
  theme: Theme;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { theme } = this.props;

      return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.icon}>!</Text>
            <Text style={[styles.title, { color: theme.colors.error.main }]}>
              Something went wrong
            </Text>
            <Text style={[styles.message, { color: theme.colors.neutral.dark200 }]}>
              An unexpected error occurred. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={[styles.debugContainer, { backgroundColor: theme.colors.neutral.light50, borderRadius: theme.borderRadius.md }]}>
                <Text style={[styles.debugTitle, { color: theme.colors.neutral.dark200 }]}>
                  Error Details:
                </Text>
                <Text style={[styles.debugText, { color: theme.colors.neutral.dark100 }]}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={this.handleRetry}
              style={[styles.retryButton, { backgroundColor: theme.colors.primary.main, borderRadius: theme.borderRadius.md }]}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    fontSize: 48,
    color: "#d32f2f",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  debugContainer: {
    width: "100%",
    padding: 12,
    marginBottom: 24,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
