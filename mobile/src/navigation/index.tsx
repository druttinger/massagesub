import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { ContentScreen } from '../screens/ContentScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, typography } from '../theme';
import { useAuthStore } from '../stores/authStore';

// Type definitions
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Subscription: undefined;
  Content: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Back',
          headerTintColor: colors.primary.main,
          headerStyle: { backgroundColor: colors.background.primary },
          headerShadowVisible: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Subscription':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Content':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.light,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontWeight: typography.fontWeight.semibold,
          fontSize: typography.fontSize.lg,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          title: 'Plans',
          headerTitle: 'Subscription Plans',
        }}
      />
      <Tab.Screen 
        name="Content" 
        component={ContentScreen}
        options={{
          title: 'Wellness',
          headerTitle: 'Wellness Content',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // You could show a loading screen here while checking auth state
  if (isLoading) {
    return null; // Or a splash screen component
  }

  return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
}
