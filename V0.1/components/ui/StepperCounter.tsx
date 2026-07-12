import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface StepperCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  label?: string;
  testID?: string;
}

export function StepperCounter({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 20,
  label,
  testID,
}: StepperCounterProps) {
  const { theme } = useAppTheme();
  const incScale = useSharedValue(1);
  const decScale = useSharedValue(1);

  const incAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: incScale.value }],
  }));

  const decAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: decScale.value }],
  }));

  const handleIncrement = () => {
    if (value >= max) return;
    incScale.value = withSpring(0.85, { damping: 15, stiffness: 400 }, () => {
      incScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  };

  const handleDecrement = () => {
    if (value <= min) return;
    decScale.value = withSpring(0.85, { damping: 15, stiffness: 400 }, () => {
      decScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  };

  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.stepper}>
        <Animated.View style={decAnimated}>
          <TouchableOpacity
            onPress={handleDecrement}
            disabled={value <= min}
            activeOpacity={0.7}
            style={[
              styles.button,
              {
                backgroundColor: value <= min ? theme.colors.neutral.light100 : theme.colors.primary.lighter,
                borderRadius: theme.borderRadius.sm,
              },
            ]}
          >
            <Ionicons
              name="remove"
              size={18}
              color={value <= min ? theme.colors.neutral.light400 : theme.colors.primary.main}
            />
          </TouchableOpacity>
        </Animated.View>

        <Text
          style={[
            styles.value,
            {
              color: theme.colors.neutral.dark300,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {value}
        </Text>

        <Animated.View style={incAnimated}>
          <TouchableOpacity
            onPress={handleIncrement}
            disabled={value >= max}
            activeOpacity={0.7}
            style={[
              styles.button,
              {
                backgroundColor: value >= max ? theme.colors.neutral.light100 : theme.colors.primary.lighter,
                borderRadius: theme.borderRadius.sm,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={18}
              color={value >= max ? theme.colors.neutral.light400 : theme.colors.primary.main}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 28,
    textAlign: "center",
  },
});
