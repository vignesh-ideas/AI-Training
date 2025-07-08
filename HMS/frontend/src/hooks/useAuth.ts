import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { AuthState, AuthContextType, LoginRequest, RegisterRequest, User } from '@/types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_PROFILE'; payload: User };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { token, user } = authService.getStoredAuthData();
      
      if (token && user) {
        try {
          const isValid = await authService.validateToken();
          if (isValid) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, token },
            });
          } else {
            authService.clearAuthData();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          authService.clearAuthData();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login(credentials);
      const user = await authService.getProfile();
      
      authService.storeAuthData(response.token, user);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: response.token },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await authService.register(userData);
      // After successful registration, login the user
      await login({
        username: userData.username,
        password: userData.password,
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Registration failed',
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.clearAuthData();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
      authService.storeAuthData(state.token!, updatedUser);
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Profile update failed',
      });
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 