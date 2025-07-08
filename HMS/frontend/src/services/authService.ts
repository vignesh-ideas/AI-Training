import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/types/auth';

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/users/register', userData);
    return response.data;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
  },

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      await api.get('/users/me');
      return true;
    } catch (error) {
      return false;
    }
  },

  // Store auth data in localStorage
  storeAuthData(token: string, user: User): void {
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(user));
  },

  // Get stored auth data
  getStoredAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('hms_token');
    const userStr = localStorage.getItem('hms_user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
  },
}; 