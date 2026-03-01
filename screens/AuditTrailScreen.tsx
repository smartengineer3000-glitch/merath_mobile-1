/**
 * @file AuditTrailScreen.tsx
 * @description Audit Trail / Calculation History Screen
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import AuditTrailCard from '../components/AuditTrailCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuditTrailScreenProps {
  onSelectEntry?: (entry: AuditLogEntry) => void;
}

type SortField = 'timestamp' | 'madhab' | 'total' | 'confidence';
type SortOrder = 'asc' | 'desc';

const FAVORITES_STORAGE_KEY = '@merath_audit_favorites';

export function AuditTrailScreen({ onSelectEntry }: AuditTrailScreenProps) {
  const { entries: auditEntries, isLoading: initialLoading, auditLog } = useAuditLog();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMadhab, setSelectedMadhab] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const uniqueMadhabs = useMemo(
    () => AuditTrailManager.getUniqueMadhabs(auditEntries),
    [auditEntries, refreshTimestamp]
  );

  const filteredResult = useMemo(() => {
    return AuditTrailManager.filterEntries(auditEntries, {
      madhab: selectedMadhab || undefined,
      searchTerm: searchTerm.trim(),
    });
  }, [auditEntries, selectedMadhab, searchTerm, refreshTimestamp]);

  const sortedEntries = useMemo(() => {
    return AuditTrailManager.sortEntries(filteredResult.entries, {
      field: sortField,
      order: sortOrder,
    });
  }, [filteredResult.entries, sortField, sortOrder]);

  const displayedEntries = useMemo(() => {
    if (!showFavoritesOnly) return sortedEntries;
    return sortedEntries.filter((entry) => favorites.has(entry.id || ''));
  }, [sortedEntries, showFavoritesOnly, favorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTimestamp(Date.now());
    setRefreshing(false);
  }, []);

  const handleToggleFavorite = useCallback(async (entryId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...newSet]));
      return newSet;
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>جاري تحميل السجلات...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سجل الحسابات</Text>
        <Text style={styles.headerSubtitle}>
          {filteredResult.filtered}/{filteredResult.total} سجل
        </Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.actionButtonIcon}>⚙️</Text>
          <Text style={styles.actionButtonText}>تصفية</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, showFavoritesOnly && styles.actionButtonActive]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Text style={styles.actionButtonIcon}>{showFavoritesOnly ? '⭐' : '☆'}</Text>
          <Text style={styles.actionButtonText}>المفضلة</Text>
        </TouchableOpacity>
      </View>

      {displayedEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>لا توجد سجلات</Text>
        </View>
      ) : (
        <FlatList
          data={displayedEntries}
          keyExtractor={(item) => item.id || item.timestamp}
          renderItem={({ item }) => (
            <AuditTrailCard
              entry={item}
              onPress={onSelectEntry}
              isFavorite={favorites.has(item.id || '')}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1976d2']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});

export default AuditTrailScreen;
