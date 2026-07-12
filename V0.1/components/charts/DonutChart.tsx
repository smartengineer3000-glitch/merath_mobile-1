import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface DonutChartProps {
  data: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  animationDuration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function DonutArc({
  fraction,
  rotation,
  cx,
  cy,
  radius,
  circumference,
  color,
  strokeWidth,
  progress,
}: {
  fraction: number;
  rotation: number;
  cx: number;
  cy: number;
  radius: number;
  circumference: number;
  color: string;
  strokeWidth: number;
  progress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - fraction * progress.value),
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${circumference}`}
      strokeLinecap="round"
      transform={`rotate(${rotation} ${cx} ${cy})`}
      animatedProps={animatedProps}
    />
  );
}

export default function DonutChart({
  data,
  size = 180,
  strokeWidth = 20,
  animationDuration = 800,
}: DonutChartProps) {
  const { theme } = useAppTheme();
  const progress = useSharedValue(0);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [data, animationDuration, progress]);

  let accumulated = 0;
  const arcs = data.map((item) => {
    const fraction = item.value / total;
    const rotation = (accumulated / total) * 360 - 90;
    accumulated += item.value;
    return { fraction, rotation, color: item.color };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={theme.colors.neutral.light200}
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, index) => (
          <DonutArc
            key={index}
            fraction={arc.fraction}
            rotation={arc.rotation}
            cx={cx}
            cy={cy}
            radius={radius}
            circumference={circumference}
            color={arc.color}
            strokeWidth={strokeWidth}
            progress={progress}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
