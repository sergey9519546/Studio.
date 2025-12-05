import React, { useMemo, useState } from 'react';
import { Search, Tag, Trash2 } from 'lucide-react';
import { DGlassEffectContainer } from './DGlassEffectContainer';
import { FluidButton } from './FluidButton';

interface MoodboardItem {
  id: string;
  src: string;
  alt: string;
  tags?: string[];
  title?: string;
  colors?: string[];
}

interface MoodboardContainerProps {
  items: MoodboardItem[];
  onItemClick?: (item: MoodboardItem) => void;
  onItemDelete?: (id: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
  columns?: number;
  morphingEnabled?: boolean;
  glassEffectID?: string;
}

export const MoodboardContainer: React.FC<MoodboardContainerProps> = ({
  items,
  onItemClick,
  onItemDelete,
  onSearch,
  className = '',
  columns = 3,
  morphingEnabled = true,
  glassEffectID = 'moodboard-container',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Extract unique tags from all items
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [items]);

  // Filter items based on search and tags
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTags =
        selectedTags.size === 0 ||
        item.tags?.some((tag) => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [items, searchQuery, selectedTags]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const handleItemDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this mood board item?')) {
      onItemDelete?.(id);
    }
  };

  // Calculate responsive columns
  const responsiveColumns = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`;

  return (
    <DGlassEffectContainer
      glassEffectID={glassEffectID}
      threshold={60}
      blurred
      morphingEnabled={morphingEnabled}
      className={`space-y-6 p-6 ${className}`}
    >
      {/* Search & Filter Header */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-ink-tertiary" />
          </div>
          <input
            type="text"
            placeholder="Search mood board by title, description, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`
              w-full pl-12 pr-4 py-3
              bg-surface border border-border-subtle
              rounded-2xl
              text-ink-primary placeholder:text-ink-tertiary
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/40
              focus:border-transparent
            `}
          />
        </div>

        {/* Tag Filter Chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full
                  transition-all duration-200
                  ${
                    selectedTags.has(tag)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-subtle/50 text-ink-secondary hover:bg-subtle border border-border-subtle'
                  }
                `}
              >
                <Tag size={12} className="inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredItems.length !== items.length && (
          <div className="text-xs text-ink-tertiary">
            Showing {filteredItems.length} of {items.length} items
          </div>
        )}
      </div>

      {/* Masonry Grid */}
      <div
        className={`
          grid ${responsiveColumns}
          gap-4 auto-rows-max
        `}
        style={{
          gridAutoFlow: 'dense',
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`
                group relative overflow-hidden rounded-2xl
                bg-surface border border-border-subtle
                cursor-pointer transition-all duration-300
                ${index % 5 === 0 ? 'md:row-span-2 md:col-span-2' : ''}
                hover:shadow-lg hover:-translate-y-1
                active:scale-95
              `}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              onClick={() => onItemClick?.(item)}
            >
              {/* Image Container */}
              <div className="relative w-full h-48 overflow-hidden bg-subtle">
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`
                    w-full h-full object-cover
                    transition-transform duration-500
                    ${hoveredItemId === item.id ? 'scale-110' : 'scale-100'}
                  `}
                />

                {/* Color Swatches */}
                {item.colors && item.colors.length > 0 && (
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {item.colors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded border border-white/30 shadow-md"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}

                {/* Overlay on Hover */}
                {hoveredItemId === item.id && (
                  <div
                    className={`
                      absolute inset-0 bg-black/40
                      backdrop-blur-sm
                      flex items-center justify-center gap-2
                      animate-fadeIn
                    `}
                  >
                    <div className="text-white text-sm font-medium">
                      View Details
                    </div>
                  </div>
                )}

                {/* Delete Button */}
                <button
                  onClick={(e) => handleItemDelete(e, item.id)}
                  className={`
                    absolute top-2 right-2
                    p-2 rounded-lg bg-state-danger/90 text-white
                    transition-all duration-200
                    opacity-0 group-hover:opacity-100
                    hover:bg-state-danger scale-75 group-hover:scale-100
                  `}
                  aria-label="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {item.title && (
                  <h3 className="font-semibold text-ink-primary text-sm mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[10px] text-ink-tertiary">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="text-ink-tertiary">
              <p className="mb-2">No mood board items found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </DGlassEffectContainer>
  );
};

export default MoodboardContainer;
