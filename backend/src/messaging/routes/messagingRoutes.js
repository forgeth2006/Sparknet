import express from 'express';
import { protect } from '../../middleware/Auth.js';
import {
  sendMessageAPI,
  getInboxConversations,
  getConversationHistory,
  markThreadAsRead
} from '../controllers/messagingController.js';

const router = express.Router();

// All messaging endpoints require strict authentication
router.use(protect);

router.post('/send', sendMessageAPI);
router.get('/conversations', getInboxConversations);
router.get('/conversations/:id/messages', getConversationHistory);
router.patch('/conversations/:id/read', markThreadAsRead);

export default router;
