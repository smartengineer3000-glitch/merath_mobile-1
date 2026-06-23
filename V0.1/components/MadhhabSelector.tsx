/**
 * @file components/MadhhabSelector.tsx
 * @description Compact Madhab selector with dropdown alternative
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../lib/context/ThemeProvider";
import type { Theme } from "../lib/design/theme";
import type { MadhhabType } from "../lib/inheritance/types";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface MadhhabSelectorProps {
  selectedMadhab?: MadhhabType;
  onSelect: (madhab: MadhhabType) => void;
}

const MADHAB_DATA: {
  id: MadhhabType;
  name: string;
  nameEn: string;
  icon: IconName;
  color: string;
  hint: string;
}[] = [
  {
    id: "hanafi",
    name: "الحنفي",
    nameEn: "Hanafi",
    icon: "school",
    color: "#10B981",
    hint: "منهج واسع الانتشار في آسيا والبلاد الإسلامية",
  },
  {
    id: "maliki",
    name: "المالكي",
    nameEn: "Maliki",
    icon: "book-open-variant",
    color: "#4f9eff",
    hint: "معتمد في المغرب العربي وأجزاء من إفريقيا",
  },
  {
    id: "shafii",
    name: "الشافعي",
    nameEn: "Shafi'i",
    icon: "lightbulb-on",
    color: "#F59E0B",
    hint: "شائع في شرق إفريقيا وجنوب شرق آسيا",
  },
  {
    id: "hanbali",
    name: "الحنبلي",
    nameEn: "Hanbali",
    icon: "book",
    color: "#EF4444",
    hint: "منهج فقهي دقيق في مسائل الفرائض",
  },
];

export function MadhhabSelector({
  selectedMadhab = "hanafi",
  onSelect,
}: MadhhabSelectorProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Option 1: Compact Grid (2x2)
  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="School of law selection"
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.selectorEyebrow}>طريقة الحساب</Text>
          <Text style={styles.selectorTitle}>اختر المذهب الفقهي</Text>
        </View>
        <View style={styles.trustBadge}>
          <MaterialCommunityIcons
            name="shield-check"
            size={15}
            color={theme.colors.primary.main}
          />
          <Text style={styles.trustBadgeText}>قابل للمقارنة</Text>
        </View>
      </View>
      <View style={styles.explanationCard}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={theme.colors.secondary.main}
        />
        <Text style={styles.explanationText}>
          قد تختلف بعض الحالات الخاصة بين المذاهب. اختر المدرسة المعتمدة لديك،
          ثم استخدم شاشة المقارنة بعد الحساب لفهم أي فروقات.
        </Text>
      </View>
      <View style={styles.gridContainer}>
        {MADHAB_DATA.map((madhab) => {
          const isSelected = selectedMadhab === madhab.id;

          return (
            <TouchableOpacity
              key={madhab.id}
              style={[
                styles.gridItem,
                isSelected && styles.gridItemSelected,
                { borderColor: madhab.color },
              ]}
              onPress={() => onSelect(madhab.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityLabel={`${madhab.nameEn} school of law`}
              accessibilityState={{ selected: isSelected }}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${madhab.color}15` },
                ]}
              >
                <MaterialCommunityIcons
                  name={madhab.icon}
                  size={20}
                  color={madhab.color}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.madhabName}>{madhab.name}</Text>
                <Text style={styles.madhabNameEn}>{madhab.nameEn}</Text>
                <Text style={styles.madhabHint}>{madhab.hint}</Text>
              </View>
              {isSelected && (
                <View
                  style={[
                    styles.selectedBadge,
                    { backgroundColor: madhab.color },
                  ]}
                >
                  <MaterialCommunityIcons name="check" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    selectorEyebrow: {
      ...theme.typography.label.medium,
      color: theme.colors.tertiary.dark200,
      fontFamily: "Inter-Bold",
    },
    selectorTitle: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.dark300,
      fontFamily: "Inter-Bold",
      marginTop: 2,
    },
    trustBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    trustBadgeText: {
      ...theme.typography.label.small,
      color: theme.colors.primary.main,
      fontFamily: "Inter-Bold",
    },
    explanationCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.secondary.light,
      borderWidth: 1,
      borderColor: theme.colors.secondary.lighter,
      marginBottom: theme.spacing.md,
    },
    explanationText: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.dark200,
      flex: 1,
      fontFamily: "Inter-Regular",
    },
    // Compact Grid Style (2x2 on wide, stacks on narrow)
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    gridItem: {
      minWidth: 130,
      flexBasis: "48%",
      flexGrow: 1,
      minHeight: 118,
      alignItems: "flex-start",
      backgroundColor: theme.colors.background.light,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
      position: "relative",
      ...theme.shadows.xs,
    },
    gridItemSelected: {
      borderWidth: 2,
      backgroundColor: theme.colors.primary.light,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    textContainer: {
      flex: 1,
    },
    madhabName: {
      ...theme.typography.title.medium,
      color: theme.colors.neutral.dark300,
      marginBottom: 2,
    },
    madhabNameEn: {
      ...theme.typography.label.small,
      color: theme.colors.neutral.dark200,
      fontFamily: "Inter-Regular",
    },
    madhabHint: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.xs,
      fontFamily: "Inter-Regular",
    },
    selectedBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default MadhhabSelector;
