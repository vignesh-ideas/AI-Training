import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('hms_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (response?.status === 404) {
      toast.error('Resource not found.');
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 