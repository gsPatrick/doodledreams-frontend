import axios from 'axios';

// URL base da sua API em produção
const API_URL = 'https://n8n-doodledreamsbackend.r954jc.easypanel.host/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT a cada requisição autenticada
api.interceptors.request.use(
  (config) => {
    // Tenta pegar o token do localStorage
    const token = localStorage.getItem('doodle_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;