import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { getHeirByType } from "../../constants/heirData";
import { Avatar, Badge } from "../ui";

interface HeirListProps {
  selectedHeirs: Record<string, number>;
}

export function HeirList({ selectedHeirs }: HeirListProps) {
  const { theme } = useAppTheme();
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
                style={[
                  styles.name,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {key.replace(/_/g, " ")}
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
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 13, fontWeight: "500", textTransform: "capitalize" },
});
