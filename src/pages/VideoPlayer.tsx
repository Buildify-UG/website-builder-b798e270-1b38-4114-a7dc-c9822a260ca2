import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  leader_name: string;
  leader_role: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  likes_count: number;
  created_at: string;
  users?: { username: string; avatar_url: string };
  replies?: Comment[];
}

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', videoId)
          .single();

        if (error) throw error;
        setVideo(data);

        // Increment views
        await supabase
          .from('videos')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', videoId);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            user_id,
            likes_count,
            created_at,
            users:user_id(username, avatar_url)
          `)
          .eq('video_id', videoId)
          .is('parent_comment_id', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (videoId) {
      fetchVideo();
      fetchComments();
    }
  }, [videoId]);

  const handleLike = async () => {
    if (!video) return;

    try {
      if (liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('video_id', video.id);

        setVideo({ ...video, likes: Math.max(0, video.likes - 1) });
        setLiked(false);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            video_id: video.id,
            session_id: `session_${Date.now()}`,
          });

        setVideo({ ...video, likes: video.likes + 1 });
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async () => {
    if (!video || !newComment.trim()) return;

    setCommenting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          video_id: video.id,
          user_id: '00000000-0000-0000-0000-000000000000',
          content: newComment,
        })
        .select();

      if (error) throw error;

      setComments([...data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Christ Tok</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden mb-6">
              <video
                src={video.video_url}
                controls
                className="w-full aspect-video"
                poster={video.thumbnail_url}
              />
            </div>

            {/* Video Info */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-semibold">{video.leader_name}</p>
                    <p className="text-sm text-gray-400">{video.leader_role}</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                  Follow
                </button>
              </div>

              {video.description && (
                <p className="text-gray-300 mb-4">{video.description}</p>
              )}

              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <span>{video.views.toLocaleString()} views</span>
                <span>
                  {new Date(video.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Engagement Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
                  liked
                    ? 'bg-pink-600/20 text-pink-400'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {video.likes}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-gray-300 rounded-full font-semibold hover:bg-slate-700 transition">
                <MessageCircle className="w-5 h-5" />
                {comments.length}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-gray-300 rounded-full font-semibold hover:bg-slate-700 transition">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Comments</h3>

              {/* New Comment */}
              <div className="mb-8 pb-8 border-b border-purple-500/20">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleComment}
                      disabled={commenting || !newComment.trim()}
                      className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
                    >
                      {commenting ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-white mb-1">
                          {comment.users?.username || 'Anonymous'}
                        </p>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <button className="hover:text-pink-400 transition">
                          Like ({comment.likes_count})
                        </button>
                        <button className="hover:text-purple-400 transition">
                          Reply
                        </button>
                        <span>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Recommended</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg overflow-hidden hover:border-purple-500/60 transition cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-white border-t-3 border-t-transparent border-b-3 border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-purple-300 mb-1">Pastor David Oyedepo</p>
                    <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                      Spiritual Growth Secrets
                    </h4>
                    <p className="text-xs text-gray-400">1.2M views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
