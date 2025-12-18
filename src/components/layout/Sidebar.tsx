import { Settings } from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getMainNavigationRoutes } from "../../routes";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const navigationRoutes = getMainNavigationRoutes();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSettingsClick = () => {
    // Future: Open settings modal or navigate to settings page
    console.log("Settings clicked");
  };

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-72 flex flex-col py-8 bg-sidebar border-r border-border-subtle z-50">
      {/* Brand */}
      <div
        className="px-8 mt-4 mb-20 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleLogoClick();
          }
        }}
      >
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
          <div className="w-3 h-3 bg-white rounded-sm" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-black text-2xl tracking-tighter text-black leading-none">
            Studio.
          </h1>
          <p className="text-[9px] text-ink-tertiary font-black tracking-[0.3em] uppercase mt-1 opacity-40">
            System OS
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-6 space-y-2"
        aria-label="Main navigation"
      >
        <div className="nav-label">Core Modules</div>
        {navigationRoutes.map((route) => {
          const IconComponent = route.icon;

          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              aria-label={`Navigate to ${route.label}`}
            >
              <IconComponent size={18} strokeWidth={2} aria-hidden="true" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User / Settings */}
      <div className="px-6 mt-auto pt-10 flex flex-col gap-4">
        <button
          className="nav-item w-full text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          aria-label="Open system configuration settings"
          tabIndex={0}
          onClick={handleSettingsClick}
        >
          <Settings size={14} aria-hidden="true" />
          Config
        </button>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-subtle/50 cursor-pointer hover:bg-subtle transition-colors group">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
              alt="Profile picture of Alex Director"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-black text-black uppercase tracking-wider">
              Alex Director
            </div>
            <div className="text-[9px] text-ink-tertiary font-bold uppercase tracking-widest">
              Online
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
