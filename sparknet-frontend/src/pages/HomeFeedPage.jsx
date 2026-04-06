import { useState, useEffect } from 'react';
import { PostCard } from '../components/posts/PostSystem';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/postApi';
import toast from 'react-hot-toast';

export const HomeFeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data } = await postApi.getFeed();
      setPosts(data.posts || []);
    } catch (err) {
      toast.error('Failed to load feed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await postApi.createPost({ content: newPostContent });
      toast.success('Post shared!');
      setNewPostContent('');
      fetchFeed(); // Refresh feed after posting
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-spark-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-display">Igniting your feed...</p>
      </div>
    );
  }

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
        {posts.length === 0 ? (
          <div className="spark-card p-12 text-center">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post._id || post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};
