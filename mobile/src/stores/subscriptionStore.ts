import { create } from 'zustand';
import { subscriptionsApi } from '../services/api';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  massagesPerMonth: number;
  durationMinutes: number;
  features: string[];
  isActive: boolean;
}

interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextBillingDate: string;
  massagesRemaining: number;
  plan: SubscriptionPlan;
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription | null;
  hasSubscription: boolean;
  isLoading: boolean;
  
  // Actions
  fetchPlans: () => Promise<void>;
  fetchMySubscription: () => Promise<void>;
  subscribe: (planId: number) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  pauseSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans: [],
  currentSubscription: null,
  hasSubscription: false,
  isLoading: false,
  
  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const plans = await subscriptionsApi.getPlans();
      set({ plans, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  fetchMySubscription: async () => {
    set({ isLoading: true });
    try {
      const response = await subscriptionsApi.getMySubscription();
      set({
        currentSubscription: response.hasSubscription ? response.subscription : null,
        hasSubscription: response.hasSubscription,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  subscribe: async (planId: number) => {
    set({ isLoading: true });
    try {
      const response = await subscriptionsApi.subscribe(planId);
      set({
        currentSubscription: response.subscription,
        hasSubscription: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  cancelSubscription: async () => {
    set({ isLoading: true });
    try {
      await subscriptionsApi.cancel();
      set({
        currentSubscription: null,
        hasSubscription: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  pauseSubscription: async () => {
    set({ isLoading: true });
    try {
      await subscriptionsApi.pause();
      set((state) => ({
        currentSubscription: state.currentSubscription 
          ? { ...state.currentSubscription, status: 'paused' as const }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  resumeSubscription: async () => {
    set({ isLoading: true });
    try {
      await subscriptionsApi.resume();
      set((state) => ({
        currentSubscription: state.currentSubscription 
          ? { ...state.currentSubscription, status: 'active' as const }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
