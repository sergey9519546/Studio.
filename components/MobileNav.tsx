import { Briefcase, Calendar, LayoutGrid, Sparkles, Users } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface MobileNavProps {
  className?: string;
}

/**
 * Mobile Bottom Navigation
 * Follows iOS/Android convention for primary navigation on mobile devices
 * Addresses Jakob's Law compliance for mobile UX
 * Fixed layout inconsistencies and improved accessibility
 */
export const MobileNav: React.FC<MobileNavProps> = ({ className = '' }) => {
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/', ariaLabel: 'Navigate to Dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/projects', ariaLabel: 'Navigate to Projects' },
    { icon: Sparkles, label: 'Studio', path: '/studio', ariaLabel: 'Navigate to Studio' },
    { icon: Users, label: 'Roster', path: '/freelancers', ariaLabel: 'Navigate to Freelancer Roster' },
    { icon: Calendar, label: 'Schedule', path: '/assignments', ariaLabel: 'Navigate to Schedule' },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[50] bg-surface/95 backdrop-blur-xl border-t border-border-subtle ${className}`}
      role="navigation"
      aria-label="Primary mobile navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2 safe-area-padding">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.ariaLabel}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg transition-all duration-200 min-w-[64px] min-h-[44px] relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                isActive
                  ? 'text-primary'
                  : 'text-ink-tertiary hover:text-ink-secondary active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-ink-tertiary'}`}
                  aria-hidden="true"
                />
                <span 
                  className={`text-[10px] font-medium tracking-tight ${
                    isActive ? 'text-primary' : 'text-ink-tertiary'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active indicator - fixed positioning issue */}
                {isActive && (
                  <div 
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
