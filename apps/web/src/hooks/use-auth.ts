'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse, UserResponse } from '@b2b-saas/dtos'

interface AuthState {
  user: UserResponse | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (authData: AuthResponse) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      isAuthenticated: false,
      login: (authData: AuthResponse) =>
        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setLoading: (loading: boolean) =>
        set({
          isLoading: loading,
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
    }
  )
) 