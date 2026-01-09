"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "@/lib/api/auth"

type LoginData = {
  email: string
  password: string
}

type RegisterData = {
  email: string
  password: string
  name?: string
  phoneNumber?: string
}

interface Admin {
  id: string
  email: string
  name: string
  phoneNumber: string
}

interface AuthState {
  admin: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await authApi.login(data)
          if (res.data?.success) {
            set({
              admin: res.data.admin,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await authApi.register(data)
          if (res.data?.success) {
            set({
              admin: res.data.admin,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await (authApi as any).logout()
          set({
            admin: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "apostle-auth",
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
