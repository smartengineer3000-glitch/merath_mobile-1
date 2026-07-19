import React, { Component, type ErrorInfo, type ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import i18next from "../../lib/i18n";
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

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background.light },
          ]}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.icon, { color: theme.colors.error.main }]}>
              !
            </Text>
            <Text style={[styles.title, { color: theme.colors.error.main }]}>
              {i18next.t("error.title")}
            </Text>
            <Text
              style={[styles.message, { color: theme.colors.neutral.dark200 }]}
            >
              {i18next.t("error.description")}
            </Text>

            {this.state.error && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: theme.colors.neutral.light50,
                    borderColor: theme.colors.error.main,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorBoxTitle,
                    { color: theme.colors.error.main },
                  ]}
                >
                  {i18next.t("error.details")}
                </Text>
                <Text
                  selectable
                  style={[
                    styles.errorBoxMessage,
                    { color: theme.colors.neutral.dark300 },
                  ]}
                >
                  {this.state.error.message || String(this.state.error)}
                </Text>
              </View>
            )}

            {this.state.errorInfo && this.state.errorInfo.componentStack && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: theme.colors.neutral.light50,
                    borderColor: theme.colors.neutral.light200,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorBoxTitle,
                    { color: theme.colors.neutral.dark200 },
                  ]}
                >
                  {i18next.t("error.componentStack")}
                </Text>
                <Text
                  selectable
                  style={[
                    styles.errorBoxMessage,
                    { color: theme.colors.neutral.dark100 },
                  ]}
                >
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={this.handleRetry}
              style={[
                styles.retryButton,
                {
                  backgroundColor: theme.colors.primary.main,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Text style={styles.retryText}>
                {i18next.t("error.tryAgain")}
              </Text>
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
  errorBox: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorBoxTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  errorBoxMessage: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
