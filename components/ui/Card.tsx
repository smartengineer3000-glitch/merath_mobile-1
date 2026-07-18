import React from "react";
import { View, type ViewStyle, type StyleProp } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

type CardVariant = "elevated" | "outlined" | "filled";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({
  children,
  variant = "elevated",
  padding,
  margin,
  onPress,
  style,
  testID,
}: CardProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap()
    .onBegin(() => {
      if (onPress)
        scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      if (onPress) scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: theme.colors.background.light,
          ...theme.shadows.sm,
        };
      case "outlined":
        return {
          backgroundColor: theme.colors.background.light,
          borderWidth: theme.borderWidth.hairline,
          borderColor: theme.colors.neutral.light200,
        };
      case "filled":
        return {
          backgroundColor: theme.colors.neutral.light50,
        };
    }
  };

  const content = (
    <View
      testID={testID}
      style={[
        getVariantStyle(),
        {
          borderRadius: theme.borderRadius.lg,
          padding: padding ?? theme.spacing.lg,
          margin: margin ?? 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <GestureDetector gesture={tap}>
        <Animated.View style={animatedStyle}>{content}</Animated.View>
      </GestureDetector>
    );
  }

  return content;
}
