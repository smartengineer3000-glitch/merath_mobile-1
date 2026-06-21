import React from 'react';
import { Platform, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type IconProps = {
  name: string;
  color: string;
  size: number;
};

export const Icon = ({ name, color, size }: IconProps) => {
  if (Platform.OS === 'web') {
    // Fallback: simple text symbol or nothing
    const symbols: Record<string, string> = {
      calculator: '🧮',
      compare: '⚖️',
      'test-tube': '🧪',
      cog: '⚙️',
      information: 'ℹ️',
    };
    return <Text style={{ fontSize: size, color }}>{symbols[name] || '📄'}</Text>;
  }
  return <MaterialCommunityIcons name={name as any} color={color} size={size} />;
};
