import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { RootNavigator } from './src/navigation';
import { useAuthStore } from './src/stores/authStore';
import { colors } from './src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" backgroundColor={colors.background.primary} />
        <AppContent />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
