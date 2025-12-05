import React from 'react';
import {
  Layout,
  Layers,
  Sparkles,
  Grid,
  Users,
  FileText,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const operations = [
    { id: 'dashboard', icon: Layout, label: 'Atelier' },
    { id: 'projects', icon: Layers, label: 'Manifests' },
    { id: 'studio', icon: Sparkles, label: 'Studio AI' },
    { id: 'moodboard', icon: Grid, label: 'Visuals' },
    { id: 'roster', icon: Users, label: 'Talent' },
    { id: 'writers-room', icon: FileText, label: "Writer's Room" },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-72 flex flex-col py-8 bg-sidebar border-r border-subtle-alpha z-50">
      {/* Brand */}
      <div className="px-8 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#1D1D1F] rounded-[12px] flex items-center justify-center text-white shadow-xl">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-[#1D1D1F]" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-[#1D1D1F]">Studio.</h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">OS v3.0</p>
        </div>
      </div>
      
      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Core Modules</div>
        {operations.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {item.label}
            </button>
        ))}
      </div>

      {/* User / Settings */}
      <div className="px-6 mt-auto pt-6 border-t border-gray-100/50 flex flex-col gap-2">
        <button className="nav-item w-full text-sm">
          <Settings size={18} />
          System Config
        </button>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-[16px] border border-gray-100 bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
           <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
           </div>
           <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#1D1D1F] truncate">Alex Director</div>
              <div className="text-[10px] text-gray-400 truncate">Online • Los Angeles</div>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
