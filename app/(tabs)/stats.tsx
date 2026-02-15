import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useVaultStore } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

export default function StatsScreen() {
  const router = useRouter();
  const { collections, items, getTotalValue, isPremium } = useVaultStore();
  
  const totalItems = items.length;
  const totalValue = getTotalValue();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Condition breakdown
  const conditionBreakdown = items.reduce((acc, item) => {
    const condition = item.condition || 'Unspecified';
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Collection breakdown
  const collectionBreakdown = collections.map((col) => ({
    name: col.name,
    icon: col.icon,
    count: items.filter((item) => item.category === col.id).length,
    color: col.color,
  })).filter((col) => col.count > 0);

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  const StatCard = ({ title, value, subtitle, icon }: { title: string; value: string; subtitle?: string; icon: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Premium Banner */}
      {!isPremium && (
        <TouchableOpacity style={styles.premiumBanner} onPress={handleUpgrade}>
          <Text style={styles.premiumIcon}>⭐</Text>
          <View style={styles.premiumTextContainer}>
            <Text style={styles.premiumTitle}>Unlock Premium Stats</Text>
            <Text style={styles.premiumSubtitle}>Track value over time, get AI insights</Text>
          </View>
          <Text style={styles.premiumChevron}>›</Text>
        </TouchableOpacity>
      )}

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          subtitle={`${totalQuantity} units`}
          icon="📦"
        />
        <StatCard 
          title="Collection Value" 
          value={`$${totalValue.toFixed(2)}`}
          subtitle="Estimated"
          icon="💰"
        />
        <StatCard 
          title="Collections" 
          value={collections.length.toString()}
          subtitle="Total"
          icon="📁"
        />
        <StatCard 
          title="Avg. Value" 
          value={totalItems > 0 ? `$${(totalValue / totalItems).toFixed(2)}` : '$0.00'}
          subtitle="Per item"
          icon="📊"
        />
      </View>

      {/* Collection Breakdown */}
      {collectionBreakdown.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Collection</Text>
          <View style={styles.breakdownList}>
            {collectionBreakdown.map((col, index) => (
              <View key={index} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownIcon}>{col.icon}</Text>
                  <Text style={styles.breakdownName}>{col.name}</Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownValue}>{col.count}</Text>
                  <View style={[styles.breakdownBar, { width: `${(col.count / totalItems) * 100}%`, backgroundColor: col.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Condition Breakdown */}
      {Object.keys(conditionBreakdown).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Condition</Text>
          <View style={styles.conditionGrid}>
            {Object.entries(conditionBreakdown).map(([condition, count], index) => {
              const conditionColors: Record<string, string> = {
                mint: colors.success,
                excellent: '#30D158',
                good: colors.brand,
                fair: colors.warning,
                poor: colors.destructive,
                Unspecified: colors.textTertiary,
              };
              return (
                <View key={condition} style={styles.conditionCard}>
                  <View style={[styles.conditionDot, { backgroundColor: conditionColors[condition] || colors.textTertiary }]} />
                  <Text style={styles.conditionName}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</Text>
                  <Text style={styles.conditionCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Tags Cloud Preview */}
      {isPremium && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Tags</Text>
          <View style={styles.tagsCloud}>
            {Array.from(new Set(items.flatMap((item) => item.tags)))
              .slice(0, 10)
              .map((tag, index) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
          </View>
        </View>
      )}

      {/* Empty State */}
      {totalItems === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Stats Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add items to your collection to see statistics
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  premiumIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  premiumSubtitle: {
    fontSize: fontSize.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  premiumChevron: {
    fontSize: 24,
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statTitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statSubtitle: {
    fontSize: fontSize.footnote,
    color: colors.textTertiary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  breakdownList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  breakdownName: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  breakdownRight: {
    alignItems: 'flex-end',
    flex: 1,
    maxWidth: 120,
  },
  breakdownValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  breakdownBar: {
    height: 4,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  conditionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  conditionName: {
    fontSize: fontSize.caption,
    color: colors.text,
    marginRight: spacing.sm,
  },
  conditionCount: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  tagsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagChip: {
    backgroundColor: colors.brandLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  tagChipText: {
    fontSize: fontSize.caption,
    color: colors.brand,
    fontWeight: fontWeight.medium,
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
