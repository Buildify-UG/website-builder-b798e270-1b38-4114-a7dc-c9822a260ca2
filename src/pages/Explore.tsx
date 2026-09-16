import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Share2, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  leader_name: string;
  title: string;
  views: number;
  likes: number;
  created_at: string;
}

const Explore = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [loading, setLoading] = useState(true);

  const leaders = [
    'Bishop David Oyedepo',
    'Pastor David Oyedepo',
    'Pastor David Ibiyiomie',
    'Pastor Isaac Oyedepo',
    'Apostle Joshua Selman',
    'Apostle Michael Arokpo',
    'Apostle Osai Arome',
    'Pastor Paul Eneche',
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('id, leader_name, title, views, likes, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
        setFilteredVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    let results = videos;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.leader_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by leader
    if (selectedLeader) {
      results = results.filter((video) => video.leader_name === selectedLeader);
    }

    setFilteredVideos(results);
  }, [searchQuery, selectedLeader, videos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✝️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Christ Tok</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachings, leaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Filters</h3>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Faith Leaders
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedLeader('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedLeader === ''
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    All Leaders
                  </button>
                  {leaders.map((leader) => (
                    <button
                      key={leader}
                      onClick={() => setSelectedLeader(leader)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${
                        selectedLeader === leader
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      {leader}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-purple-500/20">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Videos</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {videos.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Filtered Results</p>
                    <p className="text-2xl font-bold text-pink-400">
                      {filteredVideos.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Videos Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-white text-lg">Loading videos...</p>
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVideos.map((video) => (
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
                    <div className="p-6">
                      <p className="text-sm text-purple-300 mb-2">
                        {video.leader_name}
                      </p>
                      <h4 className="text-lg font-bold text-white mb-4 line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>{video.likes.toLocaleString()} likes</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 hover:text-pink-500 transition"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="text-xs">Like</span>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 hover:text-purple-500 transition"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-xs">Comment</span>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 hover:text-purple-500 transition"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-xs">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-2">No videos found</p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
