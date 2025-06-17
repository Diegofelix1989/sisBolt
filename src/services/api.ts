import axios from 'axios';

// Definir URL base da API
export const api = axios.create({
  // Em produção, substitua por URL real
  baseURL: 'http://localhost:5000/api',
  // Se preferir usar mock, deixe assim
  // baseURL: '',
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@GerenciadorFilas:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for erro de autenticação, fazer logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@GerenciadorFilas:usuario');
      localStorage.removeItem('@GerenciadorFilas:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);