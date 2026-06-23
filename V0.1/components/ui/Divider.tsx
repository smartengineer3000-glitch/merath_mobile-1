import React from "react";
import { View, ViewStyle } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  margins?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color,
  thickness = 1,
  margins = 12,
}) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color ?? theme.colors.neutral.light200,
          marginVertical: margins,
        },
        style,
      ]}
    />
  );
};

export default Divider;
