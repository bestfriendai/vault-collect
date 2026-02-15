import { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVaultStore, CollectionItem } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function CollectionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { collections, items, deleteCollection } = useVaultStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const collection = collections.find((c) => c.id === id);
  const collectionItems = items.filter((item) => item.category === id);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (!collection) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❓</Text>
          <Text style={styles.emptyTitle}>Collection Not Found</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAddItem = () => {
    router.push('/item/new');
  };

  const handleDeleteCollection = () => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}" and all its items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteCollection(collection.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleItemPress = (item: CollectionItem) => {
    router.push(`/item/${item.id}`);
  };

  const renderItem = ({ item }: { item: CollectionItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      {item.photoUri ? (
        <View style={styles.itemImage}>
          <Text style={styles.imagePlaceholder}>📷</Text>
        </View>
      ) : (
        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
          <Text style={styles.imagePlaceholder}>📦</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          Qty: {item.quantity} • {item.condition || 'No condition'}
        </Text>
        {item.currentValue ? (
          <Text style={styles.itemValue}>${item.currentValue.toFixed(2)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const totalValue = collectionItems.reduce((sum, item) => sum + (item.currentValue || 0) * item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Collection Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: collection.color + '20' }]}>
          <Text style={styles.icon}>{collection.icon}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          {collection.description && (
            <Text style={styles.collectionDescription}>{collection.description}</Text>
          )}
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {collectionItems.length} item{collectionItems.length !== 1 ? 's' : ''}
            </Text>
            {totalValue > 0 && (
              <>
                <Text style={styles.statsDot}>•</Text>
                <Text style={styles.statsText}>${totalValue.toFixed(2)}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Items List */}
      <FlatList
        data={collectionItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          collectionItems.length > 0 ? (
            <Text style={styles.sectionTitle}>Items</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first item to this collection
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddItem}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  headerInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  collectionDescription: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statsText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
  statsDot: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.surfaceSecondary,
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  itemMeta: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemValue: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.brand,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
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
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.white,
    fontWeight: fontWeight.regular,
  },
});
