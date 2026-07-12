import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  count?: number;
  style?: ViewStyle;
}

export default function SkeletonLoader({
  width = "100%",
  height = 16,
  borderRadius,
  count = 1,
  style,
}: SkeletonLoaderProps) {
  const { theme } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const defaultRadius = borderRadius ?? Math.min(height, 8);

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.skeleton,
            {
              width: width as any,
              height,
              borderRadius: defaultRadius,
              backgroundColor: theme.colors.neutral.light200,
              opacity,
              marginBottom: count > 1 ? 8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

// Pre-built skeleton patterns
export function CardSkeleton({ theme }: { theme: any }) {
  return (
    <View
      style={[
        styles.cardSkeleton,
        {
          backgroundColor: theme.colors.background.light,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.sm,
        },
      ]}
    >
      <SkeletonLoader width={60} height={12} borderRadius={4} />
      <View style={{ height: 12 }} />
      <SkeletonLoader width="100%" height={14} borderRadius={4} />
      <SkeletonLoader width="80%" height={14} borderRadius={4} />
      <View style={{ height: 8 }} />
      <SkeletonLoader width="40%" height={20} borderRadius={10} />
    </View>
  );
}

export function ListSkeleton({
  count = 5,
  theme,
}: {
  count?: number;
  theme: any;
}) {
  return (
    <View style={styles.listSkeleton}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.listItemSkeleton,
            { borderBottomColor: theme.colors.neutral.light100 },
          ]}
        >
          <SkeletonLoader width={44} height={44} borderRadius={22} />
          <View style={styles.listItemContent}>
            <SkeletonLoader width="70%" height={14} borderRadius={4} />
            <SkeletonLoader width="50%" height={10} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  skeleton: {},
  cardSkeleton: {
    padding: 16,
  },
  listSkeleton: {},
  listItemSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
    gap: 6,
  },
});
