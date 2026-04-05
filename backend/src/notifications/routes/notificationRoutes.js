import express from 'express';
import { protect } from '../../middleware/Auth.js';
import Notification from '../../models/Notification.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: notifications.length, data: notifications });
});

router.put('/read', async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'Notifications marked as read' });
});

export default router;
