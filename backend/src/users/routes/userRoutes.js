import express from 'express';
import { 
  getMyProfile, 
  updateProfile, 
  getPublicProfile, 
  updatePrivacy, 
  getActivity, 
  resetProfile 
} from '../../auth/controllers/profileController.js';

import { protect } from '../../middleware/Auth.js';
import { uploadAvatar } from '../../utils/upload.js';

const router = express.Router();

// All routes here require being logged in
router.use(protect);

// User Profile APIs
router.get('/profile', getMyProfile); // GET /api/v1/users/profile
router.put('/profile', uploadAvatar.single('avatar'), updateProfile); // PUT /api/v1/users/profile
router.put('/privacy', updatePrivacy); // PUT /api/v1/users/privacy

// Extras
router.get('/activity', getActivity);
router.delete('/reset', resetProfile);
router.get('/:username', getPublicProfile);

export default router;
