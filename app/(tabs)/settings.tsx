import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useVaultStore } from '../../src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

interface SettingsRow {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremium } = useVaultStore();

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'This would restore your Premium subscription from the App Store.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: () => {
            // RevenueCat restore logic would go here
            Alert.alert('Restored', 'Your purchase has been restored.');
            setPremium(true);
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your collection as JSON?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Coming Soon', 'Export feature coming in a future update.') },
      ]
    );
  };

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@vaultcollect.app');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy');
  };

  const sections: SettingsSection[] = [
    {
      title: 'ACCOUNT',
      rows: [
        {
          icon: '⭐',
          title: isPremium ? 'Premium Active' : 'Upgrade to Premium',
          subtitle: isPremium ? 'Thank you for supporting!' : 'Unlock all features',
          onPress: () => router.push('/paywall'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'DATA',
      rows: [
        {
          icon: '📤',
          title: 'Export Collection',
          subtitle: 'Save your data as JSON',
          onPress: handleExportData,
          showChevron: true,
        },
        {
          icon: '📥',
          title: 'Import Collection',
          subtitle: 'Load from backup',
          onPress: () => Alert.alert('Coming Soon', 'Import feature coming in a future update.'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'SUPPORT',
      rows: [
        {
          icon: '⭐',
          title: 'Rate VaultCollect',
          subtitle: 'Leave a review on the App Store',
          onPress: handleRateApp,
          showChevron: true,
        },
        {
          icon: '✉️',
          title: 'Contact Support',
          subtitle: 'Get help with any issues',
          onPress: handleSupport,
          showChevron: true,
        },
        {
          icon: '🔒',
          title: 'Privacy Policy',
          onPress: handlePrivacyPolicy,
          showChevron: true,
        },
      ],
    },
    {
      title: 'ABOUT',
      rows: [
        {
          icon: 'ℹ️',
          title: 'Version',
          subtitle: '1.0.0 (1)',
        },
      ],
    },
  ];

  const renderRow = (row: SettingsRow, index: number, sectionLength: number) => (
    <TouchableOpacity
      key={row.title}
      style={[
        styles.row,
        index < sectionLength - 1 && styles.rowBorder,
        row.destructive && styles.rowDestructive,
      ]}
      onPress={row.onPress}
      disabled={!row.onPress}
      activeOpacity={row.onPress ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{row.icon}</Text>
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, row.destructive && styles.rowTitleDestructive]}>
            {row.title}
          </Text>
          {row.subtitle && <Text style={styles.rowSubtitle}>{row.subtitle}</Text>}
        </View>
      </View>
      {row.showChevron && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sections.map((section, sectionIndex) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.rows.map((row, rowIndex) => 
              renderRow(row, rowIndex, section.rows.length)
            )}
          </View>
        </View>
      ))}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>VaultCollect</Text>
        <Text style={styles.footerSubtext}>Made with 💚 for collectors</Text>
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
    padding: spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowDestructive: {
    // No special styling needed, using text color
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  rowTitleDestructive: {
    color: colors.destructive,
  },
  rowSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: colors.textTertiary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  footerSubtext: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
