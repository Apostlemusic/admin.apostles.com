import api from "@/lib/axios"

export const authApi = {
  login: (data: any) => api.post("/api/admin/login", data),
  register: (data: any) => api.post("/api/admin/register", data),
  verifyOtp: (data: any) => api.post("/api/admin/verifyOtp", data),
  resendOtp: (data: any) => api.post("/api/admin/resendOtp", data),
  forgotPassword: (data: any) => api.post("/api/admin/forgotPassword", data),
  resetPassword: (data: any) => api.post("/api/admin/resetPassword", data),
  logout: () => api.post("/api/admin/logout"),
  getStats: (token?: string | null) =>
    api.get(
      "/api/admin/stats",
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined,
    ),
  getMe: () => api.get("/api/admin/profile/me"),
}
