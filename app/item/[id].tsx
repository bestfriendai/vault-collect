import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useVaultStore } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItem, deleteItem } = useVaultStore();
  
  const item = items.find((i) => i.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    quantity: 1,
    condition: '' as 'mint' | 'excellent' | 'good' | 'fair' | 'poor' | '',
    purchasePrice: '',
    currentValue: '',
    location: '',
    tags: '',
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setEditData({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        condition: item.condition || '',
        purchasePrice: item.purchasePrice?.toString() || '',
        currentValue: item.currentValue?.toString() || '',
        location: item.location || '',
        tags: item.tags.join(', '),
        notes: item.notes || '',
      });
    }
  }, [item]);

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❓</Text>
          <Text style={styles.emptyTitle}>Item Not Found</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateItem(item.id, { photoUri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    const tags = editData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    
    updateItem(item.id, {
      name: editData.name,
      description: editData.description || undefined,
      quantity: editData.quantity,
      condition: editData.condition as 'mint' | 'excellent' | 'good' | 'fair' | 'poor' | undefined,
      purchasePrice: editData.purchasePrice ? parseFloat(editData.purchasePrice) : undefined,
      currentValue: editData.currentValue ? parseFloat(editData.currentValue) : undefined,
      location: editData.location || undefined,
      tags,
      notes: editData.notes || undefined,
    });
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            router.back();
          },
        },
      ]
    );
  };

  const ConditionBadge = ({ condition }: { condition: string }) => {
    const conditionColors: Record<string, string> = {
      mint: colors.success,
      excellent: '#30D158',
      good: colors.brand,
      fair: colors.warning,
      poor: colors.destructive,
    };
    
    return (
      <View style={[styles.conditionBadge, { backgroundColor: (conditionColors[condition] || colors.textTertiary) + '20' }]}>
        <Text style={[styles.conditionBadgeText, { color: conditionColors[condition] || colors.textTertiary }]}>
          {condition.charAt(0).toUpperCase() + condition.slice(1)}
        </Text>
      </View>
    );
  };

  if (isEditing) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
            {item.photoUri ? (
              <Image source={{ uri: item.photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderIcon}>📷</Text>
                <Text style={styles.photoPlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={editData.name}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
              placeholder="Item name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editData.description}
              onChangeText={(text) => setEditData({ ...editData, description: text })}
              placeholder="Description"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={editData.quantity.toString()}
                onChangeText={(text) => setEditData({ ...editData, quantity: parseInt(text) || 1 })}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Condition</Text>
              <View style={styles.conditionPicker}>
                {['mint', 'excellent', 'good', 'fair', 'poor'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.conditionOption, editData.condition === c && styles.conditionOptionActive]}
                    onPress={() => setEditData({ ...editData, condition: c as any })}
                  >
                    <Text style={[styles.conditionOptionText, editData.condition === c && styles.conditionOptionTextActive]}>
                      {c.charAt(0).toUpperCase()}
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
                value={editData.purchasePrice}
                onChangeText={(text) => setEditData({ ...editData, purchasePrice: text })}
                keyboardType="decimal-pad"
                placeholder="$0.00"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Current Value</Text>
              <TextInput
                style={styles.input}
                value={editData.currentValue}
                onChangeText={(text) => setEditData({ ...editData, currentValue: text })}
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
              value={editData.location}
              onChangeText={(text) => setEditData({ ...editData, location: text })}
              placeholder="e.g., Shelf A, Box 3"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={editData.tags}
              onChangeText={(text) => setEditData({ ...editData, tags: text })}
              placeholder="rare, vintage, signed"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editData.notes}
              onChangeText={(text) => setEditData({ ...editData, notes: text })}
              placeholder="Additional notes..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Photo */}
      <View style={styles.photoSection}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.photoLarge} />
        ) : (
          <View style={[styles.photoLarge, styles.photoPlaceholderLarge]}>
            <Text style={styles.photoPlaceholderIconLarge}>📦</Text>
          </View>
        )}
        <TouchableOpacity style={styles.editPhotoButton} onPress={handlePickImage}>
          <Text style={styles.editPhotoButtonText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        {item.condition && <ConditionBadge condition={item.condition} />}
      </View>

      {item.description && <Text style={styles.description}>{item.description}</Text>}

      {/* Quick Info */}
      <View style={styles.quickInfo}>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoLabel}>Quantity</Text>
          <Text style={styles.quickInfoValue}>{item.quantity}</Text>
        </View>
        {item.currentValue && (
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Value</Text>
            <Text style={styles.quickInfoValue}>${item.currentValue.toFixed(2)}</Text>
          </View>
        )}
        {item.location && (
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Location</Text>
            <Text style={styles.quickInfoValue}>{item.location}</Text>
          </View>
        )}
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsList}>
          {item.purchasePrice && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purchase Price</Text>
              <Text style={styles.detailValue}>${item.purchasePrice.toFixed(2)}</Text>
            </View>
          )}
          {item.purchaseDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purchase Date</Text>
              <Text style={styles.detailValue}>{new Date(item.purchaseDate).toLocaleDateString()}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Added</Text>
            <Text style={styles.detailValue}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Updated</Text>
            <Text style={styles.detailValue}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      {item.tags.length > 0 && (
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsList}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Notes */}
      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>Edit Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Item</Text>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  photoSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
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
  },
  photoPlaceholderIcon: {
    fontSize: 32,
  },
  photoPlaceholderText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  photoLarge: {
    width: '100%',
    height: 280,
  },
  photoPlaceholderLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  photoPlaceholderIconLarge: {
    fontSize: 64,
  },
  editPhotoButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  editPhotoButtonText: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  name: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  conditionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  conditionBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  description: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    padding: spacing.md,
    paddingTop: 0,
    backgroundColor: colors.surface,
  },
  quickInfo: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickInfoLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quickInfoValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  detailsSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailsList: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.body,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  tagsSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.brandLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  tagText: {
    fontSize: fontSize.caption,
    color: colors.brand,
    fontWeight: fontWeight.medium,
  },
  notesSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  notesText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  editButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  deleteButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.destructive,
  },
  deleteButtonText: {
    color: colors.destructive,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  // Edit Form Styles
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
    backgroundColor: colors.surfaceSecondary,
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
  conditionPicker: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  conditionOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conditionOptionActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  conditionOptionText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  conditionOptionTextActive: {
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});
