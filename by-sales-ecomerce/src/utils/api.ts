export const API_BASE_URL = 'http://localhost:3333/api';

export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};

// Helper para requisições autenticadas
export const authenticatedRequest = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers
  };
  
  return apiRequest(endpoint, { ...options, headers });
};