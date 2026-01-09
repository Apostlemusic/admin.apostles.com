import api from "@/lib/axios"

export const authApi = {
  login: (data: any) => api.post("/api/admin/auth/login", data),
  register: (data: any) => api.post("/api/admin/auth/register", data),
  verifyOtp: (data: any) => api.post("/api/admin/auth/verify-otp", data),
  forgotPassword: (data: any) => api.post("/api/admin/auth/forgot-password", data),
  resetPassword: (data: any) => api.post("/api/admin/auth/reset-password", data),
  getStats: () => api.get("/api/admin/stats"),
  getMe: () => api.get("/api/admin/auth/me"),
}
