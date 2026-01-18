import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data for the Living Grid
const MOCK_AURA_ITEMS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80', title: 'Neon Solitude', palette: ['#1a1a1a', '#ff0055', '#00ccff'], prompt: 'cyberpunk rainy street night' },
  { id: '2', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80', title: 'Velvet Horizon', palette: ['#2d2d2d', '#aa0000', '#ffaa00'], prompt: 'desert dunes sunset cinematic' },
  { id: '3', url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&q=80', title: 'Industrial Zen', palette: ['#333333', '#888888', '#ffffff'], prompt: 'concrete brutalism architecture plants' },
  { id: '4', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80', title: 'Azure Flow', palette: ['#001133', '#0066ff', '#88ccff'], prompt: 'waterfall long exposure blue' },
  { id: '5', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', title: 'Liquid Chrome', palette: ['#aaaaaa', '#ffffff', '#000000'], prompt: 'abstract liquid metal 3d render' },
  { id: '6', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80', title: 'Electric Dreams', palette: ['#220044', '#ff00ff', '#00ffff'], prompt: 'vaporwave aesthetic glitch art' },
  { id: '7', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80', title: 'Forest Whisper', palette: ['#003300', '#44aa44', '#ccffcc'], prompt: 'misty forest morning light' },
  { id: '8', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', title: 'Retro Terminal', palette: ['#000000', '#00ff00', '#333333'], prompt: 'vintage computer screen code' },
];

const Aura: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const selectedItem = MOCK_AURA_ITEMS.find(item => item.id === selectedId);

  const handleSuggestionClick = (text: string) => {
      setPrompt(text);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-hidden relative font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none z-0" />

      {/* The Living Grid */}
      <div className={`p-0 w-full min-h-screen transition-opacity duration-700 ${selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Subtle Header */}
        <div className="fixed top-0 left-0 p-8 z-10 opacity-0 hover:opacity-100 transition-opacity duration-500">
             <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40">Aura Engine</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-screen">
          {MOCK_AURA_ITEMS.map((item, index) => (
            <motion.div
              layoutId={`card-${item.id}`}
              key={item.id}
              className="relative aspect-[3/4] md:aspect-auto md:h-full group cursor-pointer overflow-hidden border-0 bg-black"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(item.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              {/* Image with Physics-based Hover (Spring) */}
              <motion.img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
                initial={{ filter: 'grayscale(20%)' }}
                whileHover={{
                    scale: 1.05,
                    filter: 'grayscale(0%)',
                    transition: { type: "spring", stiffness: 200, damping: 20 }
                }}
                /* Breathing Effect when not hovered */
                animate={{
                    scale: hoveredId === item.id ? 1.05 : [1, 1.02, 1],
                }}
                transition={{
                    scale: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 1.5
                    }
                }}
              />

              {/* Zero-Click Info (Ghost Overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 pointer-events-none">
                <motion.h3 className="text-xl font-light tracking-wide text-white mb-1" layoutId={`title-${item.id}`}>
                  {item.title}
                </motion.h3>
                <div className="flex gap-2 mb-2">
                    {item.palette.map(c => (
                        <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/50 line-clamp-1">
                  {item.prompt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Extrusion (Focus Mode) */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dimmed Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setSelectedId(null)}
            />

            {/* Expanded Image Container */}
            <motion.div
              layoutId={`card-${selectedId}`}
              className="relative w-full max-w-5xl aspect-video md:aspect-[21/9] bg-black shadow-2xl overflow-hidden z-50"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
               <motion.img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-20 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none">
                  <div className="pointer-events-auto">
                    <motion.h2
                        layoutId={`title-${selectedId}`}
                        className="text-4xl md:text-6xl font-extralight tracking-tight text-white mb-2"
                    >
                        {selectedItem.title}
                    </motion.h2>

                    <div className="flex items-center gap-4 text-white/40 text-xs font-mono tracking-widest uppercase mb-8">
                        <span>Ref: {selectedItem.id.padStart(3, '0')}</span>
                        <span>•</span>
                        <span>Source: Unsplash</span>
                    </div>

                    {/* The Oracle Chat */}
                    <div className="w-full max-w-xl relative group">
                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                        <div className="relative flex items-center gap-4 border-b border-white/20 pb-4 focus-within:border-white/60 transition-colors">
                            <Sparkles size={18} className="text-white/40 animate-pulse-subtle" />
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Type a command to alter reality..."
                                className="bg-transparent border-none outline-none text-lg text-white placeholder-white/20 w-full font-light"
                                autoFocus
                            />
                            <button className="text-white/40 hover:text-white transition-colors">
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="mt-2 flex gap-2">
                            {['make it darker', 'add fog', 'shift to blue'].map((suggestion) => (
                                <span
                                    key={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-[10px] text-white/20 hover:text-white/60 cursor-pointer transition-colors"
                                >
                                    {suggestion}
                                </span>
                            ))}
                        </div>
                    </div>
                  </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-50"
              >
                  <X size={32} strokeWidth={1} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Navigation Back - Quantum State (only visible on hover) */}
      <div className="fixed top-8 left-8 z-50 opacity-0 hover:opacity-100 transition-opacity duration-500">
         <button
            className="text-white/50 hover:text-white transition-colors mix-blend-difference"
            onClick={() => navigate('/')}
        >
            <ArrowLeft size={24} />
        </button>
      </div>

    </div>
  );
};

export default Aura;
