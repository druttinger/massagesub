import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useSubscriptionStore } from '../stores/subscriptionStore';

interface Plan {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  massagesPerMonth: number;
  durationMinutes: number;
  features: string[];
}

export function SubscriptionScreen() {
  const { 
    plans, 
    currentSubscription, 
    hasSubscription, 
    isLoading,
    fetchPlans, 
    fetchMySubscription,
    subscribe,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
  } = useSubscriptionStore();
  
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchMySubscription();
  }, []);

  const handleSubscribe = async (planId: number) => {
    Alert.alert(
      'Subscribe to Plan',
      'This is a demo. In production, you would be redirected to payment processing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe (Mock)',
          onPress: async () => {
            setSubscribing(true);
            try {
              await subscribe(planId);
              Alert.alert('Success!', 'You are now subscribed. Welcome to Blue Sky Mountain Massage!');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to subscribe');
            } finally {
              setSubscribing(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert('Subscription Cancelled', 'We\'re sorry to see you go!');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to cancel');
            }
          },
        },
      ]
    );
  };

  const handlePause = async () => {
    try {
      await pauseSubscription();
      Alert.alert('Subscription Paused', 'Your subscription has been paused. You can resume anytime.');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to pause');
    }
  };

  const handleResume = async () => {
    try {
      await resumeSubscription();
      Alert.alert('Subscription Resumed', 'Welcome back! Your subscription is now active.');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to resume');
    }
  };

  const getPlanIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'relaxation': return 'leaf-outline';
      case 'wellness': return 'fitness-outline';
      case 'rejuvenation': return 'sparkles-outline';
      default: return 'star-outline';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Subscription */}
      {hasSubscription && currentSubscription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Subscription</Text>
          <Card variant="elevated" style={styles.currentPlanCard}>
            <View style={styles.currentPlanHeader}>
              <View style={styles.currentPlanIcon}>
                <Ionicons 
                  name={getPlanIcon(currentSubscription.plan.name) as any} 
                  size={32} 
                  color={colors.primary.main} 
                />
              </View>
              <View style={styles.currentPlanInfo}>
                <Text style={styles.currentPlanName}>{currentSubscription.plan.name} Plan</Text>
                <Text style={styles.currentPlanPrice}>
                  ${currentSubscription.plan.priceMonthly.toFixed(2)}/month
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                currentSubscription.status === 'active' && styles.statusActive,
                currentSubscription.status === 'paused' && styles.statusPaused,
              ]}>
                <Text style={styles.statusText}>{currentSubscription.status}</Text>
              </View>
            </View>
            
            <View style={styles.subscriptionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Massages Remaining</Text>
                <Text style={styles.detailValue}>{currentSubscription.massagesRemaining}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next Billing Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {new Date(currentSubscription.startDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              {currentSubscription.status === 'active' ? (
                <Button
                  title="Pause Subscription"
                  onPress={handlePause}
                  variant="outline"
                  fullWidth
                />
              ) : (
                <Button
                  title="Resume Subscription"
                  onPress={handleResume}
                  fullWidth
                />
              )}
              <TouchableOpacity onPress={handleCancel} style={styles.cancelLink}>
                <Text style={styles.cancelLinkText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      )}

      {/* Available Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {hasSubscription ? 'Other Plans' : 'Choose Your Plan'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          Unlock monthly massages and exclusive wellness content
        </Text>

        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            onPress={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
            activeOpacity={0.9}
          >
            <Card 
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                currentSubscription?.planId === plan.id && styles.planCardCurrent,
              ]}
              variant={selectedPlan === plan.id ? 'elevated' : 'outlined'}
            >
              {currentSubscription?.planId === plan.id && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Plan</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={[styles.planIcon, selectedPlan === plan.id && styles.planIconSelected]}>
                  <Ionicons 
                    name={getPlanIcon(plan.name) as any} 
                    size={28} 
                    color={selectedPlan === plan.id ? colors.primary.contrast : colors.primary.main} 
                  />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
              </View>

              <View style={styles.planPricing}>
                <Text style={styles.planPrice}>${plan.priceMonthly.toFixed(0)}</Text>
                <Text style={styles.planPeriod}>/month</Text>
              </View>

              <View style={styles.planHighlight}>
                <Ionicons name="body-outline" size={20} color={colors.primary.main} />
                <Text style={styles.planHighlightText}>
                  {plan.massagesPerMonth} × {plan.durationMinutes}-minute massage{plan.massagesPerMonth > 1 ? 's' : ''}/month
                </Text>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.status.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && currentSubscription?.planId !== plan.id && (
                <Button
                  title={hasSubscription ? 'Switch to This Plan' : 'Subscribe Now'}
                  onPress={() => handleSubscribe(plan.id)}
                  loading={subscribing}
                  fullWidth
                  style={styles.subscribeButton}
                />
              )}
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Notice */}
      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={20} color={colors.text.muted} />
        <Text style={styles.noticeText}>
          This is a demo app. No actual payments will be processed.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  currentPlanCard: {
    backgroundColor: colors.background.card,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentPlanIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPlanInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  currentPlanName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  currentPlanPrice: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusActive: {
    backgroundColor: colors.status.success + '20',
  },
  statusPaused: {
    backgroundColor: colors.status.warning + '20',
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  subscriptionDetails: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  actionButtons: {
    gap: spacing.md,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelLinkText: {
    fontSize: typography.fontSize.sm,
    color: colors.status.error,
  },
  planCard: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  planCardCurrent: {
    opacity: 0.7,
  },
  currentBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  currentBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.contrast,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planIconSelected: {
    backgroundColor: colors.primary.main,
  },
  planInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  planName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  planDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  planPrice: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  planPeriod: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    marginLeft: spacing.xs,
  },
  planHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  planHighlightText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.dark,
  },
  planFeatures: {
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  subscribeButton: {
    marginTop: spacing.lg,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
  },
});
