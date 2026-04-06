import api from './axios';

export const profileApi = {
  getMyProfile: () => api.get('/profiles'),
  updateProfile: (formData) => api.put('/profiles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getPublicProfile: (username) => api.get(`/profiles/${username}`),
  updatePrivacy: (privacy) => api.put('/profiles/privacy', privacy),
  getActivity: () => api.get('/profiles/activity'),
  resetProfile: () => api.delete('/profiles/reset'),
};
