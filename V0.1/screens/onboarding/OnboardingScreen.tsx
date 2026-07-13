import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  I18nManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETED_KEY = "@merath_onboarding_completed";

interface OnboardingStep {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  detailsKey?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    icon: "🕌",
    titleKey: "onboarding.welcome",
    descriptionKey: "onboarding.welcomeDescription",
    detailsKey: "onboarding.welcomeDetails",
  },
  {
    icon: "⚖️",
    titleKey: "onboarding.howToCalculate",
    descriptionKey: "onboarding.howToCalculateDescription",
  },
  {
    icon: "📊",
    titleKey: "onboarding.resultsAndSharing",
    descriptionKey: "onboarding.resultsAndSharingDescription",
  },
];

export const OnboardingScreen = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const totalSteps = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[step];

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  }, [step, totalSteps]);

  const handleComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    } catch {
      // Storage failure is non-critical
    }
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleComplete}
    >
      <View
        style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.stepCounter}>
                {step + 1}/{totalSteps}
              </Text>
              <TouchableOpacity
                onPress={handleComplete}
                accessible
                accessibilityLabel={t("common.close")}
                accessibilityRole="button"
              >
                <Text style={styles.skip}>{t("common.close")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{current.icon}</Text>
            </View>

            <Text style={styles.title}>{t(current.titleKey)}</Text>

            <Text style={styles.description}>
              {t(current.descriptionKey)}
            </Text>

            {current.detailsKey && (
              <Text style={styles.details}>{t(current.detailsKey)}</Text>
            )}

            <View style={styles.dots}>
              {ONBOARDING_STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === step ? "#2e7d32" : "#d0d0d0",
                    },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              accessible
              accessibilityLabel={
                step === totalSteps - 1
                  ? t("onboarding.startNow")
                  : t("onboarding.next")
              }
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>
                {step === totalSteps - 1
                  ? t("onboarding.startNow")
                  : t("onboarding.next")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export async function shouldShowOnboarding(): Promise<boolean> {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return !completed;
  } catch {
    return false;
  }
}

export { ONBOARDING_COMPLETED_KEY };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  skip: {
    fontSize: 14,
    fontWeight: "600",
    padding: 8,
    color: "#1565c0",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#2e7d32",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
    color: "#333",
  },
  details: {
    fontSize: 14,
    textAlign: I18nManager.isRTL ? "left" : "right",
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
    color: "#555",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#2e7d32",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
