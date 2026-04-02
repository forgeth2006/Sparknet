import express from 'express';
import { createPost, getFeed, editPost, deletePost, getSinglePost, getUserPosts } from '../controllers/postController.js';
import { likePost, unlikePost, addComment, replyToComment, deleteComment, savePost, unsavePost } from '../controllers/interactionController.js';
import { reportContent } from '../controllers/reportController.js';
import { protect } from '../../middleware/Auth.js';

const router = express.Router();

// Post Management
router.post('/posts', protect, createPost);
router.put('/posts/:id', protect, editPost);
router.delete('/posts/:id', protect, deletePost);
router.get('/posts/:id', protect, getSinglePost);
router.get('/users/:userId/posts', protect, getUserPosts);
router.get('/feed', protect, getFeed);

// Interactions - Reactions & Saves
router.post('/posts/:id/like', protect, likePost);
router.delete('/posts/:id/like', protect, unlikePost);
router.post('/posts/:id/save', protect, savePost);
router.delete('/posts/:id/save', protect, unsavePost);

// Interactions - Comments
router.post('/posts/:id/comments', protect, addComment);
router.post('/comments/:commentId/reply', protect, replyToComment);
router.delete('/comments/:commentId', protect, deleteComment);

// Reporting
router.post('/report', protect, reportContent);

export default router;