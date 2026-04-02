import axios, { AxiosInstance, AxiosError } from 'axios';
import { APIResponse } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Wallet API
export const walletAPI = {
  async getBalance() {
    const response = await api.get<APIResponse>('/api/wallet/balance');
    return response.data;
  },

  async fundWallet(amount: number, reference: string) {
    const response = await api.post<APIResponse>('/api/wallet/fund', { amount, reference });
    return response.data;
  },

  async getTransactionHistory(page = 1, limit = 10) {
    const response = await api.get<APIResponse>('/api/wallet/transactions', {
      params: { page, limit },
    });
    return response.data;
  },

  async verifyTransaction(reference: string) {
    const response = await api.post<APIResponse>('/api/wallet/verify', { reference });
    return response.data;
  },
};

// Order API
export const orderAPI = {
  async createOrder(orderData: any) {
    const response = await api.post<APIResponse>('/api/orders/create', orderData);
    return response.data;
  },

  async getOrders(page = 1, limit = 10, filters?: any) {
    const response = await api.get<APIResponse>('/api/orders', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  async getOrder(id: string) {
    const response = await api.get<APIResponse>(`/api/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: string) {
    const response = await api.patch<APIResponse>(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id: string) {
    const response = await api.post<APIResponse>(`/api/orders/${id}/cancel`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  async getDashboardStats() {
    const response = await api.get<APIResponse>('/api/admin/stats');
    return response.data;
  },

  async getOrders(filters?: any) {
    const response = await api.get<APIResponse>('/api/admin/orders', { params: filters });
    return response.data;
  },

  async getUsers(page = 1, limit = 10) {
    const response = await api.get<APIResponse>('/api/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  async getSIMs() {
    const response = await api.get<APIResponse>('/api/admin/sims');
    return response.data;
  },

  async createSIM(data: any) {
    const response = await api.post<APIResponse>('/api/admin/sims', data);
    return response.data;
  },

  async updateSIM(id: string, data: any) {
    const response = await api.patch<APIResponse>(`/api/admin/sims/${id}`, data);
    return response.data;
  },

  async deleteSIM(id: string) {
    const response = await api.delete<APIResponse>(`/api/admin/sims/${id}`);
    return response.data;
  },

  async assignOrderToSIM(orderId: string, simId: string) {
    const response = await api.post<APIResponse>('/api/admin/assign-order', {
      orderId,
      simId,
    });
    return response.data;
  },

  async updateUserWallet(userId: string, amount: number) {
    const response = await api.patch<APIResponse>(`/api/admin/users/${userId}/wallet`, {
      amount,
    });
    return response.data;
  },

  async getDataPlans() {
    const response = await api.get<APIResponse>('/api/admin/data-plans');
    return response.data;
  },

  async createDataPlan(data: any) {
    const response = await api.post<APIResponse>('/api/admin/data-plans', data);
    return response.data;
  },

  async updateDataPlan(id: string, data: any) {
    const response = await api.patch<APIResponse>(`/api/admin/data-plans/${id}`, data);
    return response.data;
  },
};

// User API
export const userAPI = {
  async getProfile() {
    const response = await api.get<APIResponse>('/api/user/profile');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.patch<APIResponse>('/api/user/profile', data);
    return response.data;
  },

  async getNotifications() {
    const response = await api.get<APIResponse>('/api/user/notifications');
    return response.data;
  },

  async markNotificationAsRead(id: string) {
    const response = await api.patch<APIResponse>(`/api/user/notifications/${id}`, {
      read: true,
    });
    return response.data;
  },
};

export default api;
