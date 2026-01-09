import api from "@/lib/axios"

export const songsApi = {
  getAll: (params?: any) => api.get("/api/content/songs", { params }),
  getById: (id: string) => api.get(`/api/content/songs/${id}`),
  hide: (id: string) => api.patch(`/api/content/songs/${id}/hide`),
  unhide: (id: string) => api.patch(`/api/content/songs/${id}/unhide`),
  delete: (id: string) => api.delete(`/api/content/songs/${id}`),
}

export const categoriesApi = {
  getAll: (params?: any) => api.get("/api/content/categories", { params }),
  create: (data: any) => api.post("/api/content/categories", data),
  update: (id: string, data: any) => api.put(`/api/content/categories/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/categories/${id}`),
}

export const playlistsApi = {
  getAll: (params?: any) => api.get("/api/content/playlists", { params }),
  delete: (id: string) => api.delete(`/api/content/playlists/${id}`),
}

export const genresApi = {
  getAll: (params?: any) => api.get("/api/content/genres", { params }),
  create: (data: any) => api.post("/api/content/genres", data),
  update: (id: string, data: any) => api.put(`/api/content/genres/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/genres/${id}`),
}
