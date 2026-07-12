import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { Ionicons } from "../../lib/icons";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const { theme } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error.main
    : isFocused
      ? theme.colors.primary.main
      : theme.colors.neutral.light300;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: theme.colors.background.light,
            borderRadius: theme.borderRadius.md,
            borderWidth: theme.borderWidth.hairline,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={
              isFocused
                ? theme.colors.primary.main
                : theme.colors.neutral.light400
            }
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.neutral.dark300,
              fontFamily: theme.fontFamily.english,
            },
            leftIcon ? { paddingLeft: 0 } : null,
            rightIcon ? { paddingRight: 0 } : null,
          ]}
          placeholderTextColor={theme.colors.neutral.light400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={20}
            color={theme.colors.neutral.light400}
            style={styles.iconRight}
          />
        )}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helper,
            {
              color: error
                ? theme.colors.error.main
                : theme.colors.neutral.light400,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  helper: {
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.4,
  },
});
