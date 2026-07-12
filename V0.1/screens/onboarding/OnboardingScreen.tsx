import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "../../lib/icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Step {
  icon: string;
  titleKey: string;
  descKey: string;
}

const STEPS: Step[] = [
  {
    icon: "home",
    titleKey: "onboarding.welcome",
    descKey: "onboarding.welcomeDescription",
  },
  {
    icon: "calculator",
    titleKey: "onboarding.howToCalculate",
    descKey: "onboarding.howToCalculateDescription",
  },
  {
    icon: "share-social",
    titleKey: "onboarding.resultsAndSharing",
    descKey: "onboarding.resultsAndSharingDescription",
  },
];

export default function OnboardingScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [currentStep, setCurrentStep] = useState(0);
  const translateX = useSharedValue(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      translateX.value = withSpring(-next * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 100,
      });
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      translateX.value = withSpring(-prev * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 100,
      });
    }
  };

  const handleComplete = () => {
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  const handleSkip = () => {
    handleComplete();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      {/* Skip button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip}>
          <Text
            style={[
              styles.skipText,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("common.close")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        <Animated.View style={[styles.slidesRow, animatedStyle]}>
          {STEPS.map((step, i) => (
            <View key={i} style={[styles.slide, { width: SCREEN_WIDTH }]}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: theme.colors.primary.lighter,
                    borderRadius: 48,
                  },
                ]}
              >
                <Ionicons
                  name={step.icon as any}
                  size={48}
                  color={theme.colors.primary.main}
                />
              </View>
              <Text
                style={[
                  styles.slideTitle,
                  {
                    color: theme.colors.neutral.dark300,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t(step.titleKey)}
              </Text>
              <Text
                style={[
                  styles.slideDesc,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t(step.descKey)}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === currentStep
                    ? theme.colors.primary.main
                    : theme.colors.neutral.light300,
                width: i === currentStep ? 24 : 8,
                borderRadius: 4,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttons}>
        {currentStep > 0 ? (
          <TouchableOpacity
            onPress={handlePrev}
            style={[styles.prevButton, { borderRadius: theme.borderRadius.md }]}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.prevButton} />
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            {
              backgroundColor: theme.colors.primary.main,
              borderRadius: theme.borderRadius.md,
            },
          ]}
        >
          <Text
            style={[
              styles.nextText,
              { color: "#ffffff", fontFamily: theme.fontFamily.english },
            ]}
          >
            {currentStep === STEPS.length - 1
              ? t("onboarding.startNow")
              : t("onboarding.next")}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipText: { fontSize: 14, fontWeight: "500" },
  slidesContainer: { flex: 1, overflow: "hidden" },
  slidesRow: { flexDirection: "row", flex: 1 },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  dot: { height: 8 },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  prevButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    height: 48,
    gap: 8,
  },
  nextText: { fontSize: 16, fontWeight: "600" },
});
