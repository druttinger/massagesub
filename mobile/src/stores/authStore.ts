import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      await SecureStore.setItemAsync('authToken', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },
  
  register: async (data) => {
    try {
      const response = await authApi.register(data);
      await SecureStore.setItemAsync('authToken', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  
  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        const user = await authApi.getProfile();
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  
  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));
