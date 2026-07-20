import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { EmptyState } from "../../components/ui";
import type { AuditEvent } from "../../lib/context/CalculationContext";

const EVENT_TYPE_CONFIG: Record<
  AuditEvent["type"],
  { color: string; icon: string; labelKey: string }
> = {
  app_open: {
    color: "#4caf50",
    icon: "phone-portrait",
    labelKey: "events.appOpen",
  },
  screen_view: { color: "#2196f3", icon: "eye", labelKey: "events.screenView" },
  calculation_start: {
    color: "#ff9800",
    icon: "calculator",
    labelKey: "events.calcStart",
  },
  calculation_complete: {
    color: "#4caf50",
    icon: "checkmark-circle",
    labelKey: "events.calcComplete",
  },
  calculation_error: {
    color: "#f44336",
    icon: "alert-circle",
    labelKey: "events.calcError",
  },
  heir_update: {
    color: "#9c27b0",
    icon: "people",
    labelKey: "events.heirUpdate",
  },
  estate_update: {
    color: "#00bcd4",
    icon: "wallet",
    labelKey: "events.estateUpdate",
  },
  madhab_change: {
    color: "#ff5722",
    icon: "book",
    labelKey: "events.madhabChange",
  },
  settings_change: {
    color: "#607d8b",
    icon: "settings",
    labelKey: "events.settingsChange",
  },
  data_clear: { color: "#795548", icon: "trash", labelKey: "events.dataClear" },
  comparison_start: {
    color: "#3f51b5",
    icon: "git-compare",
    labelKey: "events.comparisonStart",
  },
  comparison_complete: {
    color: "#4caf50",
    icon: "checkmark-done",
    labelKey: "events.comparisonComplete",
  },
  export: { color: "#009688", icon: "share", labelKey: "events.export" },
  info: {
    color: "#9e9e9e",
    icon: "information-circle",
    labelKey: "events.info",
  },
};

export default function HistoryScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const { events } = useCalculationStore();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => b.timestamp - a.timestamp),
    [events],
  );

  const renderItem = ({ item }: { item: AuditEvent }) => {
    const config = EVENT_TYPE_CONFIG[item.type] || EVENT_TYPE_CONFIG.info;
    const date = new Date(item.timestamp);
    const timeStr = date.toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const dateStr = date.toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
    });

    return (
      <View
        style={[
          styles.eventRow,
          {
            backgroundColor: theme.colors.background.light,
            borderLeftColor: config.color,
          },
        ]}
      >
        <View style={styles.eventHeader}>
          <View
            style={[
              styles.eventTypeBadge,
              { backgroundColor: config.color + "18" },
            ]}
          >
            <Text
              style={[
                styles.eventTypeLabel,
                { color: config.color, fontFamily: theme.fontFamily.english },
              ]}
            >
              {t(config.labelKey)}
            </Text>
          </View>
          <Text
            style={[
              styles.eventTime,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {dateStr} {timeStr}
          </Text>
        </View>
        <Text
          style={[
            styles.eventMessage,
            {
              color: theme.colors.neutral.dark200,
              fontFamily: theme.fontFamily.english,
            },
          ]}
          numberOfLines={3}
        >
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("history.title")}
        subtitle={`${sortedEvents.length} ${t("events.totalEvents")}`}
      />

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={t("history.noHistory")}
            message={t("events.noEvents")}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 32 },
  eventRow: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  eventTypeLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  eventTime: { fontSize: 10, fontWeight: "500" },
  eventMessage: { fontSize: 12, lineHeight: 18 },
});
