/**
 * @file components/ErrorBoundary.tsx
 * @description Error boundary component to catch and handle React errors
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppTheme } from "../lib/context/ThemeProvider";

interface Props {
  children: ReactNode;
  theme?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRestart={this.handleRestart} theme={this.props.theme} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onRestart, theme }: { error: Error | null; onRestart: () => void; theme?: any }) {
  const appTheme = useAppTheme();
  const currentTheme = theme || appTheme.theme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background.light }]}>
      <View style={styles.content}>
        <Text style={[styles.icon, { fontSize: 64 }]}>⚠️</Text>
        <Text style={[styles.title, { color: currentTheme.colors.error.main }]}>
          Something went wrong
        </Text>
        <Text style={[styles.message, { color: currentTheme.colors.neutral.dark200 }]}>
          An unexpected error occurred. Please try again.
        </Text>
        {error && (
          <Text style={[styles.errorText, { color: currentTheme.colors.neutral.light400 }]}>
            {error.message}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: currentTheme.colors.primary.main }]}
          onPress={onRestart}
        >
          <Text style={[styles.buttonText, { color: currentTheme.colors.background.light }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "monospace",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
