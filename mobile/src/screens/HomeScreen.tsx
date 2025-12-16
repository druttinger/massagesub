import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { contentApi } from '../services/api';

interface BonusContent {
  id: number;
  title: string;
  description: string;
  contentType: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  isFeatured: boolean;
  subscriberOnly: boolean;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const { currentSubscription, hasSubscription, fetchMySubscription } = useSubscriptionStore();
  
  const [featuredContent, setFeaturedContent] = useState<BonusContent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      await fetchMySubscription();
      const featured = await contentApi.getFeatured();
      setFeaturedContent(featured);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.main} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.firstName || 'Guest'}</Text>
        </View>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Subscription Status Card */}
      <Card style={styles.subscriptionCard} variant="elevated">
        {hasSubscription && currentSubscription ? (
          <>
            <View style={styles.subscriptionHeader}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{currentSubscription.plan.name}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                currentSubscription.status === 'active' && styles.statusActive,
                currentSubscription.status === 'paused' && styles.statusPaused,
              ]}>
                <Text style={styles.statusText}>
                  {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.subscriptionStats}>
              <View style={styles.statItem}>
                <Ionicons name="body-outline" size={24} color={colors.primary.main} />
                <Text style={styles.statValue}>{currentSubscription.massagesRemaining}</Text>
                <Text style={styles.statLabel}>Massages Left</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary.main} />
                <Text style={styles.statValue}>
                  {new Date(currentSubscription.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.statLabel}>Next Billing</Text>
              </View>
            </View>
            
            <Button
              title="Book Appointment"
              onPress={() => navigation.navigate('Appointments')}
              fullWidth
              style={styles.bookButton}
            />
          </>
        ) : (
          <>
            <View style={styles.noSubscriptionContent}>
              <Ionicons name="sparkles-outline" size={48} color={colors.primary.main} />
              <Text style={styles.noSubscriptionTitle}>Start Your Wellness Journey</Text>
              <Text style={styles.noSubscriptionText}>
                Subscribe to unlock monthly massages, exclusive content, and priority booking.
              </Text>
            </View>
            <Button
              title="View Subscription Plans"
              onPress={() => navigation.navigate('Subscription')}
              fullWidth
            />
          </>
        )}
      </Card>

      {/* Featured Content Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Wellness Content</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Content')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredContent.length > 0 ? (
          featuredContent.map((content) => (
            <TouchableOpacity
              key={content.id}
              style={styles.contentCard}
              onPress={() => navigation.navigate('Content', { contentId: content.id })}
            >
              <Image
                source={{ uri: content.thumbnailUrl }}
                style={styles.contentThumbnail}
                resizeMode="cover"
              />
              <View style={styles.contentInfo}>
                <View style={styles.contentMeta}>
                  <View style={styles.contentTypeBadge}>
                    <Ionicons
                      name={content.contentType === 'video' ? 'play-circle' : content.contentType === 'audio' ? 'musical-notes' : 'document-text'}
                      size={12}
                      color={colors.primary.main}
                    />
                    <Text style={styles.contentTypeText}>{content.contentType}</Text>
                  </View>
                  {content.subscriberOnly && !hasSubscription && (
                    <View style={styles.lockedBadge}>
                      <Ionicons name="lock-closed" size={10} color={colors.text.light} />
                    </View>
                  )}
                </View>
                <Text style={styles.contentTitle} numberOfLines={2}>{content.title}</Text>
                <Text style={styles.contentDuration}>{content.duration}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Card variant="outlined" style={styles.emptyCard}>
            <Text style={styles.emptyText}>No featured content available</Text>
          </Card>
        )}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  logo: {
    width: 70,
    height: 70,
  },
  subscriptionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.background.card,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  planBadge: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  planBadgeText: {
    color: colors.primary.dark,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusActive: {
    backgroundColor: colors.status.success + '20',
  },
  statusPaused: {
    backgroundColor: colors.status.warning + '20',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  subscriptionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  bookButton: {
    marginTop: spacing.md,
  },
  noSubscriptionContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noSubscriptionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  noSubscriptionText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentThumbnail: {
    width: 100,
    height: 80,
  },
  contentInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  contentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contentTypeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.medium,
  },
  lockedBadge: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  contentTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  contentDuration: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.text.muted,
  },
});
