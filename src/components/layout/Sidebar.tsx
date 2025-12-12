import {
  Settings
} from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNavigationState } from "../../context/RouteContext";
import { getMainNavigationRoutes } from "../../routes";

interface SidebarProps {
  // No props needed anymore - router-driven
}

const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const { activeItem } = useNavigationState();
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
        className="px-8 mb-12 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
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
        {navigationRoutes.map((route) => {
          const IconComponent = route.icon;
          const isActive = activeItem === route.path.replace("/", "");
          
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive: navIsActive }) =>
                `nav-item w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-all duration-200 ${
                  navIsActive || isActive ? "active bg-primary/10 text-primary border-primary/20" : "hover:bg-subtle"
                }`
              }
              aria-label={`Navigate to ${route.label}`}
            >
              <IconComponent
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User / Settings */}
      <div className="px-6 mt-auto pt-6 border-t border-border-subtle/50 flex flex-col gap-2">
        <button 
          className="nav-item w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg hover:bg-subtle transition-colors"
          aria-label="Open system configuration settings"
          tabIndex={0}
          onClick={handleSettingsClick}
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
