import { Image, Search, Trash2, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Card } from "./design/Card";
import { Input } from "./design/Input";

interface MoodboardItem {
  id: string;
  url: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  uploadedAt: string;
}

interface MoodboardProps {
  projectId: string;
  projectTitle?: string;
  items?: MoodboardItem[];
  onItemDelete?: (id: string) => void;
  onSemanticSearch?: (query: string) => Promise<MoodboardItem[]>;
}

export const Moodboard: React.FC<MoodboardProps> = ({
  projectId,
  projectTitle = "Untitled Project",
  items = [],
  onItemDelete,
  onSemanticSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    // Keep filtered items in sync with upstream changes
    setFilteredItems(items);
  }, [items]);

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
    if (query.trim()) {
      setIsSearching(true);
      try {
        const results = (await onSemanticSearch?.(query)) || items;
        setFilteredItems(results);
      } finally {
        setIsSearching(false);
      }
    } else {
      filterItems(query, selectedTags);
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    filterItems(searchQuery, newTags);
  };

  const filterItems = (query: string, tags: string[]) => {
    let results = items;

    if (tags.length > 0) {
      results = results.filter((item) =>
        tags.some((tag) => item.tags.includes(tag) || item.moods.includes(tag))
      );
    }

    setFilteredItems(results);
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">
            Moodboard
          </h1>
          <p className="text-ink-secondary">
            Visual inspiration with AI semantic tagging
          </p>
        </div>

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
          <p className="text-xs text-ink-tertiary mb-3">Searching visuals...</p>
        )}
        {filteredItems.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-6 group cursor-pointer"
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="relative rounded-[24px] overflow-hidden shadow-ambient hover:shadow-float transition-all">
                  <img
                    src={item.url}
                    alt="Moodboard"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-[24px] flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
                    <div>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-[12px] bg-white/20 backdrop-blur text-white text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemDelete?.(item.id);
                      }}
                      className="p-2 rounded-[12px] bg-state-danger/80 text-white hover:bg-state-danger transition-colors"
                      aria-label="Delete image from moodboard"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Color Palette Indicator */}
                  {item.colors.length > 0 && (
                    <div className="absolute top-4 right-4 flex gap-1">
                      {item.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full shadow-lg border border-white/30"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="mt-3 space-y-2">
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
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Image size={48} className="mx-auto text-ink-tertiary mb-4" />
            <p className="text-ink-secondary">
              {items.length === 0
                ? "No mood board items yet. Upload images from the Project Dashboard!"
                : "No items match your search. Try different keywords."}
            </p>
          </Card>
        )}

        {/* Detail Modal (simplified) */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setSelectedItem(null)}
                className="float-right p-2 hover:bg-subtle rounded-[16px] transition-colors"
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
      </div>
    </div>
  );
};

export default Moodboard;
