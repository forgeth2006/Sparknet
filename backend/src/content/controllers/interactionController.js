import Comment from '../../models/Comment.js';
import Reaction from '../../models/Reaction.js';
import SavedPost from '../../models/SavedPost.js';
import Post from '../../models/Post.js';

export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const userId = req.user.id;

    const existingReaction = await Reaction.findOne({ user: userId, post: id, type: 'like' });
    if (existingReaction) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const newReaction = new Reaction({ user: userId, post: id, type: 'like' });
    await newReaction.save();

    res.status(200).json({ success: true, message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Reaction.findOneAndDelete({ user: userId, post: id, type: 'like' });

    res.status(200).json({ success: true, message: "Post unliked" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { content } = req.body;
    const userId = req.user.id;

    // Check if youth: restrict commenting on unknown posts in later feature
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role === 'child' && post.risk_score > 0.3) {
      return res.status(403).json({ message: "Commenting restricted for this post" });
    }

    const newComment = new Comment({
      post: id,
      user: userId,
      content
    });

    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newComment = new Comment({
      post: parentComment.post,
      user: userId,
      content,
      parentComment: commentId
    });

    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    await Comment.deleteMany({ parentComment: commentId }); // cascade delete replies
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingSave = await SavedPost.findOne({ user: userId, post: id });
    if (existingSave) {
      return res.status(400).json({ message: "Post already saved" });
    }

    const newSave = new SavedPost({ user: userId, post: id });
    await newSave.save();

    res.status(200).json({ success: true, message: "Post saved" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await SavedPost.findOneAndDelete({ user: userId, post: id });
    res.status(200).json({ success: true, message: "Post unsaved" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
