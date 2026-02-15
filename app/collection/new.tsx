import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVaultStore } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

const ICON_OPTIONS = ['📦', '📚', '🎮', '🎨', '🪆', '🪙', '🎸', '🎤', '⚽', '🏀', '📱', '💻', '⌚', '👟', '👕', '🎒', '💼', '🏠', '🚗', '✈️', '🎯', '🎲', '🃏', '📷', '🎥', '🎧', '📀', '💿', '📖', '📕', '🏆', '🥇', '💎', '🔷', '❤️', '⭐', '🌟', '✨', '🔥', '💡', '🎁', '🎀', '🌸', '🌺', '🍀', '🌿', '🍄', '🦋', '🐞', '🐢', '🦎', '🐠', '🦀', '🐙'];
const COLOR_OPTIONS = [
  '#059669', // Emerald
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#DB2777', // Pink
  '#DC2626', // Red
  '#EA580C', // Orange
  '#CA8A04', // Yellow
  '#16A34A', // Green
  '#0891B2', // Cyan
  '#4F46E5', // Indigo
  '#9333EA', // Violet
  '#BE185D', // Rose
];

export default function NewCollectionScreen() {
  const router = useRouter();
  const { addCollection } = useVaultStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#059669',
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter a collection name.');
      return;
    }

    addCollection({
      name: formData.name.trim(),
      description: formData.description || undefined,
      icon: formData.icon,
      color: formData.color,
    });
    
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Preview */}
      <View style={styles.preview}>
        <View style={[styles.previewIcon, { backgroundColor: formData.color + '20' }]}>
          <Text style={styles.previewIconText}>{formData.icon}</Text>
        </View>
        <Text style={styles.previewName}>{formData.name || 'Collection Name'}</Text>
        <Text style={styles.previewMeta}>0 items</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="My Collection"
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
            placeholder="Brief description of your collection..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Icon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconPicker}>
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  formData.icon === icon && styles.iconOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, icon })}
              >
                <Text style={styles.iconOptionText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorPicker}>
            {COLOR_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  formData.color === color && styles.colorOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, color })}
              >
                {formData.color === color && (
                  <Text style={styles.colorCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Collection</Text>
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
  preview: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  previewIconText: {
    fontSize: 36,
  },
  previewName: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  previewMeta: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
  iconPicker: {
    flexDirection: 'row',
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconOptionActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
  },
  iconOptionText: {
    fontSize: 22,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionActive: {
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  colorCheck: {
    color: colors.white,
    fontSize: 16,
    fontWeight: fontWeight.bold,
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
