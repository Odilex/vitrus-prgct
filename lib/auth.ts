"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  email_verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: 'client' | 'agent' | 'owner';
  company?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// Authentication Store
interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  
  // Utility
  getAuthHeaders: () => Record<string, string>;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            tokens: data.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
          }

          set({
            user: responseData.user,
            tokens: responseData.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        const { tokens } = get();
        
        if (!tokens?.refresh_token) {
          return false;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: tokens.refresh_token }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          set({
            tokens: data.tokens,
          });

          return true;
        } catch {
          // If refresh fails, logout user
          get().logout();
          return false;
        }
      },

      getCurrentUser: async () => {
        const { tokens } = get();
        
        if (!tokens?.access_token) {
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Try to refresh token
              const refreshed = await get().refreshToken();
              if (refreshed) {
                // Retry with new token
                return get().getCurrentUser();
              } else {
                get().logout();
                return;
              }
            }
            throw new Error('Failed to get current user');
          }

          const data = await response.json();
          set({ user: data.user });
        } catch (error) {
          console.error('Error getting current user:', error);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      getAuthHeaders: (): Record<string, string> => {
        const { tokens } = get();
        
        if (!tokens?.access_token) {
          return {};
        }

        return {
          'Authorization': `Bearer ${tokens.access_token}`,
        };
      },

      isTokenExpired: () => {
        const { tokens } = get();
        
        if (!tokens?.access_token) {
          return true;
        }

        try {
          // Decode JWT token to check expiration
          const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          return payload.exp < currentTime;
        } catch {
          return true;
        }
      },
    }),
    {
      name: 'vitrus-auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Authentication service class
export class AuthService {
  static async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authStore = useAuthStore.getState();
    
    // Check if token is expired and try to refresh
    if (authStore.isTokenExpired()) {
      const refreshed = await authStore.refreshToken();
      if (!refreshed) {
        throw new Error('Authentication required');
      }
    }

    const authHeaders = authStore.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        // Only set Content-Type if not FormData (FormData sets its own boundary)
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...authHeaders,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Try to refresh token once
      const refreshed = await authStore.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newAuthHeaders = authStore.getAuthHeaders();
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            // Only set Content-Type if not FormData (FormData sets its own boundary)
            ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
            ...newAuthHeaders,
            ...options.headers,
          },
        });
        
        if (!retryResponse.ok) {
          let errorMessage = `HTTP error! status: ${retryResponse.status}`;
          
          try {
            const errorData = await retryResponse.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
            
            // If there are validation errors, include them
            if (errorData.errors && Array.isArray(errorData.errors)) {
              const validationErrors = errorData.errors.map((err: { msg?: string; message?: string }) => err.msg || err.message).join(', ');
              errorMessage = `${errorMessage}: ${validationErrors}`;
            }
            
            // Create error object with details for better error handling
            const error = new Error(errorMessage) as Error & { status?: number; details?: unknown };
            error.status = retryResponse.status;
            error.details = errorData.errors;
            throw error;
          } catch {
            // If we can't parse the error response, throw the original error
            throw new Error(errorMessage);
          }
        }
        
        return retryResponse.json();
      } else {
        authStore.logout();
        throw new Error('Authentication required');
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        // If there are validation errors, include them
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors.map((err: { msg?: string; message?: string }) => err.msg || err.message).join(', ');
          errorMessage = `${errorMessage}: ${validationErrors}`;
        }
        
        // Create error object with details for better error handling
        const error = new Error(errorMessage) as Error & { status?: number; details?: unknown };
        error.status = response.status;
        error.details = errorData.errors;
        throw error;
      } catch {
        // If we can't parse the error response, throw the original error
        throw new Error(errorMessage);
      }
    }

    return response.json();
  }
}

export default useAuthStore;