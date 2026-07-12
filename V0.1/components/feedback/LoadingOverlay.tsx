import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const { theme } = useAppTheme();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.light,
              borderRadius: theme.borderRadius.lg,
              ...theme.shadows.lg,
            },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          {message && (
            <Text
              style={[
                styles.message,
                {
                  color: theme.colors.neutral.dark200,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    paddingHorizontal: 32,
    paddingVertical: 28,
    alignItems: "center",
    minWidth: 140,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
