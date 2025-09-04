import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Login failed' 
        };
      }
    },

    async register(userData: any) {
      try {
        await api.post('/auth/register', userData);
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Registration failed' 
        };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.isAuthenticated = true;
      }
    },
  },
});