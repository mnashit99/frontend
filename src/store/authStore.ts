import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  createdAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (user: User, token: string) => void; // ✅ CHANGED: Accept token parameter
  logout: () => void;
  setInitialized: (isInitialized: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  checkTokenExpiry: () => boolean; // ✅ ADD THIS: Token expiry check
}

// Constants
const STORAGE_KEY = 'auth-storage';
const AUTH_TOKEN_KEY = 'token';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      user: null,
      
      // ✅ UPDATED: Accept token and store it
      login: (user: User, token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        set({ 
          isAuthenticated: true, 
          user,
          isInitialized: true 
        });
      },
      
      logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        set({ 
          isAuthenticated: false, 
          user: null,
          isInitialized: true 
        });
      },
      
      setInitialized: (isInitialized: boolean) => 
        set({ isInitialized }),
      
      updateUser: (updatedUser: Partial<User>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null
        })),
      
      // ✅ ADD THIS: Check if JWT token is expired
      checkTokenExpiry: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
          get().logout();
          return true;
        }
        
        try {
          // Decode JWT token to check expiration
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          
          if (isExpired) {
            get().logout();
            return true;
          }
          return false;
        } catch (error) {
          // If token is invalid, logout
          get().logout();
          return true;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields to avoid serialization issues
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
  setInitialized: state.setInitialized,
  checkTokenExpiry: state.checkTokenExpiry, // ✅ ADD THIS
}));

export default useAuthStore;