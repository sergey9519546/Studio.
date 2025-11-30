import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Calendar, Briefcase, Settings, Upload, LogOut, Layers, LayoutGrid, Sparkles, Palette } from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: Sparkles, label: 'Studio', path: '/studio' },
    { icon: Palette, label: 'Moodboard', path: '/moodboard' },
    { icon: Users, label: 'Roster', path: '/freelancers' },
    { icon: Calendar, label: 'Schedule', path: '/assignments' },
    { icon: Upload, label: 'Import', path: '/imports' },
  ];

  return (
    <div className="flex h-screen bg-app font-sans text-ink-primary overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Sidebar - Floating Porcelain Layer */}
      <aside className="w-72 flex-shrink-0 hidden md:flex flex-col h-full border-r border-border-subtle bg-surface/80 backdrop-blur-xl z-50 relative">
        <div className="h-24 flex flex-col justify-center px-8">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-ink-primary leading-none">Studio.</span>
                <span className="font-mono font-semibold text-[9px] text-ink-tertiary uppercase tracking-[0.2em] mt-1">Pro v.2.0</span>
            </div>
            <div className="relative w-9 h-9 bg-ink-primary text-white rounded-xl flex items-center justify-center shadow-card group-hover:shadow-glow transition-all duration-500 ease-out group-hover:-translate-y-0.5 flex-shrink-0">
                <div className="absolute inset-0 bg-rival-gradient opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm relative z-10"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4 text-[9px] font-bold text-ink-tertiary uppercase tracking-widest opacity-60">Operations</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-white shadow-card text-ink-primary ring-1 ring-black/5'
                    : 'text-ink-secondary hover:bg-subtle/60 hover:text-ink-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-ink-primary"></div>}
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-300 ${isActive ? 'text-ink-primary' : 'text-ink-tertiary group-hover:text-ink-primary'}`} />
                  <span className="relative z-10 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="p-6 mx-2 mb-2 border-t border-border-subtle/50 space-y-1">
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink-primary hover:bg-subtle/50 transition-all">
                <Settings size={18} strokeWidth={2} />
                System Config
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-secondary hover:text-state-danger hover:bg-state-danger-bg/30 transition-all">
                <LogOut size={18} strokeWidth={2} />
                Disconnect
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-surface/90 backdrop-blur-xl border-b border-border-subtle h-16 z-50 flex items-center px-6 justify-between">
         <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-ink-primary">Studio.</span>
            <div className="w-8 h-8 bg-ink-primary text-white rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
         </div>
         <button className="p-2 text-ink-tertiary"><Settings size={20}/></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="min-h-full pb-24 md:pb-12 pt-20 md:pt-0">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;