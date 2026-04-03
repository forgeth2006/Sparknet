import Post from '../../models/Post.js';
import User from '../../models/User.js';

// Simple Keyword Filter for Phase 1 Moderation [cite: 494]
const BANNED_WORDS = ['violence', 'spam', 'hate', 'badword123']; 

export const createPost = async (req, res) => {
  try {
    const { content_text, media_url, visibility, tags } = req.body;
    const userId = req.user.id; // From your Auth middleware
    const userRole = req.user.role;

    // 1. Basic Content Moderation [cite: 487, 495]
    const containsBanned = BANNED_WORDS.some(word => 
      content_text.toLowerCase().includes(word)
    );

    let risk_score = containsBanned ? 0.8 : 0.1; // High risk if banned words found [cite: 489]
    let is_flagged = containsBanned;

    // 2. Youth Safety Enforcement [cite: 501, 507]
    let finalVisibility = visibility;
    if (userRole === 'child') {
      // Force restriction for youth accounts [cite: 379, 504]
      finalVisibility = 'followers'; 
      
      // Strict blocking for high-risk youth content [cite: 555]
      if (risk_score > 0.5) {
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

    const containsBanned = BANNED_WORDS.some(word => 
      post.content_text && post.content_text.toLowerCase().includes(word)
    );
    post.risk_score = containsBanned ? 0.8 : 0.1;
    post.is_flagged = containsBanned;

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