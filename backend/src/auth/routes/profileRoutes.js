import express from 'express';
import { 
  getMyProfile, 
  updateProfile, 
  getPublicProfile, 
  updatePrivacy, 
  getActivity, 
  resetProfile 
} from '../controllers/profileController.js';

// FIXED PATHS based on your screenshot
import { protect } from '../../middleware/Auth.js';
import { uploadAvatar } from '../../utils/upload.js';

const router = express.Router();

// All routes here require being logged in
router.use(protect);

router.get('/me', getMyProfile);
router.get('/activity', getActivity);
router.put('/update', uploadAvatar.single('avatar'), updateProfile);
router.put('/privacy', updatePrivacy);
router.get('/:username', getPublicProfile);
router.delete('/reset', resetProfile);

export default router;