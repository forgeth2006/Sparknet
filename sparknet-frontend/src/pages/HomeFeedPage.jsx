import { useState } from 'react';
import { PostCard } from '../components/posts/PostSystem';
import { useAuth } from '../context/AuthContext';

// Dummy data for initial display
const dummyPosts = [
  {
    id: 1,
    authorName: 'Alex Mercer',
    authorId: 101,
    content: 'Just finished my first React Native app! The learning curve was steep but totally worth it. Now diving into the deployment process. 🚀📱',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 24,
    commentsCount: 5,
    isLikedByMe: true,
    tags: ['reactnative', 'coding', 'learning']
  },
  {
    id: 2,
    authorName: 'Sarah Chen',
    authorId: 102,
    content: 'Nature is the best reset button. Spent the weekend hiking in the mountains. 🏔️🌲',
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likesCount: 112,
    commentsCount: 18,
    isLikedByMe: false,
    tags: ['photography', 'nature', 'hiking']
  }
];

export const HomeFeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(dummyPosts);
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      authorName: user?.username || 'You',
      authorId: user?.id || 'me',
      content: newPostContent,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLikedByMe: false,
      tags: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-800 text-3xl text-white">Your Feed</h1>
        <div className="flex bg-dark-700 rounded-lg p-1">
          <button className="px-4 py-1.5 rounded-md bg-dark-600 text-spark-400 font-display font-600 text-sm shadow-sm transition-all">For You</button>
          <button className="px-4 py-1.5 rounded-md text-gray-400 hover:text-white font-display font-600 text-sm transition-all">Following</button>
        </div>
      </div>

      {/* Create Post Area */}
      {user?.role !== 'child' && (
        <div className="spark-card p-4 animate-fade-in border-t-2 border-spark-500/20">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spark-500 to-purple-600 flex items-center justify-center text-white font-display font-700 shadow-lg shadow-spark-500/20 shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <form onSubmit={handleCreatePost} className="flex-1 space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, learnings, or ask a question..."
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none min-h-[80px]"
              />
              <div className="flex items-center justify-between pt-2 border-t border-dark-600/50">
                <div className="flex gap-2">
                  <button type="button" className="text-gray-400 hover:text-spark-400 p-2 rounded-full hover:bg-dark-700 transition-colors">
                    <span className="text-xl">📷</span>
                  </button>
                  <button type="button" className="text-gray-400 hover:text-spark-400 p-2 rounded-full hover:bg-dark-700 transition-colors">
                    <span className="text-xl">🏷️</span>
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="spark-btn-primary py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feed List */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
