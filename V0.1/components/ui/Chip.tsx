import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  size?: "sm" | "md";
  testID?: string;
}

export function Chip({
  label,
  selected = false,
  onPress,
  color,
  size = "md",
  testID,
}: ChipProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    onPress?.();
  };

  const accentColor = color || theme.colors.primary.main;

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.7}
        onPress={handlePress}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        style={[
          styles.chip,
          size === "sm" && styles.chipSm,
          {
            backgroundColor: selected ? accentColor : theme.colors.neutral.light100,
            borderColor: selected ? accentColor : theme.colors.neutral.light300,
            borderRadius: theme.borderRadius.full,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            size === "sm" && styles.labelSm,
            {
              color: selected ? "#ffffff" : theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  labelSm: {
    fontSize: 11,
  },
});
