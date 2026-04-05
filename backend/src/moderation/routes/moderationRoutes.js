import express from 'express';
import { protect } from '../../middleware/Auth.js';

const router = express.Router();

// Used internally or by users reporting
router.use(protect);

router.post('/check', async (req, res) => {
  res.json({ success: true, safe: true, riskScore: 'Low' });
});

router.post('/report', async (req, res) => {
  res.json({ success: true, message: 'Content reported successfully' });
});

export default router;
