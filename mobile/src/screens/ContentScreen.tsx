import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../theme';
import { contentApi } from '../services/api';
import { useSubscriptionStore } from '../stores/subscriptionStore';

interface BonusContent {
  id: number;
  title: string;
  description: string;
  contentType: 'video' | 'audio' | 'article';
  contentUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  isFeatured: boolean;
  subscriberOnly: boolean;
  publishedAt: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'wellness', label: 'Wellness', icon: 'heart-outline' },
  { id: 'technique', label: 'Techniques', icon: 'hand-left-outline' },
  { id: 'meditation', label: 'Meditation', icon: 'leaf-outline' },
  { id: 'ayurveda', label: 'Ayurveda', icon: 'flower-outline' },
];

export function ContentScreen() {
  const [content, setContent] = useState<BonusContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  
  const { fetchMySubscription } = useSubscriptionStore();

  const loadContent = async () => {
    try {
      const response = await contentApi.getAll();
      setContent(response.content);
      setHasSubscription(response.hasSubscription);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  useEffect(() => {
    loadContent();
    fetchMySubscription();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle';
      case 'audio': return 'musical-notes';
      case 'article': return 'document-text';
      default: return 'document';
    }
  };

  const handleContentPress = (item: BonusContent) => {
    if (item.subscriberOnly && !hasSubscription) {
      // Show subscription required modal
      return;
    }
    // Navigate to content detail
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                selectedCategory === category.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id ? colors.primary.contrast : colors.primary.main} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content List */}
      <ScrollView
        style={styles.contentList}
        contentContainerStyle={styles.contentListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.main} />
        }
      >
        {!hasSubscription && (
          <Card style={styles.subscriptionBanner} variant="elevated">
            <View style={styles.bannerContent}>
              <Ionicons name="sparkles" size={24} color={colors.primary.main} />
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Unlock All Content</Text>
                <Text style={styles.bannerSubtitle}>Subscribe to access exclusive videos and guides</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Featured Content */}
        {selectedCategory === 'all' && content.filter(c => c.isFeatured).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            {content.filter(c => c.isFeatured).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => handleContentPress(item)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredBadge}>
                    <Ionicons name="star" size={12} color={colors.primary.main} />
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  {item.subscriberOnly && !hasSubscription && (
                    <View style={styles.lockedOverlay}>
                      <Ionicons name="lock-closed" size={32} color={colors.text.light} />
                    </View>
                  )}
                </View>
                <View style={styles.featuredInfo}>
                  <View style={styles.contentMeta}>
                    <View style={styles.typeBadge}>
                      <Ionicons name={getContentIcon(item.contentType) as any} size={14} color={colors.primary.main} />
                      <Text style={styles.typeText}>{item.contentType}</Text>
                    </View>
                    <Text style={styles.duration}>{item.duration}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredDescription} numberOfLines={2}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* All Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Content' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </Text>
          
          {filteredContent.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>No content available in this category</Text>
            </Card>
          ) : (
            filteredContent.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.contentCard}
                onPress={() => handleContentPress(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.contentThumbnail}
                  resizeMode="cover"
                />
                {item.subscriberOnly && !hasSubscription && (
                  <View style={styles.thumbnailLock}>
                    <Ionicons name="lock-closed" size={16} color={colors.text.light} />
                  </View>
                )}
                <View style={styles.contentInfo}>
                  <View style={styles.contentMeta}>
                    <View style={styles.typeBadge}>
                      <Ionicons name={getContentIcon(item.contentType) as any} size={12} color={colors.primary.main} />
                      <Text style={styles.typeText}>{item.contentType}</Text>
                    </View>
                    <Text style={styles.categoryLabel}>{item.category}</Text>
                  </View>
                  <Text style={styles.contentTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.contentFooter}>
                    <Text style={styles.duration}>{item.duration}</Text>
                    <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  categoriesContainer: {
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categories: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: colors.primary.main,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.main,
  },
  categoryTextActive: {
    color: colors.primary.contrast,
  },
  contentList: {
    flex: 1,
  },
  contentListContent: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  subscriptionBanner: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary.light,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.dark,
  },
  bannerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  featuredCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.main,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredInfo: {
    padding: spacing.lg,
  },
  featuredTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featuredDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
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
    width: 110,
    height: 90,
  },
  thumbnailLock: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 110,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.main,
    textTransform: 'uppercase',
  },
  categoryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    textTransform: 'capitalize',
  },
  contentTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  duration: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
  },
});
