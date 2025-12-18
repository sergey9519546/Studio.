import {
  BarChart3,
  Briefcase,
  Calendar,
  LayoutGrid,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

interface MobileNavProps {
  className?: string;
}

/**
 * Mobile Bottom Navigation
 * Follows iOS/Android convention for primary navigation on mobile devices
 * Addresses Jakob's Law compliance for mobile UX
 */
export const MobileNav: React.FC<MobileNavProps> = ({ className = "" }) => {
  const navItems = [
    {
      icon: LayoutGrid,
      label: "Dashboard",
      path: "/",
      ariaLabel: "Navigate to Dashboard",
    },
    {
      icon: Briefcase,
      label: "Projects",
      path: "/projects",
      ariaLabel: "Navigate to Projects",
    },
    {
      icon: BarChart3,
      label: "Intelligence",
      path: "/analysis",
      ariaLabel: "Navigate to Intelligence",
    },
    {
      icon: Users,
      label: "Talent",
      path: "/talent",
      ariaLabel: "Navigate to Talent Roster",
    },
    {
      icon: Calendar,
      label: "Schedule",
      path: "/assignments",
      ariaLabel: "Navigate to Schedule",
    },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-border-subtle safe-area-pb ${className}`}
      role="navigation"
      aria-label="Primary mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.ariaLabel}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] ${
                isActive
                  ? "text-ink-primary"
                  : "text-ink-tertiary hover:text-ink-secondary active:scale-95"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  strokeWidth={2}
                  className={`transition-colors ${isActive ? "text-ink-primary" : ""}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-black tracking-tight ${
                    isActive
                      ? "text-ink-primary"
                      : "text-ink-tertiary opacity-60"
                  }`}
                >
                  {item.label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* iOS safe area support */}
      <style>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </nav>
  );
};

export default MobileNav;
