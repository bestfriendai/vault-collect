import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useVaultStore } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function NewItemScreen() {
  const router = useRouter();
  const { collections, addItem, selectedCollectionId } = useVaultStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    condition: '' as 'mint' | 'excellent' | 'good' | 'fair' | 'poor' | '',
    purchasePrice: '',
    currentValue: '',
    location: '',
    tags: '',
    notes: '',
    category: selectedCollectionId || 'default',
    photoUri: '',
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, photoUri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter an item name.');
      return;
    }

    const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    
    addItem({
      name: formData.name.trim(),
      description: formData.description || undefined,
      quantity: formData.quantity,
      condition: formData.condition || undefined,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      location: formData.location || undefined,
      tags,
      notes: formData.notes || undefined,
      category: formData.category,
      photoUri: formData.photoUri || undefined,
    });
    
    router.back();
  };

  const conditionOptions = [
    { id: '', label: 'None' },
    { id: 'mint', label: 'Mint' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
    { id: 'poor', label: 'Poor' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Photo */}
      <View style={styles.photoSection}>
        <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
          {formData.photoUri ? (
            <Image source={{ uri: formData.photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderIcon}>📷</Text>
              <Text style={styles.photoPlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {formData.photoUri && (
          <TouchableOpacity 
            style={styles.removePhotoButton}
            onPress={() => setFormData({ ...formData, photoUri: '' })}
          >
            <Text style={styles.removePhotoText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Collection Picker */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Collection *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.collectionPicker}>
            {collections.map((col) => (
              <TouchableOpacity
                key={col.id}
                style={[
                  styles.collectionOption,
                  formData.category === col.id && styles.collectionOptionActive,
                  { borderColor: col.color },
                ]}
                onPress={() => setFormData({ ...formData, category: col.id })}
              >
                <Text style={styles.collectionIcon}>{col.icon}</Text>
                <Text 
                  style={[
                    styles.collectionName,
                    formData.category === col.id && styles.collectionNameActive,
                  ]}
                >
                  {col.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="What is this item?"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Brief description..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={formData.quantity.toString()}
              onChangeText={(text) => setFormData({ ...formData, quantity: parseInt(text) || 1 })}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <View style={[styles.field, { flex: 2 }]}>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.conditionPicker}>
              {conditionOptions.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.conditionOption,
                    formData.condition === c.id && styles.conditionOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, condition: c.id as any })}
                >
                  <Text 
                    style={[
                      styles.conditionOptionText,
                      formData.condition === c.id && styles.conditionOptionTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Purchase Price</Text>
            <TextInput
              style={styles.input}
              value={formData.purchasePrice}
              onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
              keyboardType="decimal-pad"
              placeholder="$0.00"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Current Value</Text>
            <TextInput
              style={styles.input}
              value={formData.currentValue}
              onChangeText={(text) => setFormData({ ...formData, currentValue: text })}
              keyboardType="decimal-pad"
              placeholder="$0.00"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="e.g., Shelf A, Box 3"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={formData.tags}
            onChangeText={(text) => setFormData({ ...formData, tags: text })}
            placeholder="rare, vintage, signed (comma separated)"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Any additional notes..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add to Collection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  photoSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  photoButton: {
    width: 140,
    height: 140,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  photoPlaceholderIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  photoPlaceholderText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  form: {
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  collectionPicker: {
    flexDirection: 'row',
  },
  collectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  collectionOptionActive: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  collectionIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  collectionName: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  collectionNameActive: {
    color: colors.brand,
  },
  conditionPicker: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  conditionOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conditionOptionActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  conditionOptionText: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  conditionOptionTextActive: {
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});
