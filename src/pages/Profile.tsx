import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ArrowLeft, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  is_leader: boolean;
  leader_name: string;
  followers_count: number;
  following_count: number;
}

interface UserVideo {
  id: string;
  title: string;
  views: number;
  likes: number;
  created_at: string;
}

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);

        // Fetch user's videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('id, title, views, likes, created_at')
          .eq('leader_name', data.leader_name || data.full_name)
          .order('created_at', { ascending: false });

        if (!videosError) {
          setVideos(videosData || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleFollow = async () => {
    if (!profile) return;

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('following_id', profile.id);
        setIsFollowing(false);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: '00000000-0000-0000-0000-000000000000',
            following_id: profile.id,
          });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">{profile.username}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {profile.full_name}
              </h2>
              <p className="text-purple-300 mb-4">@{profile.username}</p>

              {profile.bio && (
                <p className="text-gray-300 mb-6">{profile.bio}</p>
              )}

              {profile.is_leader && (
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold mb-6">
                  ✝️ Verified Leader
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-8 mb-6">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {videos.length}
                  </p>
                  <p className="text-gray-400 text-sm">Videos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {profile.followers_count.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {profile.following_count.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleFollow}
                  className={`px-8 py-3 rounded-full font-semibold transition ${
                    isFollowing
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Videos</h3>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/video/${video.id}`)}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500/60 transition cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-3 line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{video.likes.toLocaleString()} likes</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <button className="flex items-center gap-1 hover:text-pink-400 transition">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">Like</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-purple-400 transition">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">Comment</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-purple-400 transition">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No videos yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
