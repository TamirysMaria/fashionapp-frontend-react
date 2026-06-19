import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEntries, deleteEntry } from '../services/api';

const PINK = '#ff6b9d';
const PINK_LIGHT = '#fff0f5';
const DARK = '#1a1a2e';
const BORDER = '#f0e6f0';
const GRAY_BG = '#fafafa';

function ProductCard({ product, onEdit, onDelete }) {
  const date = new Date(product.happenedAt).toLocaleDateString('pt-BR');
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{product.category}</Text>
        </View>
        <Text style={styles.cardPrice}>R$ {Number(product.price).toFixed(2)}</Text>
      </View>
      <Text style={styles.cardTitle}>{product.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {product.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.sizeTag}>
          <Text style={styles.sizeTagText}>Tam. {product.size}</Text>
        </View>
        <Text style={styles.cardDate}>{date}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(product)}>
          <Text style={styles.btnEditText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() =>
            Alert.alert('Excluir produto', `Deseja excluir "${product.title}"?`, [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => onDelete(product._id),
              },
            ])
          }
        >
          <Text style={styles.btnDeleteText}>🗑  Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntries();
      setProducts(data);
    } catch (e) {
      setError('Não foi possível carregar os produtos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela ganhar foco (ex: voltando do FormScreen)
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o produto.');
    }
  };

  const handleEdit = (product) => {
    navigation.navigate('Form', { product });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fashion App</Text>
          <Text style={styles.headerSub}>Gerenciador de Catálogo</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadProducts}>
          <Text style={styles.refreshBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadProducts}>
            <Text style={styles.retryBtnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p._id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              {products.length > 0
                ? `${products.length} produto${products.length !== 1 ? 's' : ''}`
                : ''}
            </Text>
          }
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color={PINK} size="large" style={{ marginTop: 60 }} />
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Catálogo vazio</Text>
                <Text style={styles.emptyHint}>Toque em "+" para adicionar o primeiro produto</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <ProductCard product={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          refreshing={loading}
          onRefresh={loadProducts}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Form', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: PINK },
  headerSub: { fontSize: 13, color: '#999', marginTop: 1 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PINK_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtnText: { fontSize: 18 },

  list: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 14, color: '#aaa', fontWeight: '600', marginBottom: 10 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: PINK,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: PINK,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardPrice: { fontSize: 18, fontWeight: '800', color: PINK },
  cardTitle: { fontSize: 17, fontWeight: '700', color: DARK, marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sizeTag: {
    backgroundColor: PINK_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ffc8dd',
  },
  sizeTagText: { color: PINK, fontSize: 12, fontWeight: '700' },
  cardDate: { fontSize: 12, color: '#bbb' },
  cardActions: { flexDirection: 'row', gap: 10 },
  btnEdit: {
    flex: 1,
    backgroundColor: PINK_LIGHT,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffc8dd',
  },
  btnEditText: { color: PINK, fontWeight: '700', fontSize: 14 },
  btnDelete: {
    flex: 1,
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  btnDeleteText: { color: '#e53935', fontWeight: '700', fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PINK,
    shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36 },

  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  errorText: { color: '#e53935', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: PINK,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  empty: { alignItems: 'center', paddingTop: 70 },
  emptyIcon: { fontSize: 56, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#555', marginBottom: 6 },
  emptyHint: { fontSize: 14, color: '#bbb', textAlign: 'center' },
});
