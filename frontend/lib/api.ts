import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'BRAND_USER';
  brand_id: number | null;
  full_name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Comment {
  id: number;
  comment_id: string;
  media_id: string | null;
  text: string;
  username: string;
  timestamp: string;
  status: 'OPEN' | 'REPLIED';
  like_count: number;
  account_username?: string;
}

export interface Reply {
  id: number;
  reply_id: string;
  text: string;
  sent_at: string;
  replied_by?: string;
}

export interface InstagramAccount {
  id: number;
  username: string;
  profile_picture_url: string | null;
  is_connected: boolean;
  last_sync_at: string | null;
}

export interface Brand {
  id: number;
  name: string;
  category: string | null;
  is_active: boolean;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('API URL:', api.defaults.baseURL);
      console.log('Making login request to:', `${api.defaults.baseURL}/auth/login`);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getAll: async (status?: 'OPEN' | 'REPLIED'): Promise<{ comments: Comment[]; pagination: any }> => {
    const params = status ? { status } : {};
    const response = await api.get('/comments', { params });
    return response.data;
  },
  getOne: async (commentId: number): Promise<{ comment: Comment; replies: Reply[] }> => {
    const response = await api.get(`/comments/${commentId}`);
    return response.data;
  },
  reply: async (commentId: number, text: string): Promise<{ message: string; reply_id: string }> => {
    const response = await api.post(`/comments/${commentId}/reply`, { text });
    return response.data;
  },
  sync: async (): Promise<{ message: string; comments_added: number }> => {
    const response = await api.post('/comments/sync');
    return response.data;
  },
};

// Instagram API
export const instagramAPI = {
  getConnectUrl: async (): Promise<{ authUrl: string }> => {
    const response = await api.get('/instagram/connect-url');
    return response.data;
  },
  getAccount: async (): Promise<{ account: InstagramAccount }> => {
    const response = await api.get('/instagram/account');
    return response.data;
  },
  disconnect: async (): Promise<{ message: string }> => {
    const response = await api.post('/instagram/disconnect');
    return response.data;
  },
};

// Brand API
export const brandAPI = {
  getMe: async (): Promise<{ brand: Brand }> => {
    const response = await api.get('/brands/me');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getBrands: async (params?: { category?: string; is_active?: boolean; limit?: number; offset?: number }): Promise<{ brands: Brand[]; pagination: any }> => {
    const response = await api.get('/admin/brands', { params });
    return response.data;
  },
  getBrand: async (brandId: number): Promise<any> => {
    const response = await api.get(`/admin/brands/${brandId}`);
    return response.data;
  },
  createBrand: async (data: { name: string; category?: string }): Promise<{ message: string; brand_id: number }> => {
    const response = await api.post('/admin/brands', data);
    return response.data;
  },
  updateBrand: async (brandId: number, data: { name?: string; category?: string; is_active?: boolean }): Promise<{ message: string }> => {
    const response = await api.put(`/admin/brands/${brandId}`, data);
    return response.data;
  },
  toggleBrandStatus: async (brandId: number, is_active: boolean): Promise<{ message: string }> => {
    const response = await api.patch(`/admin/brands/${brandId}/status`, { is_active });
    return response.data;
  },
  getLogs: async (params?: { limit?: number; offset?: number }): Promise<{ logs: any[]; pagination: any }> => {
    const response = await api.get('/admin/logs', { params });
    return response.data;
  },
};

export default api;

