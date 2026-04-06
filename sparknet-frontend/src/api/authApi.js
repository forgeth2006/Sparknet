import api from './axios';

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (token) => api.post('/auth/verify-email', { verification_token: token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/reset-password-request', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { password, reset_token: token }),
  changePassword: (data) => api.post('/auth/change-password', data),
};
