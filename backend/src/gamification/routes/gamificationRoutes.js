import express from 'express';
import { protect } from '../../middleware/Auth.js';

const router = express.Router();
router.use(protect);

router.get('/points', async (req, res) => {
  res.json({ success: true, data: { points: 1500 } });
});

router.get('/badges', async (req, res) => {
  res.json({ success: true, data: { badges: ['creator', 'explorer'] } });
});

router.get('/progress', async (req, res) => {
  res.json({ success: true, data: { level: 'Explorer', nextMilestone: 2000 } });
});

export default router;
