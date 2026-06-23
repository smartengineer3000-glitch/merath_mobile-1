import React, { useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Animated,
  ViewStyle,
  StyleProp,
  Platform,
  AccessibilityProps,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Animations } from "../../lib/design/theme";

type HapticStyle = "light" | "medium" | "heavy" | "none";

interface PressableScaleProps extends AccessibilityProps {
  onPress: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  duration?: number;
  haptic?: HapticStyle;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PressableScale: React.FC<PressableScaleProps> = ({
  onPress,
  onLongPress,
  style,
  containerStyle,
  scaleTo = 0.96,
  duration = Animations.quick,
  haptic = "none",
  disabled = false,
  children,
  ...accessibilityProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerHaptic = useCallback(() => {
    if (disabled || haptic === "none" || Platform.OS === "web") return;
    try {
      switch (haptic) {
        case "light":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch {
      if (__DEV__) console.log("Haptics not available");
    }
  }, [disabled, haptic]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
  };

  const handlePress = useCallback(() => {
    triggerHaptic();
    onPress();
  }, [onPress, triggerHaptic]);

  return (
    <Animated.View
      style={[{ transform: [{ scale: scaleAnim }] }, containerStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={style}
        {...accessibilityProps}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PressableScale;
