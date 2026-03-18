import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useFavorites, FavoriteItem } from '../lib/context/FavoritesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const FavoritesScreen = () => {
  const { favorites, removeFavorite, loadFavorite, clearFavorites } = useFavorites();
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLoad = (item: FavoriteItem) => {
    (navigation as any).navigate('Calculator', { screen: 'Main', params: { loadResult: item.result } });
  };

  const handleRemove = (id: string) => {
    Alert.alert('إزالة من المفضلة', 'هل أنت متأكد؟', [
      { text: 'إلغاء' },
      { text: 'إزالة', onPress: () => removeFavorite(id) },
    ]);
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleLoad(item)}
      onLongPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.madhab}>{item.result.madhhabName}</Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString('ar-SA')}
        </Text>
      </View>
      <Text style={styles.amount}>
        {item.result.shares.reduce((sum, s) => sum + s.amount, 0).toFixed(2)} ر.س
      </Text>
      {item.note && <Text style={styles.note}>{item.note}</Text>}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <MaterialCommunityIcons name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="star-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>لا توجد نتائج مفضلة</Text>
        <Text style={styles.emptySubtext}>أضف نتائج إلى المفضلة من شاشة النتائج</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>المفضلة</Text>
        {favorites.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert('مسح الكل', 'هل أنت متأكد؟', [
                { text: 'إلغاء' },
                { text: 'مسح', onPress: clearFavorites },
              ]);
            }}
          >
            <Text style={styles.clearText}>مسح الكل</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>تفاصيل المفضلة</Text>
                <Text style={styles.modalDetail}>المذهب: {selectedItem.result.madhhabName}</Text>
                <Text style={styles.modalDetail}>
                  المبلغ: {selectedItem.result.shares.reduce((sum, s) => sum + s.amount, 0).toFixed(2)} ر.س
                </Text>
                <Text style={styles.modalDetail}>التاريخ: {new Date(selectedItem.timestamp).toLocaleDateString('ar-SA')}</Text>
                {selectedItem.note && <Text style={styles.modalDetail}>ملاحظة: {selectedItem.note}</Text>}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, styles.modalLoad]} onPress={() => { setModalVisible(false); handleLoad(selectedItem); }}>
                    <Text style={styles.modalButtonText}>تحميل</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.modalDelete]} onPress={() => { setModalVisible(false); handleRemove(selectedItem.id); }}>
                    <Text style={styles.modalButtonText}>إزالة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCancelText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  title: { fontSize: 20, fontWeight: '600' },
  clearText: { color: '#f44336', fontWeight: '500' },
  list: { padding: 16 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  madhab: { fontSize: 16, fontWeight: '600', color: '#1976d2' },
  date: { fontSize: 12, color: '#666' },
  amount: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  note: { fontSize: 14, color: '#666', marginBottom: 8, fontStyle: 'italic' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, textAlign: 'center' },
  modalDetail: { fontSize: 14, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  modalButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, minWidth: 80, alignItems: 'center' },
  modalLoad: { backgroundColor: '#1976d2' },
  modalDelete: { backgroundColor: '#f44336' },
  modalCancel: { backgroundColor: '#f5f5f5' },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  modalCancelText: { color: '#666', fontWeight: '600' },
});

export default FavoritesScreen;
