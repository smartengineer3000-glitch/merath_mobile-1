import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { EmptyState } from "../../components/ui";

export default function OnboardingScreen() {
  const { theme } = useAppTheme();

  return (
    <ScreenContainer>
      <EmptyState
        icon="!"
        title="Welcome to Merath"
        message="Islamic Inheritance Calculator"
      />
    </ScreenContainer>
  );
}
