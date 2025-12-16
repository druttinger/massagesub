import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use your computer's local IP for physical device and emulator testing
// This IP works for all platforms when testing on the local network
const API_URL = 'http://192.168.1.160:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsApi = {
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },
  
  getMySubscription: async () => {
    const response = await api.get('/subscriptions/my-subscription');
    return response.data;
  },
  
  subscribe: async (planId: number, paymentDetails?: any) => {
    const response = await api.post('/subscriptions/subscribe', { planId, paymentDetails });
    return response.data;
  },
  
  cancel: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },
  
  pause: async () => {
    const response = await api.post('/subscriptions/pause');
    return response.data;
  },
  
  resume: async () => {
    const response = await api.post('/subscriptions/resume');
    return response.data;
  },
  
  getPaymentHistory: async () => {
    const response = await api.get('/subscriptions/payment-history');
    return response.data;
  },
};

// Content API
export const contentApi = {
  getAll: async () => {
    const response = await api.get('/content');
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await api.get('/content/featured');
    return response.data;
  },
  
  getLatest: async () => {
    const response = await api.get('/content/latest');
    return response.data;
  },
  
  getByCategory: async (category: string) => {
    const response = await api.get(`/content/category/${category}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },
  
  book: async (data: {
    dateTime: string;
    durationMinutes?: number;
    serviceType: string;
    notes?: string;
    useSubscription?: boolean;
  }) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  
  cancel: async (id: number) => {
    const response = await api.post(`/appointments/${id}/cancel`);
    return response.data;
  },
  
  getAvailableSlots: async (date: string) => {
    const response = await api.get('/appointments/available-slots', { params: { date } });
    return response.data;
  },
};

export default api;
