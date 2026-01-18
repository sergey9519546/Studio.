import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share, Settings, Play, Pause, Scissors, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Timeline } from '../components/editor/Timeline';
import { InspectorSheet } from '../components/editor/InspectorSheet';

const FutureEditor: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'text' | null>(null);

  // Ergonomic Zones
  // Top: Impossible Zone (Admin)
  // Middle: Stretch Zone (Preview)
  // Bottom: Natural Zone (Timeline & Controls)

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">

      {/* IMPOSSIBLE ZONE (Top Bar) */}
      <header className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
           <button
             onClick={() => {
                 setSelectedType(null);
                 setIsInspectorOpen(true);
             }}
             className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
           >
            <Settings size={20} />
          </button>
          <button className="px-4 py-2 rounded-full bg-white text-black font-bold text-sm active:scale-95 transition-transform">
            Export
          </button>
        </div>
      </header>

      {/* STRETCH ZONE (Preview Area) */}
      <main className="absolute inset-0 pb-[35vh] flex items-center justify-center bg-zinc-950">
        <div className="relative w-full max-w-md aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
           {/* Placeholder for Video Canvas */}
           <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <span className="text-sm font-mono tracking-widest">PREVIEW CANVAS</span>
           </div>

           {/* Overlay Controls (Stretch Zone) */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Play/Pause Overlay indicator could go here */}
           </div>
        </div>
      </main>

      {/* NATURAL ZONE (Timeline & Tools) */}
      <section className="absolute bottom-0 left-0 right-0 h-[35vh] bg-zinc-900/90 backdrop-blur-xl border-t border-white/5 flex flex-col z-40 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">

        {/* Tool Bar (Floating above timeline) */}
        <div className="absolute -top-16 left-0 right-0 flex justify-center items-end pb-4 pointer-events-none">
          <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg pointer-events-auto transform translate-y-2">
            <button
                onClick={() => {
                    setSelectedType('video');
                    setIsInspectorOpen(true);
                }}
                className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all text-zinc-400 hover:text-white"
            >
              <Scissors size={24} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 rounded-full bg-white text-black active:scale-90 transition-all shadow-glow-white"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>

            <button className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all text-zinc-400 hover:text-white">
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 relative w-full overflow-hidden mt-2">
            <Timeline />

            {/* Playhead (Fixed Center) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-50 pointer-events-none transform -translate-x-1/2"></div>
        </div>

        {/* Bottom Navigation (if needed, or just padding) */}
        <div className="h-8 w-full flex justify-center items-center pb-2">
           <div className="w-32 h-1 bg-zinc-800 rounded-full"></div>
        </div>
      </section>

      <InspectorSheet
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        selectedType={selectedType}
      />
    </div>
  );
};

export default FutureEditor;
