import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";

interface AvatarProps {
  icon: string;
  color?: string;
  size?: number;
}

export function Avatar({ icon, color, size = 40 }: AvatarProps) {
  const { theme } = useAppTheme();
  const bgColor = color || theme.colors.primary.lighter;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Ionicons name={icon as any} size={size * 0.5} color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
});
