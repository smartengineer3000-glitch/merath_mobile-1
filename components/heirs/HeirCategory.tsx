import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Ionicons } from "../../lib/icons";
import {
  HEIR_GROUPS,
  getHeirsByGroup,
  type HeirGroup,
  type HeirConfig,
} from "../../constants/heirData";
import { StepperCounter, Badge, Avatar, Card } from "../ui";

interface HeirCategoryProps {
  group: HeirGroup;
  selectedHeirs: Record<string, number>;
  onHeirCountChange: (key: string, count: number) => void;
  deceasedGender?: "male" | "female";
}

export function HeirCategory({
  group,
  selectedHeirs,
  onHeirCountChange,
  deceasedGender,
}: HeirCategoryProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const heirs = getHeirsByGroup(group);
  const groupInfo = HEIR_GROUPS[group];

  const selectedCount = heirs.reduce(
    (sum, h) => sum + (selectedHeirs[h.key] || 0),
    0,
  );

  const impossibleSpouse =
    deceasedGender === "male"
      ? "husband"
      : deceasedGender === "female"
        ? "wife"
        : null;

  return (
    <Card variant="outlined" style={styles.card}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons
            name={groupInfo.icon as any}
            size={20}
            color={theme.colors.primary.main}
          />
          <Text
            style={[
              styles.groupTitle,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t(groupInfo.labelKey)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {selectedCount > 0 && (
            <Badge
              count={selectedCount}
              color={theme.colors.primary.main}
              size="sm"
            />
          )}
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={theme.colors.neutral.light400}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.heirsList}>
          {heirs.map((heir) => (
            <HeirRow
              key={heir.key}
              heir={heir}
              count={selectedHeirs[heir.key] || 0}
              onCountChange={(count) => onHeirCountChange(heir.key, count)}
              maxCount={heir.maxCount}
              disabled={heir.key === impossibleSpouse}
              theme={theme}
              t={t}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

function HeirRow({
  heir,
  count,
  onCountChange,
  maxCount,
  disabled,
  theme,
  t,
}: {
  heir: HeirConfig;
  count: number;
  onCountChange: (count: number) => void;
  maxCount: number;
  disabled?: boolean;
  theme: any;
  t: any;
}) {
  return (
    <View style={[rowStyles.container, disabled && rowStyles.disabled]}>
      <View style={rowStyles.info}>
        <Avatar icon={heir.icon} color={heir.color} size={32} />
        <View style={rowStyles.nameGroup}>
          <Text
            style={[
              rowStyles.name,
              {
                color: disabled
                  ? theme.colors.neutral.light400
                  : theme.colors.neutral.dark200,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t(heir.labelKey)}
          </Text>
          {disabled && (
            <Text
              style={[
                rowStyles.frozenLabel,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("calculator.impossibleSpouse")}
            </Text>
          )}
        </View>
      </View>
      <StepperCounter
        value={count}
        onIncrement={() => onCountChange(count + 1)}
        onDecrement={() => onCountChange(Math.max(0, count - 1))}
        min={0}
        max={maxCount}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  groupTitle: { fontSize: 14, fontWeight: "600" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  heirsList: { marginTop: 12, gap: 4 },
});

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  info: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  nameGroup: { flex: 1 },
  name: { fontSize: 13, fontWeight: "500" },
  frozenLabel: { fontSize: 10, fontStyle: "italic", marginTop: 1 },
});
