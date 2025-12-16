import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { currentSubscription, hasSubscription } = useSubscriptionStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            await logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'person-outline',
      onPress: () => {},
    },
    {
      id: 'subscription',
      title: 'Subscription & Billing',
      icon: 'card-outline',
      badge: hasSubscription ? currentSubscription?.plan.name : 'No Plan',
      onPress: () => {},
    },
    {
      id: 'appointments',
      title: 'Appointment History',
      icon: 'calendar-outline',
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {},
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color={colors.primary.contrast} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        {hasSubscription && currentSubscription && (
          <View style={styles.memberBadge}>
            <Ionicons name="star" size={14} color={colors.primary.main} />
            <Text style={styles.memberBadgeText}>{currentSubscription.plan.name} Member</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <Card style={styles.statsCard} variant="elevated">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {hasSubscription ? currentSubscription?.massagesRemaining || 0 : 0}
            </Text>
            <Text style={styles.statLabel}>Massages Left</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Videos Watched</Text>
          </View>
        </View>
      </Card>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === 0 && styles.menuItemFirst,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color={colors.primary.main} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <Text style={styles.menuItemBadge}>{item.badge}</Text>
              )}
              <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Section */}
      <Card style={styles.contactCard} variant="outlined">
        <Image
          source={{ uri: 'https://goldenayurvedamassage.com/uploads/1/4/2/5/142500427/published/f4a90630-f8fb-44ab-a5c3-c1f3df8ea1ad.png' }}
          style={styles.contactLogo}
          resizeMode="contain"
        />
        <Text style={styles.contactTitle}>Blue Sky Mountain Massage</Text>
        <Text style={styles.contactInfo}>4364 Chicago Creek Rd</Text>
        <Text style={styles.contactInfo}>Idaho Springs, CO 80452</Text>
        <Text style={styles.contactInfo}>720-743-5949</Text>
        
        <View style={styles.socialLinks}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-instagram" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="mail-outline" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Logout Button */}
      <Button
        title="Log Out"
        onPress={handleLogout}
        variant="outline"
        fullWidth
        loading={loggingOut}
        style={styles.logoutButton}
      />

      {/* App Version */}
      <Text style={styles.version}>Blue Sky Mountain Massage v1.0.0</Text>
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.contrast,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  memberBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.dark,
  },
  statsCard: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  menuSection: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemFirst: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuItemBadge: {
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
  },
  contactCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  contactLogo: {
    width: 60,
    height: 60,
    marginBottom: spacing.md,
  },
  contactTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  contactInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
  },
});
