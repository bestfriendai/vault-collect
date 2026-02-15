import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useVaultStore } from '@/src/store/vaultStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '@/src/theme';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    features: [
      'Unlimited collections',
      'Unlimited items',
      'Photo storage',
      'Value tracking',
      'Export data',
    ],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$29.99',
    period: '/year',
    savings: 'Save 50%',
    popular: true,
    features: [
      'Everything in Monthly',
      'AI item identification',
      'Value analytics',
      'Priority support',
      'Cloud backup',
    ],
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium, setPremium } = useVaultStore();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (planId: string) => {
    setLoading(true);
    
    // Simulate purchase - in production, use RevenueCat
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setPremium(true);
    setLoading(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    router.back();
  };

  const handleRestore = async () => {
    setLoading(true);
    
    // Simulate restore - in production, use RevenueCat
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
    
    // For demo, restore to premium
    setPremium(true);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.premiumActive}>
          <Text style={styles.premiumActiveIcon}>⭐</Text>
          <Text style={styles.premiumActiveTitle}>Premium Active</Text>
          <Text style={styles.premiumActiveSubtitle}>
            Thank you for supporting VaultCollect!
          </Text>
          <TouchableOpacity style={styles.closeButtonLarge} onPress={handleClose}>
            <Text style={styles.closeButtonLargeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>💎</Text>
          <Text style={styles.heroTitle}>Unlock Premium</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited collections, AI identification, and advanced analytics
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPlan(plan.id);
              }}
              activeOpacity={0.8}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>BEST VALUE</Text>
                </View>
              )}
              {plan.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>{plan.savings}</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>
              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <View style={[
                styles.radioOuter,
                selectedPlan === plan.id && styles.radioOuterSelected,
              ]}>
                <View style={[
                  styles.radioInner,
                  selectedPlan === plan.id && styles.radioInnerSelected,
                ]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity 
          style={[styles.ctaButton, loading && styles.ctaButtonDisabled]}
          onPress={() => handlePurchase(selectedPlan)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.ctaButtonText}>
              Start Free Trial
            </Text>
          )}
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.terms}>
          <Text style={styles.termsText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Your subscription will automatically renew unless canceled.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  plans: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
  },
  planCardPopular: {
    borderColor: colors.brand,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: spacing.md,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  popularBadgeText: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  savingsBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  savingsBadgeText: {
    fontSize: fontSize.footnote,
    fontWeight: fontWeight.semibold,
    color: colors.success,
  },
  planHeader: {
    marginBottom: spacing.md,
  },
  planName: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  planPeriod: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    fontSize: 14,
    color: colors.brand,
    marginRight: spacing.sm,
    fontWeight: fontWeight.bold,
  },
  featureText: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  radioOuter: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.brand,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  radioInnerSelected: {
    backgroundColor: colors.brand,
  },
  ctaButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaButtonText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  restoreButtonText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  terms: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: fontSize.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Premium Active State
  premiumActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  premiumActiveIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  premiumActiveTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  premiumActiveSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  closeButtonLarge: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  closeButtonLargeText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});
