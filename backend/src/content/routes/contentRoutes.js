import express from 'express';
import { createPost, getFeed, editPost, deletePost, getSinglePost, getUserPosts } from '../controllers/postController.js';
import { likePost, unlikePost, addComment, replyToComment, deleteComment, savePost, unsavePost } from '../controllers/interactionController.js';
import { reportContent } from '../controllers/reportController.js';
import { protect } from '../../middleware/Auth.js';

const router = express.Router();

// Post Management
router.post('/create', protect, createPost); // /api/v1/posts/create
router.get('/feed', protect, getFeed);       // /api/v1/posts/feed

router.put('/:id', protect, editPost);
router.delete('/:id', protect, deletePost);
router.get('/:id', protect, getSinglePost);
router.get('/user/:userId', protect, getUserPosts);

// Interactions - Reactions & Saves
router.post('/react', protect, likePost);    // /api/v1/posts/react
router.delete('/:id/react', protect, unlikePost);
router.post('/:id/save', protect, savePost);
router.delete('/:id/save', protect, unsavePost);

// Interactions - Comments
router.post('/comment', protect, addComment); // /api/v1/posts/comment
router.post('/comments/:commentId/reply', protect, replyToComment);
router.delete('/comments/:commentId', protect, deleteComment);

// Reporting
router.post('/report', protect, reportContent);

export default router;