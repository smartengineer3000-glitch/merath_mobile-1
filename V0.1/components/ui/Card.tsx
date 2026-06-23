/**
 * @file components/ui/Card.tsx
 * @description Material Design 3 Card component for elevated content
 */

import React from "react";
import { View, ViewStyle, Pressable, AccessibilityRole } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

export type CardElevation = "flat" | "low" | "medium" | "high";

export interface ModernCardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  elevation = "medium",
  onPress,
  style,
  padding,
  accessibilityLabel,
  accessibilityRole = "button",
}) => {
  const { theme } = useAppTheme();

  const getElevationStyles = (): ViewStyle => {
    switch (elevation) {
      case "flat":
        return theme.shadows.none;
      case "low":
        return theme.shadows.sm;
      case "high":
        return theme.shadows.lg;
      case "medium":
      default:
        return theme.shadows.md;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background.light,
    borderRadius: theme.borderRadius.lg,
    padding: padding ?? theme.spacing.md,
    ...getElevationStyles(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          cardStyle,
          style,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

export { ModernCard as Card };
export default ModernCard;
