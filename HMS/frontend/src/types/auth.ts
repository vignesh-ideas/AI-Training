export interface User {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PATIENT = 'PATIENT',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    username: string;
    role: UserRole;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
} 