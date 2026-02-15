import { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVaultStore, CollectionItem } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function SearchScreen() {
  const router = useRouter();
  const { items } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'name', label: 'Name' },
    { id: 'tags', label: 'Tags' },
    { id: 'location', label: 'Location' },
  ];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    
    return items.filter((item) => {
      switch (selectedFilter) {
        case 'name':
          return item.name.toLowerCase().includes(query);
        case 'tags':
          return item.tags.some((tag) => tag.toLowerCase().includes(query));
        case 'location':
          return item.location?.toLowerCase().includes(query);
        default:
          return (
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            item.location?.toLowerCase().includes(query)
          );
      }
    });
  }, [items, searchQuery, selectedFilter]);

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
        {item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your collection..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.id && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          filteredItems.length > 0 ? (
            <Text style={styles.resultsCount}>
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No Results Found' : 'Search Your Collection'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Type to search by name, tags, or location'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  searchContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text,
  },
  clearButton: {
    fontSize: 14,
    color: colors.textTertiary,
    padding: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  filterButtonActive: {
    backgroundColor: colors.brand,
  },
  filterButtonText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  resultsCount: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
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
  tagsRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.brandLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: fontSize.footnote,
    color: colors.brand,
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
  },
});
