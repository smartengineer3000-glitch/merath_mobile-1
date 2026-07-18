import React from "react";
import { View, Text, Modal, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { Button } from "./ui";

interface DisclaimersModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showPrivacyPolicy?: boolean;
}

export function DisclaimersModal({
  visible,
  onAccept,
  onDecline,
  showPrivacyPolicy = true,
}: DisclaimersModalProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <SafeAreaView style={styles.safe}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.background.light,
                borderRadius: theme.borderRadius.xl,
              },
            ]}
          >
            <View
              style={[
                styles.handle,
                { backgroundColor: theme.colors.neutral.light200 },
              ]}
            />
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.neutral.dark300,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("disclaimer.title")}
            </Text>

            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.colors.primary.main,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("disclaimer.calculationDisclaimer")}
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      color: theme.colors.neutral.dark200,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("disclaimer.calculationDisclaimerText")}
                </Text>
              </View>

              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.colors.primary.main,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("disclaimer.notLegalAdvice")}
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      color: theme.colors.neutral.dark200,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {t("disclaimer.notLegalAdviceText")}
                </Text>
              </View>

              {showPrivacyPolicy && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: theme.colors.primary.main,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t("disclaimer.privacyPolicy")}
                  </Text>
                  <Text
                    style={[
                      styles.body,
                      {
                        color: theme.colors.neutral.dark200,
                        fontFamily: theme.fontFamily.english,
                      },
                    ]}
                  >
                    {t("disclaimer.privacyPolicyText")}
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.buttons}>
              <Button
                title={t("disclaimer.decline")}
                onPress={onDecline}
                variant="text"
                style={styles.declineButton}
              />
              <Button
                title={t("disclaimer.accept")}
                onPress={onAccept}
                variant="primary"
                style={styles.acceptButton}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  safe: {
    flex: 0,
  },
  card: {
    maxHeight: "80%",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  scroll: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  declineButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 2,
  },
});
