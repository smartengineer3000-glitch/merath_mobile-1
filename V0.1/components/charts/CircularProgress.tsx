import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  animationDuration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  color,
  label,
  showValue = true,
  animationDuration = 1000,
}: CircularProgressProps) {
  const { theme } = useAppTheme();
  const progress = useSharedValue(0);
  const displayValue = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const fillColor = color || theme.colors.primary.main;

  useEffect(() => {
    progress.value = 0;
    displayValue.value = 0;
    progress.value = withTiming(value / 100, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
    displayValue.value = withTiming(value, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, animationDuration, progress, displayValue]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={theme.colors.neutral.light200}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          animatedProps={useAnimatedProps(() => ({
            strokeDashoffset: circumference * (1 - progress.value),
          }))}
        />
      </Svg>
      {showValue && (
        <View style={[styles.valueContainer, { width: size, height: size }]}>
          <Animated.Text
            style={[
              styles.valueText,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
                fontSize: size * 0.22,
              },
            ]}
          >
            {Math.round(value)}%
          </Animated.Text>
          {label && (
            <Text
              style={[
                styles.labelText,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                  fontSize: size * 0.1,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontWeight: "700",
  },
  labelText: {
    marginTop: 2,
    fontWeight: "500",
  },
});
