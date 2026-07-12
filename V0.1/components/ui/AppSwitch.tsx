import React from "react";
import { View, Text, Switch as RNSwitch, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface AppSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export function AppSwitch({ label, value, onValueChange, description }: AppSwitchProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.neutral.light200, true: theme.colors.primary.light100 }}
        thumbColor={value ? theme.colors.primary.main : theme.colors.neutral.light400}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
});
