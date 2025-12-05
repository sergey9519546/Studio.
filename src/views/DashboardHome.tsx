import React from 'react';
import { Bell, Brain, ImageIcon, Palette, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

const DashboardHome: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 pb-32 pt-12 px-12 max-w-[1600px] mx-auto">
       <header className="mb-12 flex justify-between items-end">
          <div>
             <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-bold uppercase tracking-widest text-gray-500 shadow-sm flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Studio Online
                </span>
             </div>
             <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-[#1D1D1F] mb-3 kinetic-text">Good Morning.</h1>
             <p className="text-[#86868B] text-xl font-light tracking-tight">The studio focus is nominal. <span className="text-[#1D1D1F] font-medium border-b border-gray-300 pb-0.5">2 deadlines approaching.</span></p>
          </div>
          <div className="flex gap-3">
             <button className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
                <Bell size={18}/>
             </button>
             <button className="h-10 px-5 rounded-full bg-[#1D1D1F] text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-shadow">
                New Project
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[640px]">
          {/* 1. Hero Focus (Large) */}
          <Card className="col-span-1 md:col-span-12 lg:col-span-6 relative overflow-hidden group border-0 shadow-2xl h-[400px] lg:h-full" noPadding>
             <img src="https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"/>
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">Priority One</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Nebula Phase II</h2>
                <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-md leading-relaxed">
                   Comprehensive rebrand focusing on kinetic typography and zero-gravity aesthetics. Client review in 4 hours.
                </p>
             </div>
          </Card>

          {/* Right Column Grid */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6 grid grid-cols-2 gap-6 h-full">
             
             {/* 2. Spark AI (Ideation) */}
             <Card className="col-span-2 md:col-span-1 flex flex-col justify-between bg-[#1D1D1F] text-white border-0 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"/>
                <div className="flex justify-between items-start z-10">
                   <div className="p-2.5 bg-white/10 rounded-[14px] backdrop-blur-sm"><Brain size={20} className="text-white"/></div>
                   <span className="text-[10px] font-mono text-white/40">AI v4.0</span>
                </div>
                <div className="z-10">
                   <h3 className="text-lg font-medium mb-4 leading-tight">Spark<br/>Creativity.</h3>
                   <div className="relative group/input">
                      <input placeholder="Concept prompt..." className="w-full bg-white/10 border border-white/5 rounded-[16px] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:bg-white/20 transition-all pr-10"/>
                      <button className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-lg transition-all"><ArrowRight size={14}/></button>
                   </div>
                </div>
             </Card>

             {/* 3. Vibe / Palette */}
             <Card className="col-span-2 md:col-span-1 flex flex-col relative overflow-hidden shadow-lg border-0 bg-white">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-lg font-bold text-[#1D1D1F]">Daily Vibe</h3>
                   <Palette size={20} className="text-gray-300"/>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                   <div className="flex gap-2 h-12">
                      {['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF'].map((c, i) => (
                         <div key={c} className="flex-1 rounded-full shadow-sm border border-black/5 hover:-translate-y-1 transition-transform cursor-pointer" style={{backgroundColor: c, transitionDelay: `${i*50}ms`}}/>
                      ))}
                   </div>
                   <span className="text-xs text-gray-400 font-mono text-center mt-2">PALETTE_NEON_04</span>
                </div>
             </Card>

             {/* 4. Artifacts (Visual History) */}
             <Card className="col-span-2 flex flex-col shadow-md border-gray-100/50 bg-white h-full">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B]">Recent Artifacts</h3>
                   <button className="text-xs font-bold text-[#1D1D1F] hover:opacity-70 transition-opacity">View Gallery</button>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                   {[1,2,3,4].map(i => (
                      <div key={i} className="rounded-[16px] bg-gray-50 border border-gray-100 relative group overflow-hidden cursor-pointer h-full min-h-[100px]">
                         <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
                            <ImageIcon size={24}/>
                         </div>
                         <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                         <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300 border border-gray-100 shadow-sm">
                            <div className="text-[10px] font-bold truncate text-[#1D1D1F]">Render_{i}.png</div>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>
          </div>
       </div>
    </div>
  )
}

export default DashboardHome;
