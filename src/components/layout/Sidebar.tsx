import {
  BookOpen,
  FileText,
  Grid,
  Layers,
  Layout,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const operations = [
    { id: "dashboard", icon: Layout, label: "Atelier" },
    { id: "projects", icon: Layers, label: "Manifests" },
    { id: "pages", icon: FileText, label: "Pages" },
    { id: "studio", icon: Sparkles, label: "Studio AI" },
    { id: "moodboard", icon: Grid, label: "Visuals" },
    { id: "roster", icon: Users, label: "Talent" },
    { id: "writers-room", icon: FileText, label: "Writer's Room" },
    { id: "knowledge-base", icon: BookOpen, label: "Knowledge Base" }, // Confluence integration
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-72 flex flex-col py-8 bg-sidebar border-r border-border-subtle z-50">
      {/* Brand */}
      <div className="px-8 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-ink-primary rounded-xl flex items-center justify-center text-white shadow-xl">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-ink-primary" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-ink-primary">
            Studio.
          </h1>
          <p className="text-[10px] text-ink-tertiary font-medium tracking-widest uppercase">
            OS v3.0
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        <div className="px-4 mb-2 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest opacity-60">
          Core Modules
        </div>
        {operations.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item w-full ${activeTab === item.id ? "active" : ""}`}
          >
            <item.icon
              size={18}
              strokeWidth={activeTab === item.id ? 2.5 : 2}
            />
            {item.label}
          </button>
        ))}
      </div>

      {/* User / Settings */}
      <div className="px-6 mt-auto pt-6 border-t border-border-subtle/50 flex flex-col gap-2">
        <button className="nav-item w-full text-sm">
          <Settings size={18} />
          System Config
        </button>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-2xl border border-border-subtle bg-surface shadow-sm cursor-pointer hover:border-border-hover transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
              alt="User avatar"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-ink-primary truncate">
              Alex Director
            </div>
            <div className="text-[10px] text-ink-tertiary truncate">
              Online • Los Angeles
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
