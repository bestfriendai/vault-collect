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
import { useRouter } from 'expo-router';
import { useVaultStore, Collection } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function CollectionsScreen() {
  const router = useRouter();
  const { collections, selectCollection, deleteCollection } = useVaultStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleCollectionPress = (collection: Collection) => {
    selectCollection(collection.id);
    router.push(`/collection/${collection.id}`);
  };

  const handleAddCollection = () => {
    router.push('/collection/new');
  };

  const handleDeleteCollection = (collection: Collection) => {
    if (collection.id === 'default') {
      Alert.alert('Cannot Delete', 'The default collection cannot be deleted.');
      return;
    }
    
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"? This will also delete all items in this collection.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCollection(collection.id),
        },
      ]
    );
  };

  const renderCollection = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={styles.collectionCard}
      onPress={() => handleCollectionPress(item)}
      onLongPress={() => handleDeleteCollection(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{item.name}</Text>
        <Text style={styles.collectionMeta}>
          {item.itemCount} item{item.itemCount !== 1 ? 's' : ''}
        </Text>
        {item.description && (
          <Text style={styles.collectionDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={renderCollection}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Collections</Text>
            <Text style={styles.headerSubtitle}>
              {totalItems} total item{totalItems !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Collections Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first collection to start cataloging your items
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddCollection}
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
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  collectionMeta: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  collectionDescription: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
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
    paddingHorizontal: spacing.xl,
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
