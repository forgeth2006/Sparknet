import api from './axios';

export const guardianApi = {
  approveChild: (token) => api.post(`/guardian/approve/${token}`),
  resendInvite: (data) => api.post('/guardian/resend-invite', data),
  getChildren: () => api.get('/guardian/children'),
  updateChildControls: (childId, controls) => api.patch(`/guardian/children/${childId}/controls`, controls),
  setChildStatus: (childId, status) => api.patch(`/guardian/children/${childId}/status`, { status }),
  unlinkChild: (childId) => api.delete(`/guardian/children/${childId}`),
  getChildActivity: (childId) => api.get(`/guardian/children/${childId}/activity`),
};
