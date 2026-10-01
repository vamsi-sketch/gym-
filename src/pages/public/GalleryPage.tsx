import React, { useState, useEffect } from 'react';
import { Play, X, Film, Image as ImageIcon } from 'lucide-react';
import { GalleryItem, VideoItem } from '../../types';
import { apiService } from '../../services/api';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiService.getGallery(), apiService.getVideos()])
      .then(([gal, vids]) => {
        setGallery(gal);
        setVideos(vids);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Gym', 'Equipment', 'Training', 'Members', 'Transformation', 'Events'];

  const filteredGallery =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          VISUAL SANCTUARY
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Club Gallery & Video Logs
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          Take an authentic look inside Fitzone Fitness. State-of-the-art selectorized zones, Olympic platforms, coaching clinics, and everyday athletic dedication.
        </p>
      </div>

      {/* Video Log Strip */}
      {videos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Film className="w-4 h-4 text-amber-500" />
            <h2 className="text-xl font-bold text-white font-display">Featured Video Logs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all cursor-pointer group"
              >
                <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-amber-400">
                    {vid.category}
                  </div>
                </div>

                <div className="p-5 space-y-1">
                  <h3 className="text-base font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{vid.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <h2 className="text-xl font-bold text-white font-display">Facility Photography</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="relative h-64 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white font-display">{item.title}</h4>
                {item.description && (
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={
                    activeVideo.videoUrl.includes('watch?v=')
                      ? activeVideo.videoUrl.replace('watch?v=', 'embed/')
                      : activeVideo.videoUrl
                  }
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>
            <div className="p-4 bg-neutral-950">
              <h3 className="text-base font-bold text-white font-display">{activeVideo.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-4 bg-neutral-950">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                {activePhoto.category}
              </span>
              <h3 className="text-base font-bold text-white font-display">{activePhoto.title}</h3>
              {activePhoto.description && (
                <p className="text-xs text-neutral-400 mt-1">{activePhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
