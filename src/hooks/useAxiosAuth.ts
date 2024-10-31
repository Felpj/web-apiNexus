import axios from 'axios';
import { useAuth } from './useAuth';

export function useAxiosAuth() {
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: 'https://api-nexus-tau.vercel.app',
  });

  axiosInstance.interceptors.request.use(
    config => {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  return axiosInstance;
}
