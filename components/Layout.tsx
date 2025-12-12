import {
  Briefcase,
  Calendar,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Palette,
  Settings,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AIChat from "./AIChat";
import MobileNav from "./MobileNav";

const Layout: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", path: "/" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: Sparkles, label: "Studio", path: "/studio" },
    { icon: Palette, label: "Moodboard", path: "/moodboard" },
    { icon: Users, label: "Roster", path: "/freelancers" },
    { icon: Calendar, label: "Schedule", path: "/assignments" },
    { icon: Upload, label: "Import", path: "/imports" },
  ];

  return (
    <div className="flex h-screen bg-app font-sans text-ink-primary overflow-hidden selection:bg-primary selection:text-white">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        role="link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Sidebar - Floating Porcelain Layer */}
      <aside className="w-72 flex-shrink-0 hidden md:flex flex-col h-full border-r border-border-subtle bg-surface/95 backdrop-blur-md z-40 relative transition-all duration-300">
        <div className="h-24 flex flex-col justify-center px-6">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative w-8 h-8 bg-ink-primary text-white rounded-lg flex items-center justify-center shadow-card group-hover:shadow-glow transition-all duration-500 ease-out group-hover:-translate-y-0.5 flex-shrink-0">
              <div className="absolute inset-0 bg-rival-gradient opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-500"></div>
              <div className="w-2 h-2 bg-white rounded-full shadow-sm relative z-10"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-ink-primary leading-none">
                Studio.
              </span>
              <span className="font-mono font-medium text-[9px] text-ink-tertiary uppercase tracking-widest mt-0.5">
                Pro v.2.0
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4 text-xs font-semibold text-ink-tertiary uppercase tracking-wide opacity-60">
            Operations
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-ink-primary/5 text-ink-primary"
                    : "text-ink-secondary hover:bg-subtle/60 hover:text-ink-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-200 ${isActive ? "text-ink-primary" : "text-ink-tertiary group-hover:text-ink-primary"}`}
                  />
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="p-6 mx-2 mb-2 border-t border-border-subtle/50 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink-primary hover:bg-subtle/50 transition-all duration-200 active:scale-[0.98]">
            <Settings size={20} strokeWidth={2} />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:text-state-danger hover:bg-state-danger-bg/30 transition-all duration-200 active:scale-[0.98]">
            <LogOut size={20} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-surface/90 backdrop-blur-xl border-b border-border-subtle h-16 z-[60] flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg tracking-tight text-ink-primary">
            Studio.
          </span>
          <div className="w-8 h-8 bg-ink-primary text-white rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <button className="p-2 text-ink-tertiary">
          <Settings size={20} />
        </button>
      </div>

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth"
      >
        <div className="min-h-full pb-24 md:pb-12 pt-20 md:pt-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Action Button - Fixed dimensions to prevent CLS */}
      <div className="fixed bottom-8 right-8 z-[70] w-16 h-16">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-full h-full bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-all"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* AI Chat Window - Fixed dimensions to prevent CLS */}
      {isChatOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[600px] z-[80]">
          <AIChat
            freelancers={[]}
            projects={[]}
            assignments={[]}
            onCallAction={async (action, params) => {
              console.log("onCallAction", action, params);
              return { success: true };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Layout;
