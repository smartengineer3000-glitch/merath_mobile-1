import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { getHeirByType } from "../../constants/heirData";
import { Avatar, Badge } from "../ui";

interface HeirListProps {
  selectedHeirs: Record<string, number>;
}

export function HeirList({ selectedHeirs }: HeirListProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const entries = Object.entries(selectedHeirs).filter(
    ([_, count]) => count > 0,
  );

  if (entries.length === 0) return null;

  return (
    <View style={styles.container}>
      {entries.map(([key, count]) => {
        const heir = getHeirByType(key);
        if (!heir) return null;

        return (
          <View
            key={key}
            style={[styles.row, { borderColor: theme.colors.neutral.light200 }]}
          >
            <View style={styles.left}>
              <Avatar icon={heir.icon} color={heir.color} size={28} />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.name,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t(`heirs.${key}`)}
              </Text>
            </View>
            <Badge count={count} color={heir.color} size="sm" />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "capitalize",
    flexShrink: 1,
  },
});
