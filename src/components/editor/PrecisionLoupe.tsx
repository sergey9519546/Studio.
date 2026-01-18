import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrecisionLoupeProps {
  isVisible: boolean;
  x: number; // Screen X coordinate
  y: number; // Screen Y coordinate
  timecode: string;
  speed?: number;
}

export const PrecisionLoupe: React.FC<PrecisionLoupeProps> = ({ isVisible, x, y, timecode, speed = 1 }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -60 }} // Lift up above finger
          exit={{ opacity: 0, scale: 0.5, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed z-[60] pointer-events-none flex flex-col items-center ml-[-4rem]" // Center horizontally (width is 8rem/32 = 128px)
          style={{ left: x, top: y }}
        >
          <div className="w-32 h-32 rounded-full border-[3px] border-white bg-zinc-900 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative">
             <div className="absolute inset-0 flex items-center justify-center">
                 {/* Mock Content */}
                 <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 to-zinc-900">
                     <span className="opacity-50">LOUPE</span>
                 </div>

                 {/* Crosshair */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-8 bg-red-500 rounded-full"></div>
                 </div>
             </div>

             {/* Timecode Badge */}
             <div className="absolute bottom-3 left-0 right-0 text-center flex flex-col items-center gap-1">
                 {speed < 1 && (
                    <span className="bg-amber-500/90 text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm">
                        {speed === 0.1 ? 'FINE' : 'HALF'}
                    </span>
                 )}
                 <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white border border-white/10 shadow-sm">
                     {timecode}
                 </span>
             </div>
          </div>

          {/* Stem/Pointer (optional, sometimes just floating is better) */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
