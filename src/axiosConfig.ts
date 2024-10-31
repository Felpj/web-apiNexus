// src/axiosConfig.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api-nexus-tau.vercel.app', // Substitua pela URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação, se necessário
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Ajuste conforme sua estratégia de autenticação
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
