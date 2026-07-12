import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, Badge, EmptyState, Chip, Button } from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { formatCurrency } from "../../lib/utils/formatters";
import type { CalculationResult } from "../../lib/inheritance/types";

export default function HistoryScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { previousResults, currentResult, clearResults } = useCalculationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMadhab, setFilterMadhab] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);

  const allResults = useMemo(() => {
    const results = [];
    if (currentResult) results.push(currentResult);
    results.push(...previousResults);
    return results;
  }, [currentResult, previousResults]);

  const filteredResults = useMemo(() => {
    let items = allResults;
    if (filterMadhab) {
      items = items.filter((r) => r.madhab === filterMadhab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((r) =>
        r.madhhabName.toLowerCase().includes(q) ||
        r.shares.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    return items;
  }, [allResults, filterMadhab, searchQuery]);

  const renderItem = useCallback(({ item }: { item: CalculationResult }) => {
    const total = item.shares.reduce((sum, s) => sum + s.amount, 0);
    const uniqueHeirs = [...new Set(item.shares.map((s) => s.name))];

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("HistoryDetail", { result: item })}
        activeOpacity={0.7}
        style={[styles.item, { borderColor: theme.colors.neutral.light200 }]}
      >
        <View style={styles.itemHeader}>
          <Badge label={item.madhhabName} color={theme.colors.primary.main} size="sm" />
          {item.specialCases?.awl && <Badge label="Awl" color={theme.colors.warning.main} size="sm" />}
          {item.specialCases?.radd && <Badge label="Radd" color={theme.colors.info.main} size="sm" />}
        </View>

        <Text style={[styles.itemAmount, { color: theme.colors.neutral.dark300, fontFamily: theme.fontFamily.english }]}>
          {formatCurrency(total)} SAR
        </Text>

        <Text style={[styles.itemHeirs, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]} numberOfLines={1}>
          {uniqueHeirs.join(", ")}
        </Text>

        <View style={styles.itemFooter}>
          <Text style={[styles.itemMeta, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
            {item.shares.length} shares
          </Text>
          <Text style={[styles.itemMeta, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
            {item.calculationTime?.toFixed(0)}ms
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [navigation, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader
        title={t("history.title")}
        subtitle={`${filteredResults.length} calculations`}
        rightIcon={searchVisible ? "close" : "search"}
        onRightPress={() => { setSearchVisible(!searchVisible); if (searchVisible) setSearchQuery(""); }}
      />

      {/* Search bar */}
      {searchVisible && (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.neutral.light50, borderRadius: theme.borderRadius.md }]}>
          <Ionicons name="search" size={16} color={theme.colors.neutral.light400} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}
            placeholder="Search by heir or madhab..."
            placeholderTextColor={theme.colors.neutral.light400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {[null, "hanafi", "maliki", "shafii", "hanbali"].map((m) => (
          <Chip
            key={m || "all"}
            label={m ? t(`madhab.${m}`) : "All"}
            selected={filterMadhab === m}
            onPress={() => setFilterMadhab(m)}
            size="sm"
          />
        ))}
      </View>

      {/* Results list */}
      <FlatList
        data={filteredResults}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="time"
            title={t("history.noHistory")}
            message={t("history.subtitle")}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13 },
  filterRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 8, flexWrap: "wrap" },
  listContent: { padding: 16, paddingBottom: 32 },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  itemHeader: { flexDirection: "row", gap: 6, marginBottom: 8 },
  itemAmount: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  itemHeirs: { fontSize: 12, marginBottom: 8 },
  itemFooter: { flexDirection: "row", justifyContent: "space-between" },
  itemMeta: { fontSize: 11, fontWeight: "500" },
});
