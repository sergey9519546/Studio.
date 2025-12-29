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
    path: "/projects",
    category: "Create",
    keywords: ["campaign", "brief"],
  },
  {
    label: "New Freelancer",
    path: "/freelancers",
    category: "Create",
    keywords: ["roster", "freelancer"],
  },
  {
    label: "Add Moodboard Item",
    path: "/moodboard",
    category: "Create",
    keywords: ["moodboard", "visuals", "asset"],
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
    label: "Projects",
    path: "/projects",
    category: "Navigation",
    keywords: ["campaigns", "briefs"],
  },
  {
    label: "Moodboard",
    path: "/moodboard",
    category: "Navigation",
    keywords: ["inspiration", "moodboard", "assets"],
  },
  {
    label: "Freelancers",
    path: "/freelancers",
    category: "Navigation",
    keywords: ["freelancers", "roster", "talent"],
  },
  {
    label: "Writers Room",
    path: "/writers-room",
    category: "Navigation",
    keywords: ["ai", "chat", "creative"],
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
    if (!term) return NAV_COMMANDS;
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

  const renderResults = () =>
    isOpen && (
      <div
        className="command-results"
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
                className="w-full flex items-center justify-between text-left group focus:outline-none"
                onClick={() => handleNavigate(cmd.path)}
                role="option"
              >
                <div className="flex flex-col px-5 py-3">
                  <span className="text-sm font-black tracking-tight text-ink-primary group-hover:text-primary transition-colors">
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
      <div className="command-bar-desktop">
        <div className="command-bar-panel glass">
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full gap-4"
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
              className="bg-transparent border-none outline-none h-full w-full text-xs font-black tracking-[0.2em] text-ink-primary placeholder:text-ink-tertiary/40 uppercase focus:placeholder:opacity-0 transition-opacity"
              role="searchbox"
              aria-label="Search projects, assets, or run AI command"
              autoComplete="off"
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
          </form>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex text-[9px] font-black text-ink-tertiary bg-subtle px-2 py-1 rounded-md border border-border-subtle tracking-tighter opacity-40">
              CMD K
            </div>
            <button
              className="w-10 h-10 rounded-full bg-ink-primary text-ink-inverse flex items-center justify-center hover:scale-105 transition-all shadow-elevation focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
              aria-label="Create new item"
              type="button"
              title="Create new item (Ctrl+N)"
              onClick={() => setShowQuickCreate((prev) => !prev)}
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>

          {renderResults()}

          {showQuickCreate && (
            <div className="quick-create-panel">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink-tertiary mb-2 font-bold">
                Quick Create
              </p>
              <div className="flex flex-col gap-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleNavigate(action.path)}
                    className="px-3 py-2 rounded-lg hover:bg-subtle text-sm font-semibold text-ink-primary transition-colors text-left"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Command Bar */}
      <div className="command-bar-mobile">
        <div className="command-bar-panel glass">
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
              className="bg-transparent border-none outline-none h-full w-full text-xs font-black tracking-[0.2em] text-ink-primary placeholder:text-ink-tertiary/40 uppercase focus:placeholder:opacity-0 transition-opacity"
              role="searchbox"
              aria-label="Search or run command"
              autoComplete="off"
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
          </form>
          <button
            className="w-10 h-10 rounded-full bg-ink-primary text-ink-inverse flex items-center justify-center hover:scale-105 transition-all shadow-elevation focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1"
            aria-label="Create new item"
            type="button"
            title="Create new item"
            onClick={() => setShowQuickCreate((prev) => !prev)}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
          {renderResults()}
        </div>
      </div>
    </>
  );
};

export default CommandBar;
