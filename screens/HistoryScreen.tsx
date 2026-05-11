/**
 * HistoryScreen.tsx
 * Phase 6: History Dashboard
 *
 * This screen provides a polished summary of recent calculations,
 * success metrics, and quick export/cleanup actions.
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { entries, isLoading, getStats, exportAsJSON, clearAll } = useAuditLog();

  const stats = useMemo(() => getStats() ?? {
    totalEntries: entries.length,
    successfulOperations: entries.filter((entry) => entry.metadata.success).length,
    failedOperations: entries.filter((entry) => !entry.metadata.success).length,
    successRate: entries.length ? entries.filter((entry) => entry.metadata.success).length / entries.length : 0,
    madhabs: entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.madhab] = (acc[entry.madhab] || 0) + 1;
      return acc;
    }, {}),
    operations: {},
    lastEntry: entries[0],
  }, [entries, getStats]);

  const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

  const popularMadhab = useMemo(() => {
    const madhabList = Object.entries(stats.madhabs || {});
    if (madhabList.length === 0) return 'لا يوجد';
    const [topMadhab] = madhabList.sort((a, b) => b[1] - a[1]);
    return topMadhab[0] || 'لا يوجد';
  }, [stats.madhabs]);

  const handleClearHistory = useCallback(() => {
    if (entries.length === 0) {
      Alert.alert('السجل فارغ', 'لا يوجد عناصر لحذفها.');
      return;
    }

    Alert.alert(
      'مسح السجل',
      'هل أنت متأكد من حذف جميع العمليات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            clearAll();
          },
        },
      ]
    );
  }, [entries.length, clearAll]);

  const handleExport = useCallback(async () => {
    const exportResult = await exportAsJSON();
    if (!exportResult) {
      Alert.alert('فشل التصدير', 'لم نتمكن من إنشاء ملف السجل. يرجى المحاولة مرة أخرى.');
      return;
    }

    Alert.alert('تم التصدير', 'تم إنشاء ملف السجل بنجاح.');
  }, [exportAsJSON]);

  const renderEntry = ({ item }: { item: AuditLogEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryMadhab}>{item.madhab}</Text>
        <Text style={[styles.entryStatus, item.metadata.success ? styles.entrySuccess : styles.entryFailure]}>
          {item.metadata.success ? 'نجاح' : 'فشل'}
        </Text>
      </View>
      <Text style={styles.entryTime}>{new Date(item.timestamp).toLocaleString('ar-SA')}</Text>
      <Text style={styles.entryInfo} numberOfLines={2}>
        {item.result?.shares.length
          ? `التركة: ${Object.values(item.estate).reduce((sum, value) => sum + Number(value), 0).toFixed(2)} ر.س` : 'بدون نتيجة'}
      </Text>
      <Text style={styles.entryNote}>{item.metadata.notes || 'لا توجد ملاحظات'}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>جارٍ تحميل السجل...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>سجل العمليات</Text>
          <Text style={styles.subtitle}>نظرة عامة على الحسابات الأخيرة والإحصائيات</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>إجمالي العمليات</Text>
          <Text style={styles.statValue}>{stats.totalEntries}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>معدل النجاح</Text>
          <Text style={styles.statValue}>{(stats.successRate * 100).toFixed(0)}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>أحدث مذهب</Text>
          <Text style={styles.statValue}>{popularMadhab}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>سجل حديث</Text>
          <Text style={styles.statValue}>{recentEntries.length}</Text>
        </View>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <MaterialCommunityIcons name="export" size={18} color="#1976d2" />
          <Text style={styles.actionButtonText}>تصدير السجل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]} onPress={handleClearHistory}>
          <MaterialCommunityIcons name="delete" size={18} color="#d32f2f" />
          <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>مسح السجل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>العمليات الأخيرة</Text>
        <Text style={styles.sectionSubtitle}>{entries.length} عنصر في السجل</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="history" size={56} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>لا توجد عمليات سابقة</Text>
          <Text style={styles.emptySubtitle}>ابدأ بحساب ترِكة جديدة وسيظهر السجل هنا تلقائياً.</Text>
        </View>
      ) : (
        <FlatList
          data={recentEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  actionButtonDanger: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
  },
  actionButtonTextDanger: {
    color: '#B91C1C',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  entryMadhab: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  entryStatus: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  entrySuccess: {
    color: '#16A34A',
  },
  entryFailure: {
    color: '#DC2626',
  },
  entryTime: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  entryInfo: {
    color: '#374151',
    fontSize: 13,
    marginBottom: 8,
  },
  entryNote: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
});
