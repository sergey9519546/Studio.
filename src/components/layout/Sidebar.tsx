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
    console.log("Settings clicked");
  };

  return (
    <nav className="app-sidebar" aria-label="Primary navigation">
      {/* Brand */}
      <div
        className="app-logo"
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
        <div className="w-10 h-10 rounded-2xl bg-ink-primary flex items-center justify-center text-ink-inverse shadow-lg">
          <div className="w-3 h-3 bg-ink-inverse rounded-sm" aria-hidden="true" />
        </div>
        <div>
          <h1>Studio.</h1>
          <p>System OS</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="app-nav" aria-label="Core Modules">
        <span className="app-nav-group-label">Core Modules</span>
        {navigationRoutes.map((route) => {
          const IconComponent = route.icon;

          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `app-nav-link ${isActive ? "active" : ""}`
              }
              aria-label={`Navigate to ${route.label}`}
            >
              <IconComponent size={18} strokeWidth={2} aria-hidden="true" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User / Settings */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="app-nav-link text-xs uppercase tracking-[0.3em] opacity-60"
          aria-label="Open system configuration settings"
          onClick={handleSettingsClick}
        >
          <Settings size={16} aria-hidden="true" />
          Config
        </button>
        <div className="sidebar-profile">
          <div className="w-12 h-12 overflow-hidden rounded-full bg-subtle shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              className="w-full h-full object-cover"
              alt="Profile picture of Alex Director"
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-ink-primary">
              Alex Director
            </p>
            <p className="status">Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
