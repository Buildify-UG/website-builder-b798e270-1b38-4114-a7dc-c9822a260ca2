
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Search, Upload as UploadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('id, leader_name, title, views, likes, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        setUploadedVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const leaders = [
    { name: 'Bishop David Oyedepo', role: 'Bishop', videos: '2.4M', followers: '8.5M' },
    { name: 'Pastor David Oyedepo', role: 'Pastor', videos: '1.8M', followers: '6.2M' },
    { name: 'Pastor David Ibiyiomie', role: 'Pastor', videos: '1.5M', followers: '5.1M' },
    { name: 'Pastor Isaac Oyedepo', role: 'Pastor', videos: '920K', followers: '3.8M' },
    { name: 'Apostle Joshua Selman', role: 'Apostle', videos: '2.1M', followers: '7.3M' },
    { name: 'Apostle Michael Arokpo', role: 'Apostle', videos: '1.2M', followers: '4.6M' },
    { name: 'Apostle Osai Arome', role: 'Apostle', videos: '980K', followers: '3.2M' },
    { name: 'Pastor Paul Eneche', role: 'Pastor', videos: '1.7M', followers: '5.9M' },
  ];

  const videos = [
    { id: 1, leader: 'Bishop David Oyedepo', title: 'The Power of Faith', views: '2.3M', likes: '450K' },
    { id: 2, leader: 'Apostle Joshua Selman', title: 'Understanding God\'s Purpose', views: '1.9M', likes: '380K' },
    { id: 3, leader: 'Pastor Paul Eneche', title: 'Living in Victory', views: '1.6M', likes: '320K' },
    { id: 4, leader: 'Pastor David Ibiyiomie', title: 'Spiritual Warfare Secrets', views: '2.1M', likes: '420K' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✝️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Christ Tok</h1>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leaders, teachings..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/upload">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2">
                <UploadIcon className="w-4 h-4" />
                Upload
              </button>
            </Link>
            <button className="px-6 py-2 bg-slate-800 border border-purple-500/30 text-white rounded-full font-semibold hover:border-purple-500/60 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Welcome to Your Spiritual Community</h2>
          <p className="text-xl text-gray-300 mb-8">Learn from renowned faith leaders. Grow in your spiritual journey.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Explore Content
          </button>
        </div>

        {/* Featured Leaders */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8">Featured Faith Leaders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition"></div>
                <h4 className="text-lg font-bold text-white mb-1">{leader.name}</h4>
                <p className="text-sm text-purple-300 mb-4">{leader.role}</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>{leader.followers} followers</p>
                  <p>{leader.videos} videos</p>
                </div>
                <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Uploaded Videos */}
        {uploadedVideos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-8">Recently Uploaded</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploadedVideos.map((video) => (
                <div key={video.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500/60 transition cursor-pointer group">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-purple-300 mb-2">{video.leader_name}</p>
                    <h4 className="text-lg font-bold text-white mb-4">{video.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{video.views || 0} views</span>
                      <span>{video.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                      <button className="flex items-center gap-2 hover:text-pink-500 transition">
                        <Heart className="w-5 h-5" />
                        <span className="text-xs">Like</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-purple-500 transition">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-purple-500 transition">
                        <Share2 className="w-5 h-5" />
                        <span className="text-xs">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Videos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8">Trending Teachings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500/60 transition cursor-pointer group">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                      <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-300 mb-2">{video.leader}</p>
                  <h4 className="text-lg font-bold text-white mb-4">{video.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <button className="flex items-center gap-2 hover:text-pink-500 transition">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs">Like</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-500 transition">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-500 transition">
                      <Share2 className="w-5 h-5" />
                      <span className="text-xs">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">10M+</div>
            <p className="text-gray-300">Active Believers</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">500K+</div>
            <p className="text-gray-300">Daily Videos</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
            <p className="text-gray-300">Faith Leaders</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h3>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Enter Christ Tok
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 Christ Tok. A spiritual community for believers worldwide.</p>
          <p className="mt-2">Build with <a href="https://buildify.dev/" className="text-purple-400 hover:text-purple-300">Buildify</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
