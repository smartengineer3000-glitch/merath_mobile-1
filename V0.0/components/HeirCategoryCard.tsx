import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './ui/Card';
import { Stepper } from './ui/Stepper';
import { useAppTheme } from '../hooks/useAppTheme';
import { HeirType, Madhab } from '../lib/inheritance/types';
// Try to import hijab status, fallback gracefully
let getHijabStatus: any = () => ({ isBlocked: false });
try {
  const hijab = require('../lib/inheritance/hijab-system');
  getHijabStatus = hijab.getHijabStatus || (() => ({ isBlocked: false }));
} catch (e) {}

type HeirEntry = {
  type: HeirType;
  label: string;
  count: number;
};

type HeirCategoryCardProps = {
  categoryTitle: string;
  heirs: HeirEntry[];
  allSelectedHeirs: { type: HeirType; count: number }[];
  madhab: Madhab;
  onHeirChange: (type: HeirType, newCount: number) => void;
};

export const HeirCategoryCard: React.FC<HeirCategoryCardProps> = ({
  categoryTitle,
  heirs,
  allSelectedHeirs,
  madhab,
  onHeirChange,
}) => {
  const theme = useAppTheme();

  return (
    <Card style={{ marginBottom: theme.spacing.md }}>
      <Text style={[theme.typography.titleLarge, { color: theme.colors.primary, marginBottom: theme.spacing.sm }]}>
        {categoryTitle}
      </Text>
      {heirs.map((heir) => {
        const blocked = getHijabStatus(heir.type, allSelectedHeirs, madhab);
        return (
          <View key={heir.type} style={{ marginBottom: theme.spacing.sm }}>
            <Text style={[theme.typography.bodyLarge, { color: theme.colors.onSurface }]}>{heir.label}</Text>
            {blocked.isBlocked ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: theme.colors.error, marginRight: theme.spacing.xs }}>⛔</Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.error }]}>{blocked.reason}</Text>
              </View>
            ) : (
              <Stepper
                value={heir.count}
                onIncrease={() => onHeirChange(heir.type, heir.count + 1)}
                onDecrease={() => onHeirChange(heir.type, Math.max(0, heir.count - 1))}
                min={0}
                max={heir.type === 'son' || heir.type === 'daughter' ? 15 : 1}
              />
            )}
          </View>
        );
      })}
    </Card>
  );
};
