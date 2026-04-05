import express from 'express';
const router = express.Router();
import {
  getUsers, getUser, updateUserStatus,
  forceLogout, getUserActivity, setUserMode, getStats,
} from '../controller/admincontroller.js';
import { protect, adminOnly } from '../../middleware/Auth.js';

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/status', updateUserStatus);
router.post('/suspend-user', (req, res) => res.json({ success: true, message: 'User suspended' }));
router.post('/users/:id/force-logout', forceLogout);
router.get('/users/:id/activity', getUserActivity);
router.patch('/users/:id/mode', setUserMode);

// Moderation Admin
router.get('/reports', (req, res) => res.json({ success: true, data: [] }));
router.get('/moderation-queue', (req, res) => res.json({ success: true, data: [] }));

export default router;
