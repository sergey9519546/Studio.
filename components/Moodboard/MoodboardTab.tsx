import {
  Check,
  ChevronDown,
  Film,
  Heart,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  PlusCircle,
  Search,
  Sparkles,
  Upload,
  UploadCloud,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import { MoodboardItem, Project } from "../../types";
import MoodboardDetail from "./MoodboardDetail";
import UnsplashPhotoSearch from "../UnsplashPhotoSearch";

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

interface MoodboardTabProps {
  projectId?: string;
}

const MoodboardTab: React.FC<MoodboardTabProps> = ({ projectId: propProjectId }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(propProjectId);
  const [projects, setProjects] = useState<Project[]>([]);
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "image" | "video">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MoodboardItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [showImportInput, setShowImportInput] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [showUnsplashSearch, setShowUnsplashSearch] = useState(false);

  useEffect(() => {
    if (!propProjectId) {
      api.projects.list().then((res) => setProjects(res.data || []));
    } else {
      setSelectedProjectId(propProjectId);
    }
  }, [propProjectId]);

  useEffect(() => {
    if (!selectedProjectId) {
      setItems([]);
      return;
    }

    setLoading(true);
    let mounted = true;

    api.moodboard
      .list(selectedProjectId)
      .then((res) => {
        if (mounted) {
          setItems(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedProjectId]);

  const processFiles = async (files: FileList) => {
    if (!selectedProjectId) return;
    setIsUploading(true);

    try {
      const newItems: MoodboardItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const assetRes = await api.assets.upload(file, selectedProjectId);
        const asset = assetRes.data;
        if (asset) {
          const linkRes = await api.moodboard.linkAsset(selectedProjectId, asset.id);
          if (linkRes.data) {
            newItems.push(linkRes.data);
          }
        }
      }
      setItems((prev) => [...newItems, ...prev]);
      toast.success(`Pinned ${files.length} new ${files.length === 1 ? "item" : "items"}`);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(`Upload failed: ${msg}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImportUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !importUrl.trim()) return;

    setIsUploading(true);
    try {
      const res = await api.moodboard.create({
        projectId: selectedProjectId,
        type: "image",
        url: importUrl.trim(),
        caption: "Pinned from link",
      });
      if (res.data) {
        setItems((prev) => [res.data, ...prev]);
        setImportUrl("");
        setShowImportInput(false);
        toast.success("Link pinned to the board");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to import URL");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleUpdate = async (
    updated: MoodboardItem,
    options?: { silent?: boolean; previous?: MoodboardItem }
  ) => {
    const previous = options?.previous ?? items.find((i) => i.id === updated.id);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    try {
      await api.moodboard.update(updated);
      if (!options?.silent) {
        toast.success("Saved to moodboard");
      }
      return true;
    } catch (error) {
      console.error("Moodboard update failed", error);
      toast.error("Could not save changes");
      if (previous) {
        setItems((prev) => prev.map((i) => (i.id === previous.id ? previous : i)));
      }
      return false;
    }
  };

  const handleFavoriteToggle = async (item: MoodboardItem) => {
    const updated = { ...item, isFavorite: !item.isFavorite };
    const success = await handleUpdate(updated, { silent: true, previous: item });
    if (success) {
      setSelectedItem((prev) => (prev?.id === updated.id ? updated : prev));
      toast.success(updated.isFavorite ? "Pinned to favorites" : "Removed from favorites");
    }
  };

  const handleDelete = async (id: string) => {
    await api.moodboard.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem((prev) => (prev?.id === id ? null : prev));
    toast.success("Removed from board");
  };

  const handleUnsplashPhotoSelect = async (photo: UnsplashPhoto) => {
    if (!selectedProjectId) return;

    try {
      const caption = photo.description || photo.alt_description || `Photo by ${photo.user.name}`;
      const newItem = await api.moodboard.create({
        projectId: selectedProjectId,
        type: "image",
        url: photo.urls.regular,
        caption: caption,
        tags: [photo.user.username, "unsplash", "high-quality"],
        moods: ["inspiration", "photography"],
      });

      if (newItem.data) {
        setItems((prev) => [newItem.data, ...prev]);
        toast.success("Photo added from Unsplash");
      }
    } catch (error) {
      console.error("Error adding Unsplash photo:", error);
      toast.error("Failed to add photo from Unsplash");
    }
  };

  const favoriteItems = useMemo(() => items.filter((item) => item.isFavorite), [items]);

  const stats = useMemo(
    () => ({
      total: items.length,
      favorites: favoriteItems.length,
      images: items.filter((i) => i.type === "image").length,
      videos: items.filter((i) => i.type === "video").length,
    }),
    [favoriteItems.length, items]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.moods.some((m) => m.toLowerCase().includes(query)) ||
        item.caption.toLowerCase().includes(query);

      const matchesType = activeFilter === "all" || item.type === activeFilter;
      const matchesFavorite = !showFavoritesOnly || item.isFavorite;

      return matchesSearch && matchesType && matchesFavorite;
    });
  }, [activeFilter, items, searchQuery, showFavoritesOnly]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const favoriteScore = Number(b.isFavorite) - Number(a.isFavorite);
      if (favoriteScore !== 0) return favoriteScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredItems]);

  const getRowSpan = (item: MoodboardItem) => {
    const base = item.type === "video" ? 36 : 30;
    const captionWeight = Math.min(10, Math.ceil((item.caption?.length || 0) / 24));
    const moodWeight = Math.min(4, item.moods.length);
    return base + captionWeight + moodWeight;
  };

  return (
    <div
      className="flex flex-col h-full bg-[#f9fafb] p-6 min-h-screen relative"
      onDragOver={(e) => {
        e.preventDefault();
        if (!selectedProjectId) return;
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {dragActive && selectedProjectId && (
        <div className="absolute inset-0 z-50 bg-indigo-50/90 backdrop-blur-sm m-4 rounded-3xl border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-float animate-bounce">
            <UploadCloud size={48} className="text-indigo-600 mb-2" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-indigo-900 tracking-tight">Drop to pin</h3>
          <p className="text-sm text-indigo-600 font-medium">Add inspiration to your board</p>
        </div>
      )}

      {showUnsplashSearch && (
        <UnsplashPhotoSearch
          isOpen={showUnsplashSearch}
          onClose={() => setShowUnsplashSearch(false)}
          onSelectPhoto={handleUnsplashPhotoSelect}
        />
      )}

      {selectedItem && (
        <MoodboardDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={async (updated) => {
            const success = await handleUpdate(updated);
            if (success) {
              setSelectedItem(updated);
            }
          }}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
          <div className="bg-white/90 border border-gray-200 rounded-3xl shadow-sm p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Moodboard</p>
                  <p className="text-base font-semibold text-gray-900">
                    Pinterest-style pinboard {selectedProjectId ? "for this project" : ""}
                  </p>
                </div>
              </div>

              {!propProjectId && (
                <div className="relative min-w-[220px]">
                  <label className="text-[11px] uppercase text-gray-400 font-semibold tracking-[0.2em] block mb-1">
                    Project
                  </label>
                  <select
                    value={selectedProjectId || ""}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-gray-900 text-sm font-medium pl-4 pr-10 py-2.5 rounded-2xl shadow-sm focus:outline-none focus:border-indigo-500 cursor-pointer hover:border-gray-300 transition-colors w-full"
                  >
                    <option value="" disabled>
                      Select context...
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-[38px] text-gray-400 pointer-events-none" />
                </div>
              )}

              <div className="relative flex-1 min-w-[240px]">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search moods, tags, captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-sm font-medium transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                      activeFilter === "all"
                        ? "bg-gray-900 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter("image")}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                      activeFilter === "image"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setActiveFilter("video")}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                      activeFilter === "video"
                        ? "bg-rose-500 text-white shadow-md"
                        : "text-gray-500 hover:text-rose-500"
                    }`}
                  >
                    Videos
                  </button>
                </div>
                <button
                  onClick={() => setShowFavoritesOnly((prev) => !prev)}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all flex items-center gap-2 ${
                    showFavoritesOnly
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Heart
                    size={14}
                    className={showFavoritesOnly ? "fill-amber-500 text-amber-600" : "text-gray-500"}
                  />
                  Favorites
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700">
                Pins: {stats.total}
              </div>
              <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
                Favorites: {stats.favorites}
              </div>
              <div className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
                Images: {stats.images}
              </div>
              <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                Videos: {stats.videos}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] text-white rounded-3xl shadow-lg p-5 border border-gray-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Collect favorites</p>
                <h3 className="text-xl font-semibold">Build your Pinterest-style moodboard</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Drop inspiration, import links, and save the keepers as favorites.
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold leading-tight">{stats.total || "—"}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Pins</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedProjectId || isUploading}
                className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/15 transition-all shadow-lg shadow-black/20 flex items-center gap-2 disabled:opacity-60"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload
              </button>
              <button
                onClick={() => setShowUnsplashSearch(true)}
                disabled={!selectedProjectId}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2 disabled:opacity-60"
              >
                <Search size={16} />
                Search Photos
              </button>
              <button
                onClick={() => setShowImportInput((prev) => !prev)}
                disabled={!selectedProjectId}
                className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/15 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <LinkIcon size={14} />
                Import Link
              </button>
            </div>

            {showImportInput && selectedProjectId && (
              <form
                onSubmit={handleImportUrl}
                className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl p-2 shadow-inner mt-4"
              >
                <input
                  autoFocus
                  type="url"
                  placeholder="https://..."
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="flex-1 pl-3 text-xs outline-none bg-transparent h-9 text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-xs font-bold uppercase"
                >
                  {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                </button>
              </form>
            )}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleUpload}
            />
          </div>
        </div>

        {favoriteItems.length > 0 && selectedProjectId && (
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Heart size={16} className="fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Favorites rail</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {favoriteItems.length} pinned {favoriteItems.length === 1 ? "idea" : "ideas"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                className="text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-600"
              >
                {showFavoritesOnly ? "Show all pins" : "Show only favorites"}
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {favoriteItems.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => setSelectedItem(fav)}
                  className="min-w-[140px] relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  {fav.type === "video" ? (
                    <video
                      src={fav.url}
                      className="w-full h-28 object-cover"
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <img src={fav.url} alt={fav.caption} className="w-full h-28 object-cover" loading="lazy" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-[11px] text-white font-semibold line-clamp-2">{fav.caption || "Untitled"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!selectedProjectId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-3xl py-20">
            <Film size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-widest">Select a project to start pinning</p>
            <p className="text-xs mt-2 text-gray-400 max-w-xs text-center leading-relaxed">
              Choose a project context, then upload, import, or search photos to build your board.
            </p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gray-300" />
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-3xl py-16">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-dashed border-gray-200"
            >
              <PlusCircle size={40} className="opacity-70" />
            </div>
            <p className="text-base font-semibold text-gray-700">Start curating your moodboard</p>
            <p className="text-xs mt-2 text-gray-400 max-w-sm text-center leading-relaxed">
              Upload your own visuals, import links, or pull inspiration from Unsplash. Mark favorites to keep them at
              the top.
            </p>
          </div>
        ) : (
          <div className="grid auto-rows-[10px] grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-20">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                style={{ gridRowEnd: `span ${getRowSpan(item)}` }}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-zoom-in"
              >
                <div className="relative h-full">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
                  )}

                  <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide shadow-sm ${
                        item.type === "video"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {item.type === "video" ? "Video" : "Image"}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.status === "processing" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/80 backdrop-blur text-gray-700 border border-gray-200 flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" /> Processing
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(item);
                        }}
                        className="p-2 rounded-full bg-white/90 shadow-sm text-gray-700 hover:text-amber-600 hover:shadow-md transition-all"
                      >
                        <Heart
                          size={16}
                          className={item.isFavorite ? "fill-amber-500 text-amber-600" : "text-gray-500"}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white/90 text-[11px] font-semibold uppercase tracking-wide">
                      {item.type === "video" ? <Film size={12} /> : <ImageIcon size={12} />}
                      <span>{item.status === "processing" ? "Analyzing" : "Pinned"}</span>
                      {item.isFavorite && (
                        <span className="px-2 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold uppercase">
                          Favorite
                        </span>
                      )}
                    </div>
                    <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                      {item.caption || "Untitled pin"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-[11px] font-medium bg-white/20 text-white border border-white/20 backdrop-blur"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodboardTab;
