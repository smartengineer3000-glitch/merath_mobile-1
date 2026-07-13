import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { IconButton } from "../ui/IconButton";

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  onLeftPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
}

export function AnimatedHeader({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}: AnimatedHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {leftIcon && (
          <IconButton name={leftIcon} onPress={onLeftPress} size={22} />
        )}
        <View style={leftIcon ? styles.titleWithIcon : styles.titleOnly}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightIcon && (
        <IconButton name={rightIcon} onPress={onRightPress} size={22} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleWithIcon: {
    marginStart: 8,
  },
  titleOnly: {},
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
