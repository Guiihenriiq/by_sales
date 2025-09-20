export const API_BASE_URL = 'http://localhost:3333/api';

// Configuração centralizada da API
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Endpoints centralizados
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Admin
  ADMIN_SALES: '/admin/sales',
  ADMIN_ORDERS: '/admin/orders',
  
  // Products
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  
  // Sales
  SALES: '/sales',
  
  // Wishlist
  WISHLIST: '/wishlist',
  
  // Cart
  CART: '/cart'
};