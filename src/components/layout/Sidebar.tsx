import {
  BookOpen,
  FileText,
  Grid,
  Layers,
  Layout,
  Settings,
  Users,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const operations = [
    { id: "dashboard", icon: Layout, label: "Dashboard" },
    { id: "projects", icon: Layers, label: "Projects" },
    { id: "moodboard", icon: Grid, label: "Visuals" },
    { id: "roster", icon: Users, label: "Talent" },
    { id: "writers-room", icon: FileText, label: "Writer's Room" },
    { id: "knowledge-base", icon: BookOpen, label: "Knowledge Base" }, // Confluence integration
    { id: "transcripts", icon: FileText, label: "Transcripts" },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-72 flex flex-col py-8 bg-sidebar border-r border-border-subtle z-50">
      {/* Brand */}
      <div className="px-8 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-ink-primary rounded-xl flex items-center justify-center text-white shadow-xl">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-ink-primary" aria-hidden="true" />
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 space-y-2" aria-label="Main navigation">
        <div className="px-4 mb-2 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest opacity-60">
          Core Modules
        </div>
        {operations.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${activeTab === item.id ? "active" : ""}`}
            aria-label={`Navigate to ${item.label}`}
            aria-current={activeTab === item.id ? "page" : undefined}
            tabIndex={0}
          >
            <item.icon
              size={18}
              strokeWidth={activeTab === item.id ? 2.5 : 2}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User / Settings */}
      <div className="px-6 mt-auto pt-6 border-t border-border-subtle/50 flex flex-col gap-2">
        <button 
          className="nav-item w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-label="Open system configuration settings"
          tabIndex={0}
        >
          <Settings size={18} aria-hidden="true" />
          System Config
        </button>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-2xl border border-border-subtle bg-surface shadow-sm cursor-pointer hover:border-border-hover transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
              alt="Profile picture of Alex Director"
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
