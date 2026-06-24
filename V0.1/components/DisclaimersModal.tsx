/**
 * @file components/DisclaimersModal.tsx
 * @description Modal for displaying legal disclaimers and obtaining user consent
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { getDisclaimer, recordDisclaimerAcceptance } from "../lib/legal/Disclaimers";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DisclaimersModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showPrivacyPolicy?: boolean;
}

const DISCLAIMER_ACCEPTED_KEY = "@merath_disclaimers_accepted";

export function DisclaimersModal({
  visible,
  onAccept,
  onDecline,
  showPrivacyPolicy = false,
}: DisclaimersModalProps) {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<"main" | "privacy" | "terms">("main");

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_ACCEPTED_KEY, "true");
      recordDisclaimerAcceptance("main");
      onAccept();
    } catch (error) {
      console.error("Failed to save disclaimer acceptance:", error);
      onAccept();
    }
  };

  const disclaimerText = getDisclaimer(activeTab);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.primary.main }]}>
              Legal Disclaimers
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.neutral.dark200 }]}>
              Please read and accept to continue
            </Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "main" && { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={() => setActiveTab("main")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "main" ? theme.colors.background.light : theme.colors.neutral.dark300 },
                ]}
              >
                Disclaimer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "privacy" && { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={() => setActiveTab("privacy")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "privacy" ? theme.colors.background.light : theme.colors.neutral.dark300 },
                ]}
              >
                Privacy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "terms" && { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={() => setActiveTab("terms")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === "terms" ? theme.colors.background.light : theme.colors.neutral.dark300 },
                ]}
              >
                Terms
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
            <Text style={[styles.text, { color: theme.colors.neutral.dark300 }]}>
              {disclaimerText}
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton, { borderColor: theme.colors.error.main }]}
              onPress={onDecline}
            >
              <Text style={[styles.buttonText, { color: theme.colors.error.main }]}>
                Decline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton, { backgroundColor: theme.colors.primary.main }]}
              onPress={handleAccept}
            >
              <Text style={[styles.buttonText, { color: theme.colors.background.light }]}>
                Accept & Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 600,
    maxHeight: "80%",
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "monospace",
  },
  footer: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  declineButton: {
    borderWidth: 2,
  },
  acceptButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
