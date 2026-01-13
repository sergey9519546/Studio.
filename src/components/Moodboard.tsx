import { Clock, Filter, Heart, Image, Plus, Search, Trash2, X, XCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  searchSimilarImages,
  trackDownload,
  isUnsplashConfigured,
  type UnsplashImage,
} from "../services/unsplash";
import { useToast } from "../hooks/useToast";
import { MoodboardAPI } from "../services/api/moodboard";
import {
  addRecentSearch,
  getRecentSearches,
  removeRecentSearch,
} from "../services/recentSearches";
import type { MoodboardItem } from "../services/types";
import { Button } from "./design/Button";
import { Card } from "./design/Card";
import { Input } from "./design/Input";
import { Select } from "./design/Select";

interface MoodboardProps {
  projectId: string;
  items?: MoodboardItem[];
  onItemDelete?: (id: string) => void;
  onSemanticSearch?: (query: string) => Promise<MoodboardItem[]>;
  onAddUnsplashImage?: (image: UnsplashImage) => Promise<void>;
}

type TabType = "uploads" | "unsplash";

const UNSPLASH_COLOR_OPTIONS = [
  { value: "", label: "All Colors" },
  { value: "black_and_white", label: "Black & White" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "yellow", label: "Yellow" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
  { value: "amber", label: "Amber" },
  { value: "magenta", label: "Magenta" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "blue", label: "Blue" },
];

const UNSPLASH_ORIENTATION_OPTIONS = [
  { value: "", label: "Any Orientation" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "squarish", label: "Square" },
];

const filterByTags = (list: MoodboardItem[], tags: string[]) => {
  if (tags.length === 0) return list;
  return list.filter((item) =>
    tags.some((tag) => item.tags.includes(tag) || item.moods.includes(tag))
  );
};

const filterByQuery = (list: MoodboardItem[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return list;
  return list.filter((item) => {
    const caption = item.caption?.toLowerCase() || "";
    const title = item.title?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";
    const tags = item.tags.some((tag) => tag.toLowerCase().includes(normalized));
    const moods = item.moods.some((mood) => mood.toLowerCase().includes(normalized));
    return (
      caption.includes(normalized) ||
      title.includes(normalized) ||
      description.includes(normalized) ||
      tags ||
      moods
    );
  });
};

export const Moodboard: React.FC<MoodboardProps> = ({
  projectId,
  items = [],
  onItemDelete,
  onSemanticSearch,
  onAddUnsplashImage,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("uploads");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MoodboardItem[] | null>(
    null
  );
  const { addToast } = useToast();

  // Unsplash state
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<UnsplashImage[]>([]);
  const [isLoadingUnsplash, setIsLoadingUnsplash] = useState(false);
  const [selectedUnsplashImage, setSelectedUnsplashImage] = useState<
    string | null
  >(null);
  const [unsplashError, setUnsplashError] = useState<string | null>(null);
  const [unsplashMeta, setUnsplashMeta] = useState<{
    total: number;
    total_pages: number;
    page: number;
    per_page: number;
  }>({ total: 0, total_pages: 0, page: 1, per_page: 24 });

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Unsplash filters (P1: Advanced Filters)
  const [unsplashFilters, setUnsplashFilters] = useState<{
    color?: string;
    orientation?: string;
  }>({});

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setFilteredItems(filterByTags(items, selectedTags));
    }
  }, [items, searchQuery, selectedTags]);

  // Load recent searches on mount and when tab changes to Unsplash
  React.useEffect(() => {
    if (activeTab === "unsplash") {
      setRecentSearches(getRecentSearches());
    }
  }, [activeTab]);

  // Extract all unique tags from items
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tagsSet.add(tag));
      item.moods.forEach((mood) => tagsSet.add(mood));
    });
    return Array.from(tagsSet).sort();
  }, [items]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults(null);
      setFilteredItems(filterByTags(items, selectedTags));
      return;
    }

    setIsSearching(true);
    try {
      const baseResults = onSemanticSearch
        ? await onSemanticSearch(trimmed)
        : filterByQuery(items, trimmed);
      setSearchResults(baseResults);
      setFilteredItems(filterByTags(baseResults, selectedTags));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Search failed. Try again.";
      addToast(message);
      setFilteredItems(filterByTags(items, selectedTags));
    } finally {
      setIsSearching(false);
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    const base = searchResults ?? items;
    setFilteredItems(filterByTags(base, newTags));
  };

  // Unsplash search handler
  const runUnsplashSearch = async (page = 1) => {
    if (!unsplashQuery.trim()) return;

    if (!isUnsplashConfigured()) {
      const message =
        "Unsplash search is disabled: add VITE_UNSPLASH_ACCESS_KEY to your environment.";
      setUnsplashError(message);
      addToast(message);
      return;
    }

    setIsLoadingUnsplash(true);
    setUnsplashError(null);
    try {
      const results = await searchSimilarImages(
        unsplashQuery,
        unsplashMeta.per_page,
        page,
        unsplashFilters.color,
        unsplashFilters.orientation
      );
      setUnsplashResults(results.results);
      setUnsplashMeta({
        total: results.total,
        total_pages: results.total_pages,
        page,
        per_page: unsplashMeta.per_page,
      });

      // Add to recent searches
      addRecentSearch(unsplashQuery);
      setRecentSearches(getRecentSearches());
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unsplash search failed. Check API key or network.";
      console.error("Unsplash search failed:", error);
      setUnsplashError(message);
      addToast(message);
    } finally {
      setIsLoadingUnsplash(false);
    }
  };

  const handleUnsplashSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await runUnsplashSearch(1);
  };

  // Search from recent searches
  const handleRecentSearchClick = async (query: string) => {
    setUnsplashQuery(query);
    setIsLoadingUnsplash(true);
    setUnsplashError(null);
    if (!isUnsplashConfigured()) {
      const message =
        "Unsplash search is disabled: add VITE_UNSPLASH_ACCESS_KEY to your environment.";
      setUnsplashError(message);
      addToast(message);
      setIsLoadingUnsplash(false);
      return;
    }
    try {
      const results = await searchSimilarImages(
        query,
        unsplashMeta.per_page,
        1,
        unsplashFilters.color,
        unsplashFilters.orientation
      );
      setUnsplashResults(results.results);
      setUnsplashMeta({
        total: results.total,
        total_pages: results.total_pages,
        page: 1,
        per_page: unsplashMeta.per_page,
      });

      // Move to top of recent searches
      addRecentSearch(query);
      setRecentSearches(getRecentSearches());
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unsplash search failed. Check API key or network.";
      console.error("Unsplash search failed:", error);
      setUnsplashError(message);
      addToast(message);
    } finally {
      setIsLoadingUnsplash(false);
    }
  };

  // Remove from recent searches
  const handleRemoveRecentSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  // Add Unsplash image to moodboard
  const handleAddUnsplashImage = async (image: UnsplashImage) => {
    try {
      // Track download (API compliance)
      await trackDownload(image);

      // Save to database via API
      await MoodboardAPI.createFromUnsplash(projectId, image);

      // Call parent callback if provided
      if (onAddUnsplashImage) {
        await onAddUnsplashImage(image);
      }

      // Show success toast
      addToast("Unsplash image added to moodboard successfully!");
    } catch (error) {
      console.error("Failed to add Unsplash image:", error);
      addToast("Failed to add Unsplash image. Please try again.");
    }
  };

  // Toggle favorite on uploaded items
  const handleToggleFavorite = async (
    itemId: string,
    currentValue: boolean
  ) => {
    const newValue = !currentValue;
    try {
      await MoodboardAPI.toggleFavorite(itemId, newValue);
      setFilteredItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isFavorite: newValue } : item
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="page-shell">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">
            Moodboard
          </h1>
          <p className="text-ink-secondary">
            Visual inspiration with AI semantic tagging and Unsplash discovery
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-border-subtle">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("uploads")}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === "uploads"
                  ? "text-primary border-b-2 border-primary"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
              aria-label="View uploaded images"
            >
              My Images ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("unsplash")}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === "unsplash"
                  ? "text-primary border-b-2 border-primary"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
              aria-label="Discover Unsplash images"
            >
              Discover
            </button>
          </div>
        </div>

        {/* Uploads Tab */}
        {activeTab === "uploads" && (
          <>
            {/* Search & Filters */}
            <div className="mb-8 space-y-6">
              <Input
                placeholder="Search visuals semantically... (e.g., 'melancholy summer' or 'cinematic blue hour')"
                icon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {allTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-ink-secondary uppercase tracking-wide mb-3">
                    Filter by Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-[24px] text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-white"
                            : "bg-subtle text-ink-secondary hover:bg-surface"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Masonry Grid */}
            {isSearching && (
              <p className="text-xs text-ink-tertiary mb-3">
                Searching visuals...
              </p>
            )}
            {filteredItems.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="mb-6 p-0 overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300 break-inside-avoid group"
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="relative">
                      <img
                        src={item.url}
                        alt={item.tags.join(", ") || "Moodboard item"}
                        className="w-full h-auto object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(
                            item.id,
                            item.isFavorite ?? false
                          );
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          size={18}
                          className={`transition-colors ${
                            item.isFavorite
                              ? "text-state-danger fill-current"
                              : "text-white"
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onItemDelete) onItemDelete(item.id);
                        }}
                        className="absolute top-2 left-2 p-2 rounded-full bg-state-danger hover:bg-state-danger/80 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete item"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>

                    <div className="p-4">
                      {item.colors.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {item.colors.slice(0, 3).map((color, i) => (
                            // eslint-disable-next-line react/forbid-component-props
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full shadow-lg border border-white/30"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                      <div className="space-y-2">
                        {item.moods.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.moods.map((mood) => (
                              <span
                                key={mood}
                                className="px-2 py-0.5 rounded-[12px] bg-primary-tint text-primary text-xs font-medium"
                              >
                                {mood}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.shotType && (
                          <p className="text-xs text-ink-tertiary">
                            Shot Type: <strong>{item.shotType}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Image size={48} className="mx-auto text-ink-tertiary mb-4" />
                <p className="text-ink-secondary">
                  {items.length === 0
                    ? "No mood board items yet. Upload images from the Project Dashboard or discover from Unsplash!"
                    : "No items match your search. Try different keywords."}
                </p>
              </Card>
            )}
          </>
        )}

        {/* Unsplash Tab */}
        {activeTab === "unsplash" && (
          <>
            {/* Unsplash Search */}
            <div className="mb-8">
              {!isUnsplashConfigured() && (
                <Card className="mb-4 bg-state-warning-bg border border-state-warning/30 text-state-warning">
                  <p className="text-sm font-medium">
                    Unsplash is not configured. Set <code>VITE_UNSPLASH_ACCESS_KEY</code> in your environment to enable search and downloads.
                  </p>
                </Card>
              )}
              <form onSubmit={handleUnsplashSearch} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search Unsplash... (e.g., 'mountain landscape', 'minimal architecture')"
                    icon={<Search size={18} />}
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    isLoading={isLoadingUnsplash}
                    disabled={
                      isLoadingUnsplash ||
                      !unsplashQuery.trim() ||
                      !isUnsplashConfigured()
                    }
                    className="min-w-[104px]"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* P1: Advanced Filters */}
              <div className="flex items-center gap-3 mb-4">
                <Filter size={16} className="text-ink-tertiary" />
                <Select
                  value={unsplashFilters.color || ""}
                  onChange={(e) =>
                    setUnsplashFilters({
                      ...unsplashFilters,
                      color: e.target.value || undefined,
                    })
                  }
                  options={UNSPLASH_COLOR_OPTIONS}
                  placeholder=""
                  size="sm"
                  variant="secondary"
                  className="min-w-[160px]"
                  aria-label="Filter Unsplash by color"
                />

                <Select
                  value={unsplashFilters.orientation || ""}
                  onChange={(e) =>
                    setUnsplashFilters({
                      ...unsplashFilters,
                      orientation: e.target.value || undefined,
                    })
                  }
                  options={UNSPLASH_ORIENTATION_OPTIONS}
                  placeholder=""
                  size="sm"
                  variant="secondary"
                  className="min-w-[160px]"
                  aria-label="Filter Unsplash by orientation"
                />

                {(unsplashFilters.color || unsplashFilters.orientation) && (
                  <button
                    onClick={() => setUnsplashFilters({})}
                    className="px-3 py-1.5 rounded-[12px] bg-state-danger/10 text-state-danger text-xs font-medium hover:bg-state-danger/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <p className="text-xs text-ink-tertiary mt-2">
                Photos from{" "}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Unsplash
                </a>
              </p>
              {unsplashError && (
                <p className="text-xs text-state-danger mt-2">{unsplashError}</p>
              )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 &&
              unsplashResults.length === 0 &&
              !isLoadingUnsplash && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-ink-tertiary" />
                    <h3 className="text-sm font-bold text-ink-secondary uppercase tracking-wide">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((query) => (
                      <button
                        key={query}
                        onClick={() => handleRecentSearchClick(query)}
                        className="group px-3 py-1.5 rounded-[24px] bg-subtle text-ink-secondary hover:bg-surface hover:text-ink-primary text-xs font-medium transition-all flex items-center gap-2"
                      >
                        <span>{query}</span>
                        <XCircle
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-state-danger"
                          onClick={(e) => handleRemoveRecentSearch(query, e)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Unsplash Results */}
            {isLoadingUnsplash && (
              <p className="text-xs text-ink-tertiary mb-3">
                Loading images from Unsplash...
              </p>
            )}

            {unsplashResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4 text-sm text-ink-secondary">
                  <span>
                    Page {unsplashMeta.page} of {unsplashMeta.total_pages} • {unsplashMeta.total} results
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => runUnsplashSearch(Math.max(1, unsplashMeta.page - 1))}
                      disabled={isLoadingUnsplash || unsplashMeta.page <= 1}
                      className="px-3 py-1.5 rounded-[12px] border border-border-subtle text-xs font-semibold disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() =>
                        runUnsplashSearch(
                          Math.min(unsplashMeta.total_pages || 1, unsplashMeta.page + 1)
                        )
                      }
                      disabled={
                        isLoadingUnsplash ||
                        !unsplashMeta.total_pages ||
                        unsplashMeta.page >= unsplashMeta.total_pages
                      }
                      className="px-3 py-1.5 rounded-[12px] border border-border-subtle text-xs font-semibold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                  {unsplashResults.map((image) => (
                    <div
                      key={image.id}
                      className="break-inside-avoid mb-6 group cursor-pointer"
                      onClick={() => setSelectedUnsplashImage(image.id)}
                    >
                      <div className="relative rounded-[24px] overflow-hidden shadow-ambient hover:shadow-float transition-all">
                        <img
                          src={image.urls.regular}
                          alt={
                            image.alt_description ||
                            image.description ||
                            "Unsplash image"
                          }
                          className="w-full h-auto object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                        />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-[24px] flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs mb-1 truncate">
                              Photo by{" "}
                              <a
                                href={image.user.links.html}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {image.user.name}
                              </a>
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddUnsplashImage(image);
                            }}
                            className="p-2 rounded-[12px] bg-primary/80 text-white hover:bg-primary transition-colors ml-2"
                            aria-label="Add to moodboard"
                            title="Add to moodboard"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Attribution */}
                      <div className="mt-2">
                        <p className="text-xs text-ink-tertiary">
                          by{" "}
                          <a
                            href={image.user.links.html}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-secondary hover:text-ink-primary hover:underline"
                          >
                            {image.user.name}
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : !isLoadingUnsplash && unsplashMeta.total_pages > 0 ? (
              <Card className="text-center py-12">
                <Search size={48} className="mx-auto text-ink-tertiary mb-4" />
                <p className="text-ink-secondary mb-2">
                  No results on this page. Try another page or new search.
                </p>
              </Card>
            ) : !isLoadingUnsplash ? (
              <Card className="text-center py-12">
                <Search size={48} className="mx-auto text-ink-tertiary mb-4" />
                <p className="text-ink-secondary mb-2">
                  {unsplashQuery
                    ? "No results found. Try a different search term."
                    : "Search for inspiring images from Unsplash"}
                </p>
                <p className="text-xs text-ink-tertiary">
                  Try searches like "modern workspace", "nature patterns", or
                  "urban photography"
                </p>
              </Card>
            ) : null}
          </>
        )}

        {/* Detail Modal for Uploaded Images */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <Card
              className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="float-right p-2 hover:bg-subtle rounded-[16px] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              {filteredItems.find((i) => i.id === selectedItem) && (
                <div>
                  <img
                    src={filteredItems.find((i) => i.id === selectedItem)?.url}
                    alt="Detail"
                    className="w-full rounded-[24px] mb-6"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-ink-primary mb-4">
                      Tags & Metadata
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-ink-secondary mb-2">
                          Visual Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {filteredItems
                            .find((i) => i.id === selectedItem)
                            ?.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-[12px] bg-primary-tint text-primary text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink-secondary mb-2">
                          Moods
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {filteredItems
                            .find((i) => i.id === selectedItem)
                            ?.moods.map((mood) => (
                              <span
                                key={mood}
                                className="px-3 py-1 rounded-[12px] bg-edge-teal/20 text-edge-teal text-xs font-medium"
                              >
                                {mood}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Detail Modal for Unsplash Images */}
        {selectedUnsplashImage && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedUnsplashImage(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setSelectedUnsplashImage(null)}
                className="float-right p-2 hover:bg-subtle rounded-[16px] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              {unsplashResults.find((i) => i.id === selectedUnsplashImage) && (
                <div>
                  <img
                    src={
                      unsplashResults.find(
                        (i) => i.id === selectedUnsplashImage
                      )?.urls.regular
                    }
                    alt={
                      unsplashResults.find(
                        (i) => i.id === selectedUnsplashImage
                      )?.alt_description || "Unsplash image"
                    }
                    className="w-full rounded-[24px] mb-6"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-ink-primary mb-2">
                      {unsplashResults.find(
                        (i) => i.id === selectedUnsplashImage
                      )?.description ||
                        unsplashResults.find(
                          (i) => i.id === selectedUnsplashImage
                        )?.alt_description ||
                        "Untitled"}
                    </h3>
                    <p className="text-sm text-ink-secondary mb-4">
                      Photo by{" "}
                      <a
                        href={
                          unsplashResults.find(
                            (i) => i.id === selectedUnsplashImage
                          )?.user.links.html
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {
                          unsplashResults.find(
                            (i) => i.id === selectedUnsplashImage
                          )?.user.name
                        }
                      </a>{" "}
                      on{" "}
                      <a
                        href="https://unsplash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Unsplash
                      </a>
                    </p>
                    <Button
                      onClick={() => {
                        const img = unsplashResults.find(
                          (i) => i.id === selectedUnsplashImage
                        );
                        if (img) {
                          handleAddUnsplashImage(img);
                          setSelectedUnsplashImage(null);
                        }
                      }}
                      variant="primary"
                      leftIcon={<Plus size={18} />}
                    >
                      Add to Moodboard
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moodboard;