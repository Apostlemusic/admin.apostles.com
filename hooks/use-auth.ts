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
  accessToken: string | null
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
      accessToken: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await authApi.login(data)
          if (!res.data?.success) {
            set({ error: res.data?.message || "Login failed", isLoading: false })
            return
          }

          const accessToken =
            res.data?.accessToken ||
            res.data?.token ||
            res.data?.access_token ||
            res.data?.data?.accessToken ||
            res.data?.data?.token ||
            res.data?.data?.access_token
          const refreshToken = res.data?.refreshToken
          if (typeof window !== "undefined") {
            if (accessToken) {
              localStorage.setItem("apostle_admin_access_token", accessToken)
              localStorage.setItem("apostle_admin_token", accessToken)
            }
            if (refreshToken) localStorage.setItem("apostle_admin_refresh_token", refreshToken)
          }

          let admin = res.data?.admin

          if (!admin) {
            const profileRes = await authApi.getMe()
            admin = profileRes.data?.admin
          }

          if (admin) {
            const normalized = {
              id: admin.id || admin._id,
              email: admin.email,
              name: admin.name || admin.fullName || "Admin",
              phoneNumber: admin.phoneNumber || "",
            }
            set({ admin: normalized, isAuthenticated: true, isLoading: false, accessToken: accessToken || null })
          } else {
            set({ isAuthenticated: true, isLoading: false, accessToken: accessToken || null })
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
            const accessToken =
              res.data?.accessToken ||
              res.data?.token ||
              res.data?.access_token ||
              res.data?.data?.accessToken ||
              res.data?.data?.token ||
              res.data?.data?.access_token
            set({
              admin: res.data.admin,
              isAuthenticated: true,
              isLoading: false,
              accessToken: accessToken || null,
            })
            const refreshToken = res.data?.refreshToken
            if (typeof window !== "undefined") {
              if (accessToken) {
                localStorage.setItem("apostle_admin_access_token", accessToken)
                localStorage.setItem("apostle_admin_token", accessToken)
              }
              if (refreshToken) localStorage.setItem("apostle_admin_refresh_token", refreshToken)
            }
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
          await authApi.logout()
          if (typeof window !== "undefined") {
            localStorage.removeItem("apostle_admin_access_token")
            localStorage.removeItem("apostle_admin_refresh_token")
            localStorage.removeItem("apostle_admin_token")
          }
          set({
            admin: null,
            isAuthenticated: false,
            isLoading: false,
            accessToken: null,
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
        accessToken: state.accessToken,
      }),
    },
  ),
)
