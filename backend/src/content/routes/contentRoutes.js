/**
 * Content Routes  [SparkNet Content System — Step 1 & 2]
 *
 * ROUTE ORDERING RULE (Express):
 *   Static routes (/feed, /saved, /comment) MUST be declared before
 *   dynamic routes (/:id) to prevent Express matching them as an id.
 *
 * Base path: /api/v1/posts
 */

import express from 'express';

// Controllers — Write side
import {
  createPost,
  getFeed,
  editPost,
  deletePost,
  getSinglePost,
  getUserPosts,
} from '../controllers/postController.js';

import {
  likePost,
  unlikePost,
  addComment,
  replyToComment,
  deleteComment,
  savePost,
  unsavePost,
} from '../controllers/interactionController.js';

import { reportContent } from '../controllers/reportController.js';

// Controllers — Read side (Step 2)
import {
  getComments,
  getReplies,
  getLikeStatus,
  getSavedPosts,
} from '../controllers/interactionReadController.js';

import { protect } from '../../middleware/Auth.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// STATIC ROUTES  (must be before /:id)
// ─────────────────────────────────────────────────────────────────────────────

// POST MANAGEMENT
router.post  ('/create', protect, createPost);            // Create a post
router.get   ('/feed',   protect, getFeed);               // Get ranked feed

// INTERACTION — static write
router.post  ('/react',   protect, likePost);             // Like a post (body: { postId })
router.post  ('/comment', protect, addComment);           // Add comment (body: { postId, content })
router.post  ('/report',  protect, reportContent);        // Report content

// INTERACTION — static read
router.get   ('/saved',   protect, getSavedPosts);        // Get current user's saved posts

// USER POSTS (profile page)
router.get   ('/user/:userId', protect, getUserPosts);    // Get all posts by a user

// ─────────────────────────────────────────────────────────────────────────────
// COMMENT-SPECIFIC ROUTES  (before /:id to avoid collision)
// ─────────────────────────────────────────────────────────────────────────────
router.post  ('/comments/:commentId/reply',   protect, replyToComment);   // Reply to comment
router.get   ('/comments/:commentId/replies', protect, getReplies);       // Load more replies
router.delete('/comments/:commentId',         protect, deleteComment);    // Delete comment

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC ROUTES  /:id  (after all static routes)
// ─────────────────────────────────────────────────────────────────────────────

// Post CRUD
router.get   ('/:id',  protect, getSinglePost);           // Get a single post
router.put   ('/:id',  protect, editPost);                // Edit a post
router.delete('/:id',  protect, deletePost);              // Delete a post

// Reactions & saves on a post
router.delete('/:id/react', protect, unlikePost);         // Unlike a post
router.post  ('/:id/save',  protect, savePost);           // Save a post
router.delete('/:id/save',  protect, unsavePost);         // Unsave a post

// Read — comments & likes on a post
router.get   ('/:id/comments',                           protect, getComments);    // Get threaded comments
router.get   ('/:id/comments/:commentId/replies',        protect, getReplies);     // Get replies (nested)
router.get   ('/:id/likes',                              protect, getLikeStatus);  // Like count + did I like?

export default router;