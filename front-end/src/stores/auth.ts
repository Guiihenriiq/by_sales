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
    token: localStorage.getItem('admin_token'),
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(email: string, password: string) {
      try {
        console.log('Store: Fazendo login para', email);
        const response = await api.post('/auth/login', { email, password });
        console.log('Store: Resposta recebida', response.data);
        
        const { user, token } = response.data;

        if (user.role !== 'admin') {
          console.log('Store: Usuário não é admin');
          return {
            success: false,
            message: 'Acesso negado. Apenas administradores podem acessar.'
          };
        }

        console.log('Store: Salvando dados do usuário');
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;

        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('Store: Login bem-sucedido');
        return { success: true };
      } catch (error: any) {
        console.error('Store: Erro no login', error);
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

      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      delete api.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          if (user.role === 'admin') {
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            this.logout();
          }
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});