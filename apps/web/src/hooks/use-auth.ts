'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, UserResponse } from '@b2b-saas/dtos';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false, // Start with false to avoid infinite loading
      isAuthenticated: false,
      isHydrated: false,
      login: (authData: AuthResponse) =>
        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Redirect to login page
        window.location.href = '/login';
      },
      setLoading: (loading: boolean) =>
        set({
          isLoading: loading,
        }),
      setHydrated: (hydrated: boolean) =>
        set({
          isHydrated: hydrated,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
