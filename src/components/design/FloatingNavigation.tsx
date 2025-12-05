import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DGlassEffectContainer } from './DGlassEffectContainer';

interface FloatingNavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}

interface FloatingNavigationProps {
  items: FloatingNavItem[];
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  searchEnabled?: boolean;
  morphingEnabled?: boolean;
}

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  items,
  onSearch,
  placeholder = 'Search projects, talent, assets...',
  className = '',
  searchEnabled = true,
  morphingEnabled = true,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search when activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  // Detect scroll position and adjust compact mode
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsCompact(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchActive(false);
    onSearch?.('');
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  }, [handleClearSearch]);

  return (
    <div
      ref={containerRef}
      className={`
        fixed bottom-0 left-0 right-0 z-40
        md:bottom-auto md:right-6 md:w-auto
        transition-all duration-300 ease-out
        ${isCompact ? 'md:top-4' : 'md:top-6'}
        px-4 pb-6 md:pb-0
        ${className}
      `}
    >
      <DGlassEffectContainer
        glassEffectID="floating-nav"
        threshold={50}
        blurred
        morphingEnabled={morphingEnabled}
        className={`
          flex items-center gap-2 p-3
          rounded-[24px]
          border border-white/20
          shadow-xl
          ${isSearchActive ? 'w-full md:w-96' : 'w-full md:w-auto'}
          transition-all duration-300 ease-out
        `}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(1.8)',
        }}
      >
        {/* Search Bar */}
        {searchEnabled && (
          <div
            className={`
              flex items-center gap-2 flex-1
              transition-all duration-300
              ${isSearchActive ? 'order-first' : 'order-last'}
            `}
          >
            <Search
              size={18}
              className="text-ink-tertiary flex-shrink-0 transition-colors duration-200"
              strokeWidth={2}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                setIsFocused(true);
                setIsSearchActive(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                if (!searchQuery) {
                  setIsSearchActive(false);
                }
              }}
              onKeyDown={handleKeyDown}
              className={`
                flex-1 bg-transparent
                text-ink-primary text-sm
                placeholder:text-ink-tertiary
                outline-none border-none
                transition-all duration-200
                ${isSearchActive || isFocused ? 'w-full' : 'w-0'}
              `}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="text-ink-tertiary hover:text-ink-primary transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Navigation Items */}
        <div
          className={`
            flex items-center gap-1
            transition-all duration-300
            ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-xl
                text-ink-secondary hover:text-ink-primary
                hover:bg-subtle/50
                transition-all duration-200
                active:scale-95
                group
              `}
              title={item.label}
              aria-label={item.label}
            >
              <span className="text-ink-tertiary group-hover:text-ink-secondary transition-colors">
                {item.icon}
              </span>

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`
                    absolute -top-1 -right-1
                    bg-state-danger text-white
                    text-[10px] font-bold
                    w-5 h-5 rounded-full
                    flex items-center justify-center
                    shadow-md
                  `}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </DGlassEffectContainer>

      {/* Search Results Hint */}
      {isSearchActive && searchQuery && (
        <div
          className={`
            mt-3 text-xs text-ink-tertiary text-center
            animate-fadeIn opacity-0 animation-[fadeIn_0.3s_ease-out_forwards]
          `}
        >
          Press <kbd className="px-2 py-1 bg-subtle rounded text-ink-secondary">ESC</kbd> to close
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-[fadeIn_0.3s_ease-out_forwards] {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FloatingNavigation;
