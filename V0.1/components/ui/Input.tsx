/**
 * @file components/ui/Input.tsx
 * @description Material Design 3 text input component
 */

import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

export interface ModernInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?:
    | "default"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  onIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  icon,
  onIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  maxLength,
}) => {
  const [focused, setFocused] = useState(false);
  const { theme } = useAppTheme();

  const containerStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: error ? theme.colors.error.main : theme.colors.neutral.light400,
    marginBottom: theme.spacing.xs,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: multiline ? "flex-start" : "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: multiline ? theme.spacing.md : 0,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
    borderColor: error
      ? theme.colors.error.main
      : focused
        ? theme.colors.primary.main
        : theme.colors.secondary.main,
    marginTop: theme.spacing.xs,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.neutral.dark300,
    paddingVertical: multiline ? 0 : theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={[containerStyle, style]}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && (
            <Text style={{ color: theme.colors.error.main }}>*</Text>
          )}
        </Text>
      )}
      <View style={inputContainerStyle}>
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral.light400}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />
        {icon && (
          <Pressable onPress={onIconPress} disabled={!onIconPress}>
            {icon}
          </Pressable>
        )}
      </View>
      {error && errorMessage && <Text style={errorStyle}>{errorMessage}</Text>}
    </View>
  );
};
