import React, { useState } from 'react';
import { Upload as UploadIcon, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

const leaderRoles: Record<string, string> = {
  'Bishop David Oyedepo': 'Bishop',
  'Pastor David Oyedepo': 'Pastor',
  'Pastor David Ibiyiomie': 'Pastor',
  'Pastor Isaac Oyedepo': 'Pastor',
  'Apostle Joshua Selman': 'Apostle',
  'Apostle Michael Arokpo': 'Apostle',
  'Apostle Osai Arome': 'Apostle',
  'Pastor Paul Eneche': 'Pastor',
};

const UploadPage = () => {
  const [selectedLeader, setSelectedLeader] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setError('Video must be less than 500MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail must be less than 5MB');
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLeader || !title || !videoFile) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload video file
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(`videos/${videoFileName}`, videoFile);

      if (videoError) throw videoError;

      // Get video URL
      const { data: videoData } = supabase.storage
        .from('videos')
        .getPublicUrl(`videos/${videoFileName}`);

      let thumbnailUrl = '';
      if (thumbnailFile) {
        const thumbnailFileName = `${Date.now()}-thumbnail-${thumbnailFile.name}`;
        const { error: thumbError } = await supabase.storage
          .from('videos')
          .upload(`thumbnails/${thumbnailFileName}`, thumbnailFile);

        if (thumbError) throw thumbError;

        const { data: thumbData } = supabase.storage
          .from('videos')
          .getPublicUrl(`thumbnails/${thumbnailFileName}`);
        thumbnailUrl = thumbData.publicUrl;
      }

      // Save video metadata to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          leader_name: selectedLeader,
          leader_role: leaderRoles[selectedLeader],
          title,
          description,
          video_url: videoData.publicUrl,
          thumbnail_url: thumbnailUrl,
        });

      if (dbError) throw dbError;

      setSuccess('Video uploaded successfully!');
      setSelectedLeader('');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview('');
      setThumbnailPreview('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Teaching Video</h1>
          <p className="text-gray-400 mb-8">Share spiritual content with our community</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-300">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leader Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">Select Leader *</label>
              <select
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Choose a faith leader...</option>
                {leaders.map((leader) => (
                  <option key={leader} value={leader}>
                    {leader}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-3">Video Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Power of Faith"
                maxLength={100}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this teaching..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-white font-semibold mb-3">Video File * (Max 500MB)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-input"
                />
                <label
                  htmlFor="video-input"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer hover:border-purple-500 transition bg-slate-700/50"
                >
                  <div className="text-center">
                    <UploadIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Click to upload video</p>
                    <p className="text-sm text-gray-400">or drag and drop</p>
                  </div>
                </label>
              </div>
              {videoFile && <p className="text-sm text-green-400 mt-2">✓ {videoFile.name}</p>}
            </div>

            {/* Video Preview */}
            {videoPreview && (
              <div className="relative">
                <label className="block text-white font-semibold mb-3">Video Preview</label>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video src={videoPreview} controls className="w-full max-h-64" />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPreview('');
                      setVideoFile(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-white font-semibold mb-3">Thumbnail (Optional, Max 5MB)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-input"
                />
                <label
                  htmlFor="thumbnail-input"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/50 transition bg-slate-700/30"
                >
                  <div className="text-center">
                    <UploadIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm">Click to upload thumbnail</p>
                  </div>
                </label>
              </div>
              {thumbnailFile && <p className="text-sm text-green-400 mt-2">✓ {thumbnailFile.name}</p>}
            </div>

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div className="relative">
                <label className="block text-white font-semibold mb-3">Thumbnail Preview</label>
                <div className="relative w-full max-w-sm">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview('');
                      setThumbnailFile(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
