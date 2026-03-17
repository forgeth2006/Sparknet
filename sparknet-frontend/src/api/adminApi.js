import api from './axios';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status, reason) => api.patch(`/admin/users/${id}/status`, { status, reason }),
  forceLogout: (id) => api.post(`/admin/users/${id}/force-logout`),
  getUserActivity: (id) => api.get(`/admin/users/${id}/activity`),
  setUserMode: (id, mode) => api.patch(`/admin/users/${id}/mode`, { mode }),
};
