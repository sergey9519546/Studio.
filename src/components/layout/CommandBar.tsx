import { ArrowRight, Command, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useInRouterContext, useNavigate } from "react-router-dom";

type CommandItem = {
  label: string;
  path: string;
  category: string;
  keywords?: string[];
};

const QUICK_ACTIONS: CommandItem[] = [
  {
    label: "New Project",
    path: "/projects/new",
    category: "Create",
    keywords: ["campaign", "brief"],
  },
  {
    label: "New Talent Profile",
    path: "/talent/new",
    category: "Create",
    keywords: ["roster", "freelancer"],
  },
  {
    label: "New Transcript",
    path: "/transcripts/new",
    category: "Create",
    keywords: ["meeting", "call"],
  },
];

const NAV_COMMANDS: CommandItem[] = [
  {
    label: "Dashboard",
    path: "/",
    category: "Navigation",
    keywords: ["home", "overview"],
  },
  {
    label: "Intelligence",
    path: "/analysis",
    category: "Navigation",
    keywords: ["ai", "reports", "workload", "economics"],
  },
  {
    label: "Projects",
    path: "/projects",
    category: "Navigation",
    keywords: ["campaigns", "briefs"],
  },
  {
    label: "Visuals",
    path: "/moodboard",
    category: "Navigation",
    keywords: ["inspiration", "moodboard", "assets"],
  },
  {
    label: "Talent",
    path: "/talent",
    category: "Navigation",
    keywords: ["freelancers", "roster", "talent"],
  },
  {
    label: "Writer's Room",
    path: "/writers-room",
    category: "Navigation",
    keywords: ["ai", "chat", "creative"],
  },
  {
    label: "Knowledge Base",
    path: "/knowledge-base",
    category: "Navigation",
    keywords: ["docs", "wiki", "confluence"],
  },
  {
    label: "Transcripts",
    path: "/transcripts",
    category: "Navigation",
    keywords: ["calls", "meetings"],
  },
];

const CommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [query, setQuery] = useState("");
  const inRouter = useInRouterContext();
  const navigate = useNavigate();

  const commands = useMemo(() => [...QUICK_ACTIONS, ...NAV_COMMANDS], []);

  const filteredCommands = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return NAV_COMMANDS.slice(0, 4);
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(term) ||
        cmd.keywords?.some((k) => k.toLowerCase().includes(term))
    );
  }, [commands, query]);

  const handleNavigate = (path: string) => {
    if (path === "#") return;
    if (inRouter) {
      navigate(path);
    } else {
      window.location.href = path;
    }
    setIsOpen(false);
    setShowQuickCreate(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const renderResults = (isMobile = false) =>
    isOpen && (
      <div
        className={`absolute ${isMobile ? "bottom-36 left-4 right-4" : "bottom-20 left-0 right-0 mx-auto max-w-3xl"} bg-surface border border-border-subtle/50 shadow-elevation rounded-2xl overflow-hidden z-[65] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300`}
        role="listbox"
        aria-label="Command palette results"
      >
        {filteredCommands.length === 0 ? (
          <div className="px-6 py-4 text-xs font-black uppercase tracking-widest text-ink-tertiary opacity-40">
            No matches found.
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.label}
                className="w-full flex items-center justify-between text-left px-6 py-4 hover:bg-subtle transition-colors group focus:outline-none focus:bg-subtle"
                onClick={() => handleNavigate(cmd.path)}
                role="option"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-black text-black tracking-tight group-hover:translate-x-1 transition-transform">
                    {cmd.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-black text-ink-tertiary opacity-40 mt-1">
                    {cmd.category}
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  className="text-ink-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <>
      {/* Desktop Command Bar */}
      <div className="hidden md:flex fixed bottom-8 left-72 right-0 justify-center z-[60] px-8 pointer-events-none">
        <div className="glass-bar pointer-events-auto w-full max-w-3xl h-16 rounded-pill flex items-center justify-between px-2 pr-3 shadow-lg hover:shadow-xl transition-shadow relative">
          <form
            onSubmit={handleSubmit}
            className="flex items-center pl-4 w-full gap-4"
          >
            <Command
              size={18}
              className="text-ink-secondary"
              aria-hidden="true"
            />
            <label htmlFor="command-input" className="sr-only">
              Search projects, assets, or run AI command
            </label>
            <input
              id="command-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder="INTENT SEARCH..."
              className="bg-transparent border-none outline-none h-full w-full text-xs font-black tracking-[0.2em] text-black placeholder:text-ink-tertiary/40 uppercase focus:placeholder:opacity-0 transition-opacity"
              role="searchbox"
              aria-label="Search projects, assets, or run AI command"
              autoComplete="off"
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
          </form>

          <div className="flex items-center gap-4 shrink-0 px-2">
            <div className="hidden lg:flex text-[9px] font-black text-ink-tertiary bg-subtle px-2 py-1 rounded-md border border-border-subtle tracking-tighter opacity-40">
              CMD K
            </div>
            <button
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all shadow-elevation focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label="Create new item"
              type="button"
              title="Create new item (Ctrl+N)"
              onClick={() => setShowQuickCreate((prev) => !prev)}
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
          {renderResults(false)}

          {showQuickCreate && (
            <div className="absolute bottom-20 right-6 w-64 bg-surface border border-border-subtle rounded-xl shadow-xl p-3 z-[66]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink-tertiary mb-2 font-bold">
                Quick Create
              </p>
              <div className="flex flex-col gap-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleNavigate(action.path)}
                    className="px-3 py-2 rounded-lg hover:bg-subtle text-sm font-semibold text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Command Bar - Positioned above mobile navigation to prevent overlap */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 flex justify-center z-[60] pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md h-14 rounded-pill flex items-center justify-between px-3 pr-3 bg-surface/95 backdrop-blur-xl border border-border-subtle shadow-lg hover:shadow-xl transition-shadow relative">
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full gap-3"
          >
            <Command
              size={16}
              className="text-ink-secondary"
              aria-hidden="true"
            />
            <label htmlFor="mobile-command-input" className="sr-only">
              Search or run command
            </label>
            <input
              id="mobile-command-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder="INTENT SEARCH..."
              className="bg-transparent border-none outline-none h-full w-full text-xs font-black tracking-[0.2em] text-black placeholder:text-ink-tertiary/40 uppercase focus:placeholder:opacity-0 transition-opacity"
              role="searchbox"
              aria-label="Search or run command"
              autoComplete="off"
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
          </form>
          <button
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all shadow-elevation focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            aria-label="Create new item"
            type="button"
            title="Create new item"
            onClick={() => setShowQuickCreate((prev) => !prev)}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
          {renderResults(true)}
        </div>
      </div>
    </>
  );
};

export default CommandBar;
