import { Download, ExternalLink, Heart, Loader2, Palette, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

interface UnsplashPhoto {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  likes: number;
  description: string | null;
  alt_description: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    portfolio_url?: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
    };
  };
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

interface UnsplashPhotoSearchProps {
  onSelectPhoto: (photo: UnsplashPhoto) => void;
  onClose: () => void;
  isOpen: boolean;
}

const UnsplashPhotoSearch: React.FC<UnsplashPhotoSearchProps> = ({ 
  onSelectPhoto, 
  onClose, 
  isOpen 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [downloadingPhoto, setDownloadingPhoto] = useState<string | null>(null);
  const toast = useToast();

  const searchPhotos = async (query: string, pageNum: number = 1, append: boolean = false) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/unsplash/search?query=${encodeURIComponent(query)}&page=${pageNum}&per_page=20`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const searchResults: UnsplashSearchResponse = data.data;
        
        if (append) {
          setPhotos(prev => [...prev, ...searchResults.results]);
        } else {
          setPhotos(searchResults.results);
          setPage(1);
        }
        
        setTotal(searchResults.total);
        setHasMore(searchResults.results.length === 20 && pageNum < searchResults.total_pages);
        setPage(pageNum);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Unsplash search error:', error);
      toast.error('Failed to search photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchPhotos(searchQuery.trim(), 1, false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore && searchQuery.trim()) {
      searchPhotos(searchQuery.trim(), page + 1, true);
    }
  };

  const handleDownload = async (photo: UnsplashPhoto) => {
    setDownloadingPhoto(photo.id);
    try {
      // Track download with Unsplash
      const response = await fetch(`/api/v1/unsplash/photos/${photo.id}/download`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.url) {
          // Open the download URL in a new tab
          window.open(data.data.url, '_blank');
          toast.success('Photo download initiated');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to track download');
    } finally {
      setDownloadingPhoto(null);
    }
  };

  const handleSelectPhoto = (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
  };

  const confirmSelectPhoto = () => {
    if (selectedPhoto) {
      onSelectPhoto(selectedPhoto);
      setSelectedPhoto(null);
      onClose();
      toast.success('Photo added to moodboard');
    }
  };

  const cancelSelectPhoto = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    // Load some featured photos on component mount
    searchPhotos('nature', 1, false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Unsplash Photo Search</h2>
              <p className="text-sm text-gray-500">Find and add high-quality photos to your moodboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for photos (e.g., nature, architecture, people, technology)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && photos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-500">Searching photos...</p>
              </div>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Search for photos to get started</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleSelectPhoto(photo)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={photo.urls.small}
                        alt={photo.alt_description || photo.description || 'Unsplash photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPhoto(photo);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-900 hover:bg-white transition-colors"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(photo);
                            }}
                            disabled={downloadingPhoto === photo.id}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-900 hover:bg-white transition-colors disabled:opacity-50"
                          >
                            {downloadingPhoto === photo.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Photo Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={photo.user.profile_image.small}
                          alt={photo.user.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs text-gray-600 font-medium truncate">
                          {photo.user.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{photo.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Palette className="w-3 h-3" />
                          <div
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ backgroundColor: photo.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      'Load More Photos'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Selected Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Add Photo to Moodboard</h3>
                  <button
                    onClick={cancelSelectPhoto}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <img
                      src={selectedPhoto.urls.regular}
                      alt={selectedPhoto.alt_description || selectedPhoto.description || 'Unsplash photo'}
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md p-2 rounded-lg">
                      <div className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: selectedPhoto.color }} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Photo Details</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedPhoto.description || selectedPhoto.alt_description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={selectedPhoto.user.profile_image.medium}
                          alt={selectedPhoto.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedPhoto.user.name}</p>
                          <p className="text-xs text-gray-500">@{selectedPhoto.user.username}</p>
                        </div>
                        <a
                          href={selectedPhoto.user.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{selectedPhoto.likes} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Palette className="w-4 h-4" />
                          <span>{selectedPhoto.width} × {selectedPhoto.height}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={confirmSelectPhoto}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                      >
                        Add to Moodboard
                      </button>
                      <button
                        onClick={cancelSelectPhoto}
                        className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnsplashPhotoSearch;
