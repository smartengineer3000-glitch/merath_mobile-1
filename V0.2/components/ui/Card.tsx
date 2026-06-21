import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type CardProps = {
  children: React.ReactNode;
  style?: object;
};

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: theme.elevation.level1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
