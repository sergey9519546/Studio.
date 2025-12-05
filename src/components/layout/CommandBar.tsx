import React from 'react';
import { Command, Plus } from 'lucide-react';

const CommandBar: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-72 right-0 flex justify-center z-[60] px-8 pointer-events-none">
      <div className="glass-bar pointer-events-auto w-full max-w-3xl h-16 rounded-pill flex items-center justify-between px-2 pr-3">
        <div className="flex items-center pl-4 w-full gap-4">
          <Command size={18} className="text-[#86868B]" />
          <input 
            placeholder="Search manifests, assets, or run AI command..." 
            className="bg-transparent border-none outline-none h-full w-full text-sm text-[#1D1D1F] placeholder:text-[#86868B]/70 font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
           <div className="hidden md:flex text-[10px] font-bold text-gray-400 bg-gray-100/50 px-2 py-1 rounded-md border border-white/50">⌘ K</div>
           <div className="h-6 w-[1px] bg-gray-300/50 mx-1"/>
           <button className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/10">
             <Plus size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}

export default CommandBar;
