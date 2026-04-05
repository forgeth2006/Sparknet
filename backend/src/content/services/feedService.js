/**
 * Feed Service  [SparkNet Content System — Step 1]
 *
 * Responsible for:
 *  1. Fetching candidate posts from MongoDB
 *  2. Applying visibility / safety filters (role-aware)
 *  3. Ranking posts via a modular scoring function
 *  4. Returning paginated results
 *
 * Architecture note:
 *  This is a pure service layer — no req/res knowledge.
 *  Swap the rankPost() function with an ML model later without
 *  touching the controller or route.
 */

import Post from '../../models/Post.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FEED_PAGE_SIZE = 20;

// Risk thresholds (matches moderationService.js)
const RISK_THRESHOLDS = {
  SAFE:   0.3,   // below this → always show
  MEDIUM: 0.5,   // youth users blocked here
  HIGH:   0.8,   // all users blocked here
};

// ─────────────────────────────────────────────────────────────────────────────
// RANKING ENGINE
//
// Feed Score = recency + engagement + trust bonus – risk penalty
//
// This is intentionally simple and modular.
// To plug in an ML model later: replace rankPost() with an async call
// to your recommendation API — the rest of the pipeline stays the same.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a single post for feed ranking.
 * Returns a number: higher = appears earlier in feed.
 *
 * @param {Object} post     - Mongoose post document
 * @param {Object} options
 * @param {Number} options.creatorTrustScore - author's trustScore (0–100)
 * @param {Array<String>} options.userInterests - viewer's interests
 * @returns {Number} feed score
 */
function rankPost(post, { creatorTrustScore = 100, userInterests = [] } = {}) {
  const now = Date.now();
  const ageHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

  // ── 1. Recency score (exponential decay, half-life ≈ 24 h) ───────────────
  //       Score = 1.0 at 0 h, ≈ 0.5 at 24 h, ≈ 0.25 at 48 h
  const recencyScore = Math.pow(0.5, ageHours / 24);

  // ── 2. Engagement score (normalized, logarithmic to prevent viral dominance)
  const likes    = post.likeCount    || 0;
  const comments = post.commentCount || 0;
  const saves    = post.saveCount    || 0;
  const engagementScore = Math.log1p(likes * 1.0 + comments * 1.5 + saves * 2.0) / 10;

  // ── 3. Creator trust bonus (0.0 – 0.2 range) ─────────────────────────────
  const trustBonus = (creatorTrustScore / 100) * 0.2;

  // ── 4. Risk penalty (0.0 – 0.5 range) ────────────────────────────────────
  const riskPenalty = post.risk_score * 0.5;

  // ── 5. Interest match bonus (0.0 – 0.5 range) ────────────────────────────
  let interestBonus = 0;
  if (userInterests.length > 0 && Array.isArray(post.tags)) {
    const overlap = post.tags.filter(tag => userInterests.includes(tag.toLowerCase()));
    if (overlap.length > 0) {
      // 0.2 base bonus just for hitting 1 tag, up to 0.5 cap
      interestBonus = Math.min(0.5, 0.2 + (overlap.length * 0.1));
    }
  }

  const totalScore = recencyScore + engagementScore + trustBonus + interestBonus - riskPenalty;
  return Math.max(0, totalScore);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FEED BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a paginated, ranked feed for a given user.
 *
 * @param {Object} options
 * @param {String} options.userId     - current user's _id (string)
 * @param {String} options.userRole   - 'child' | 'user' | 'admin'
 * @param {Number} options.page       - 1-indexed page number (default: 1)
 * @param {Number} options.limit      - results per page (default: FEED_PAGE_SIZE)
 * @param {Array<String>} options.userInterests - current user's interests
 *
 * @returns {Object} { posts, pagination }
 */
export const buildFeed = async ({
  userId,
  userRole,
  page  = 1,
  limit = FEED_PAGE_SIZE,
  userInterests = [],
}) => {
  const skip = (page - 1) * limit;

  // ── Step 1: Build query filter ─────────────────────────────────────────────
  const query = {
    visibility: 'public',  // only public posts in the global feed
    is_flagged: false,     // never show flagged posts to end users
  };

  // Youth Safety Rule [SRS 5.5.3]:
  // Child users only see content with risk_score below the SAFE threshold
  if (userRole === 'child') {
    query.risk_score = { $lt: RISK_THRESHOLDS.SAFE };
  }

  // ── Step 2: Fetch candidate posts from DB ─────────────────────────────────
  // We fetch 3× the page size as candidates to allow re-ranking.
  // After scoring, we slice to the requested page + limit.
  const candidateLimit = limit * 3;

  const rawPosts = await Post.find(query)
    .populate('user', 'username oauthAvatarUrl role trustScore')
    .sort({ createdAt: -1 })       // pre-sort by recency as baseline
    .skip(skip)
    .limit(candidateLimit)
    .lean();                       // plain JS objects — faster for scoring

  // ── Step 3: Rank each candidate ───────────────────────────────────────────
  const scoredPosts = rawPosts.map((post) => ({
    ...post,
    _feedScore: rankPost(post, {
      creatorTrustScore: post.user?.trustScore ?? 100,
      userInterests
    }),
  }));

  // ── Step 4: Sort by feed score descending ─────────────────────────────────
  scoredPosts.sort((a, b) => b._feedScore - a._feedScore);

  // ── Step 5: Slice to requested page ───────────────────────────────────────
  const pagePosts = scoredPosts.slice(0, limit);

  // ── Step 6: Count total for pagination metadata ───────────────────────────
  const total = await Post.countDocuments(query);

  return {
    posts: pagePosts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Fetch all posts by a specific user (profile page).
 * Respects visibility rules based on who is viewing.
 *
 * @param {Object} options
 * @param {String} options.targetUserId   - whose posts to fetch
 * @param {String} options.viewerUserId   - who is viewing (null = public)
 * @param {String} options.viewerRole     - 'child' | 'user' | 'admin'
 * @param {Number} options.page
 * @param {Number} options.limit
 */
export const getUserPostsFeed = async ({
  targetUserId,
  viewerUserId,
  viewerRole,
  page  = 1,
  limit = FEED_PAGE_SIZE,
}) => {
  const skip = (page - 1) * limit;
  const isSelf  = viewerUserId && viewerUserId.toString() === targetUserId.toString();
  const isAdmin = viewerRole === 'admin';

  // Build visibility filter
  let visibilityFilter;
  if (isSelf || isAdmin) {
    visibilityFilter = { $in: ['public', 'followers', 'private'] }; // see all own posts
  } else {
    visibilityFilter = 'public'; // strangers only see public
  }

  const query = {
    user: targetUserId,
    visibility: visibilityFilter,
  };

  // Youth viewer cannot see flagged content
  if (viewerRole === 'child') {
    query.is_flagged = false;
    query.risk_score = { $lt: RISK_THRESHOLDS.SAFE };
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('user', 'username oauthAvatarUrl role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};
