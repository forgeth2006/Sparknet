import Post from '../../models/Post.js';
import User from '../../models/User.js';

import { analyzeContent, applyTrustPenalty } from '../../moderation/services/moderationService.js';
export const createPost = async (req, res) => {
  try {
    const { content_text, media_url, visibility, tags } = req.body;
    const userId = req.user.id; // From your Auth middleware
    const userRole = req.user.role;

    // 1. AI Content Moderation [SRS 5.5]
    const moderationResult = await analyzeContent(content_text);
    const risk_score = moderationResult.riskScore;
    const is_flagged = moderationResult.isFlagged;
    
    // Apply trust penalty if flagged [SRS 5.1 Account Trust Score]
    if (is_flagged) {
      const user = await User.findById(userId);
      if (user) {
        user.trustScore = applyTrustPenalty(user.trustScore || 100, risk_score);
        await user.save();
      }
    }

    // Universal blocking for high-risk content
    if (risk_score >= 0.8) {
      return res.status(403).json({ 
        message: "Post blocked: Violates safety guidelines." 
      });
    }

    // 2. Youth Safety Enforcement [SRS 5.5.3]
    let finalVisibility = visibility;
    if (userRole === 'child') {
      // Force restriction for youth accounts [cite: 379, 504]
      finalVisibility = 'followers'; 
      
      // Strict blocking for medium-risk youth content
      if (risk_score >= 0.5) {
        return res.status(403).json({ 
          message: "Post blocked: Content does not meet youth safety guidelines." 
        });
      }
    }

    // 3. Create the Post [cite: 132]
    const newPost = new Post({
      user: userId,
      content_text,
      media_url,
      tags,
      visibility: finalVisibility,
      risk_score,
      is_flagged
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: is_flagged ? "Post submitted and flagged for review" : "Post created successfully",
      post: newPost
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = { is_flagged: false };

    // Youth Feed Special Logic: Only show safe/educational content [cite: 549, 552]
    if (userRole === 'child') {
      query.risk_score = { $lt: 0.3 }; // Strict safety threshold [cite: 342]
    }

    const posts = await Post.find(query)
      .populate('user', 'username avatar role')
      .sort({ createdAt: -1 }) // Recency ranking [cite: 539]
      .limit(20);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feed", error: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content_text, tags, visibility } = req.body;
    const userId = req.user.id;

    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    if (content_text) post.content_text = content_text;
    if (tags) post.tags = tags;
    if (visibility && req.user.role !== 'child') {
      post.visibility = visibility;
    }

    // Moderation on Edit
    if (content_text) {
      const moderationResult = await analyzeContent(content_text);
      post.risk_score = moderationResult.riskScore;
      post.is_flagged = moderationResult.isFlagged;
      
      if (post.is_flagged) {
        const user = await User.findById(userId);
        if (user) {
          user.trustScore = applyTrustPenalty(user.trustScore || 100, post.risk_score);
          await user.save();
        }
      }

      if (post.risk_score >= 0.8 || (req.user.role === 'child' && post.risk_score >= 0.5)) {
        return res.status(403).json({ 
          message: "Edit blocked: Content violates safety guidelines." 
        });
      }
    }

    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('user', 'username avatar role');

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.visibility === 'private' && (!req.user || post.user._id.toString() !== req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    let query = { user: userId };

    if (currentUserId !== userId) {
        query.visibility = 'public'; // Check followers in complete version
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar role');

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};