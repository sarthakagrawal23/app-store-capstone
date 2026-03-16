import api from './axiosInstance'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
}

// ── Apps ──────────────────────────────────────────────────────────────────────
export const appsAPI = {
  getAll:           (params) => api.get('/apps', { params }),
  getById:          (id)     => api.get(`/apps/${id}`),
  getMyApps:        ()       => api.get('/apps/owner/my'),
  create:           (data)   => api.post('/apps', data),
  update:           (id, data) => api.put(`/apps/${id}`, data),
  toggleVisibility: (id)     => api.patch(`/apps/${id}/toggle-visibility`),
  delete:           (id)     => api.delete(`/apps/${id}`),
  incrementDownload:(id)     => api.post(`/apps/${id}/download`),
  updateRating:     (id, avg)=> api.patch(`/apps/${id}/rating`, { averageRating: avg }),
}

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getByApp:  (appId) => api.get(`/reviews/app/${appId}`),
  getAvg:    (appId) => api.get(`/reviews/app/${appId}/avg`),
  getCount:  (appId) => api.get(`/reviews/app/${appId}/count`),
  add:       (appId, data) => api.post(`/reviews/app/${appId}`, data),
  delete:    (reviewId)    => api.delete(`/reviews/${reviewId}`),
}

// ── Downloads ─────────────────────────────────────────────────────────────────
export const downloadsAPI = {
  record:  (appId, appName) => api.post(`/downloads/app/${appId}?appName=${encodeURIComponent(appName)}`),
  getMy:   ()               => api.get('/downloads/my'),
  check:   (appId)          => api.get(`/downloads/check/${appId}`),
  count:   (appId)          => api.get(`/downloads/count/${appId}`),
}
