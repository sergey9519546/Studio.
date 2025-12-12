import { Command, Plus } from "lucide-react";
import React from "react";

const CommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Searching for:", query);
      // TODO: Implement actual search functionality
    }
  };

  return (
    <>
      {/* Desktop Command Bar */}
      <div className="hidden md:block fixed bottom-8 left-72 right-0 flex justify-center z-[60] px-8 pointer-events-none">
        <div className="glass-bar pointer-events-auto w-full max-w-3xl h-16 rounded-pill flex items-center justify-between px-2 pr-3 shadow-lg hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="flex items-center pl-4 w-full gap-4">
            <Command size={18} className="text-ink-secondary" aria-hidden="true" />
            <label htmlFor="command-input" className="sr-only">
              Search manifests, assets, or run AI command
            </label>
            <input
              id="command-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manifests, assets, or run AI command..."
              className="bg-transparent border-none outline-none h-full w-full text-sm text-ink-primary placeholder:text-ink-secondary/70 font-medium focus:placeholder:text-ink-tertiary transition-colors"
              role="searchbox"
              aria-label="Search manifests, assets, or run AI command"
              autoComplete="off"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex text-[10px] font-bold text-ink-tertiary bg-subtle px-2 py-1 rounded-md border border-border-subtle">
              ⌘ K
            </div>
            <div className="h-6 w-[1px] bg-border-subtle mx-1" aria-hidden="true" />
            <button 
              className="w-10 h-10 rounded-full bg-ink-primary text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-ink-primary/90"
              aria-label="Create new item"
              type="button"
              title="Create new item (Ctrl+N)"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Command Bar - Positioned above mobile navigation to prevent overlap */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 flex justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md h-14 rounded-pill flex items-center justify-between px-3 pr-3 bg-surface/95 backdrop-blur-xl border border-border-subtle shadow-lg hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="flex items-center w-full gap-3">
            <Command size={16} className="text-ink-secondary" aria-hidden="true" />
            <label htmlFor="mobile-command-input" className="sr-only">
              Search or run command
            </label>
            <input
              id="mobile-command-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or command..."
              className="bg-transparent border-none outline-none h-full w-full text-sm text-ink-primary placeholder:text-ink-secondary/70 font-medium focus:placeholder:text-ink-tertiary transition-colors"
              role="searchbox"
              aria-label="Search or run command"
              autoComplete="off"
            />
          </form>
          <button 
            className="w-8 h-8 rounded-full bg-ink-primary text-white flex items-center justify-center hover:scale-105 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 hover:bg-ink-primary/90"
            aria-label="Create new item"
            type="button"
            title="Create new item"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CommandBar;
