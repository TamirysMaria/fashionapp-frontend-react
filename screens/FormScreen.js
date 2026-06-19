import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createEntry, updateEntry } from '../services/api';

const PINK = '#ff6b9d';
const PINK_LIGHT = '#fff0f5';
const DARK = '#1a1a2e';
const BORDER = '#f0e6f0';

const SIZE_OPTIONS = {
  Camisetas: ['PP', 'P', 'M', 'G', 'GG'],
  Vestidos: ['PP', 'P', 'M', 'G', 'GG'],
  Jaquetas: ['PP', 'P', 'M', 'G', 'GG'],
  Calças: ['32', '34', '36', '38', '40', '42', '44'],
  Sapatos: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
  Acessórios: ['Único'],
};

const CATEGORIES = Object.keys(SIZE_OPTIONS);

function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{title}</Text>
          <ScrollView>
            {options.map((opt) => {
              const isSelected = opt === selected;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => { onSelect(opt); onClose(); }}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                  {isSelected && <Text style={styles.optionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.sheetCancel} onPress={onClose}>
            <Text style={styles.sheetCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function FieldPicker({ label, value, placeholder, onPress, disabled }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.pickerBtn, disabled && styles.pickerDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.pickerValue : styles.pickerPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.pickerArrow}>▾</Text>
      </TouchableOpacity>
    </View>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function FormScreen({ route, navigation }) {
  const editingProduct = route.params?.product || null;
  const isEditing = !!editingProduct;

  const emptyForm = () => ({
    title: '',
    category: '',
    size: '',
    price: '',
    description: '',
    happenedAt: new Date().toISOString().slice(0, 10),
  });

  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [catPicker, setCatPicker] = useState(false);
  const [sizePicker, setSizePicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setForm({
        title: editingProduct.title,
        category: editingProduct.category,
        size: editingProduct.size,
        price: String(editingProduct.price),
        description: editingProduct.description,
        happenedAt: new Date(editingProduct.happenedAt).toISOString().slice(0, 10),
      });
    }
  }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.category || !form.size || !form.price || !form.description.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de salvar.');
      return;
    }
    const priceNum = parseFloat(form.price.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Preço inválido', 'Informe um preço válido.');
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      size: form.size,
      price: priceNum,
      description: form.description.trim(),
      happenedAt: new Date(form.happenedAt),
    };

    try {
      if (isEditing) {
        await updateEntry(editingProduct._id, payload);
      } else {
        await createEntry(payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const availableSizes = SIZE_OPTIONS[form.category] || [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header da tela */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nome */}
        <Field label="Nome do Produto *">
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(v) => set('title', v)}
            placeholder="Ex: Vestido Floral Primavera"
            placeholderTextColor="#ccc"
          />
        </Field>

        {/* Categoria */}
        <FieldPicker
          label="Categoria *"
          value={form.category}
          placeholder="Selecione uma categoria"
          onPress={() => setCatPicker(true)}
        />

        {/* Tamanho */}
        <FieldPicker
          label="Tamanho *"
          value={form.size}
          placeholder={form.category ? 'Selecione o tamanho' : 'Selecione a categoria primeiro'}
          onPress={() => setSizePicker(true)}
          disabled={!form.category}
        />

        {/* Preço */}
        <Field label="Preço (R$) *">
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(v) => set('price', v)}
            placeholder="0,00"
            placeholderTextColor="#ccc"
            keyboardType="decimal-pad"
          />
        </Field>

        {/* Descrição */}
        <Field label="Descrição *">
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.description}
            onChangeText={(v) => set('description', v)}
            placeholder="Descreva o produto, material, cor, etc."
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>

        {/* Data */}
        <Field label="Data">
          <TextInput
            style={styles.input}
            value={form.happenedAt}
            onChangeText={(v) => set('happenedAt', v)}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#ccc"
          />
        </Field>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.btnSave, saving && styles.btnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSaveText}>
              {isEditing ? 'Salvar alterações' : ' Criar produto'}
            </Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modais de seleção */}
      <PickerModal
        visible={catPicker}
        title="Selecione a Categoria"
        options={CATEGORIES}
        selected={form.category}
        onSelect={(v) => {
          set('category', v);
          set('size', '');
        }}
        onClose={() => setCatPicker(false)}
      />
      <PickerModal
        visible={sizePicker}
        title="Selecione o Tamanho"
        options={availableSizes}
        selected={form.size}
        onSelect={(v) => set('size', v)}
        onClose={() => setSizePicker(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#fff',
  },
  backBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  backBtnText: { color: PINK, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 7 },

  input: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: DARK,
    backgroundColor: '#fafafa',
  },
  textarea: { height: 100, textAlignVertical: 'top' },

  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#fafafa',
  },
  pickerDisabled: { opacity: 0.45 },
  pickerValue: { fontSize: 15, color: DARK, fontWeight: '500' },
  pickerPlaceholder: { fontSize: 15, color: '#ccc' },
  pickerArrow: { fontSize: 15, color: '#bbb' },

  btnSave: {
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: PINK,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.6 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  btnCancel: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  btnCancelText: { color: '#aaa', fontSize: 15, fontWeight: '600' },

  // Modal / Sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: DARK, marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingHorizontal: 4,
  },
  optionSelected: { backgroundColor: PINK_LIGHT, borderRadius: 8, paddingHorizontal: 10 },
  optionText: { fontSize: 15, color: DARK },
  optionTextSelected: { color: PINK, fontWeight: '700' },
  optionCheck: { color: PINK, fontSize: 16, fontWeight: '700' },
  sheetCancel: {
    marginTop: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  sheetCancelText: { color: '#666', fontWeight: '700', fontSize: 15 },
});
