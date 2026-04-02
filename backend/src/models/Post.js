import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content_text: {
    type: String,
    required: [true, 'Post content cannot be empty'],
    trim: true,
    maxlength: 2000
  },
  media_url: {
    type: String, // URL to cloud storage or local path
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  // Safety & Moderation Fields
  is_flagged: {
    type: Boolean,
    default: false
  },
  risk_score: {
    type: Number,
    default: 0 // 0 (Safe) to 1 (Harmful)
  },
  moderation_remark: String
}, { timestamps: true });

// Indexing for performance (Feed generation)
postSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);