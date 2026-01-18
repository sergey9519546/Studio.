import React, { useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { PrecisionLoupe } from './PrecisionLoupe';

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isMagnetic, setIsMagnetic] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [scrubSpeed, setScrubSpeed] = useState(1);

  // Mock duration: 5 minutes (300 seconds)
  // Scale: 100px per second (for detailed view) -> 30000px total width
  const totalWidth = 30000;

  return (
    <div className="w-full h-full relative touch-none" ref={containerRef}>
        <PrecisionLoupe isVisible={isScrubbing} x={touchPos.x} y={touchPos.y} timecode="00:00:04:12" speed={scrubSpeed} />

        <motion.div
            className="absolute top-0 left-1/2 h-full flex items-start cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -totalWidth, right: 0 }}
            dragElastic={0.05}
            dragTransition={{ power: 0.2, timeConstant: 200 }} // Inertial physics
            onDragStart={(e, info) => {
              setIsScrubbing(true);
              setTouchPos({ x: info.point.x, y: info.point.y });
            }}
            onDrag={(e, info) => {
              setTouchPos({ x: info.point.x, y: info.point.y });
              const verticalDelta = Math.abs(info.offset.y);
              if (verticalDelta > 150) setScrubSpeed(0.1);
              else if (verticalDelta > 50) setScrubSpeed(0.5);
              else setScrubSpeed(1);
            }}
            onDragEnd={() => {
              setIsScrubbing(false);
              setScrubSpeed(1);
            }}
        >
            {/* Ruler / Ticks */}
            <div className="absolute top-0 h-6 flex pointer-events-none select-none">
                 {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-start w-[100px] border-l border-white/20 h-full relative">
                        <span className="text-[10px] text-zinc-500 ml-1 font-mono">{i}s</span>
                        {/* Subticks */}
                        <div className="absolute bottom-0 left-[25px] h-2 w-px bg-white/10"></div>
                        <div className="absolute bottom-0 left-[50px] h-3 w-px bg-white/10"></div>
                        <div className="absolute bottom-0 left-[75px] h-2 w-px bg-white/10"></div>
                    </div>
                 ))}
            </div>

            {/* Tracks Container */}
            <div className="mt-8 pl-4 pr-[50vw]">
                 {/* Video Track */}
                 <div className="h-16 flex items-center">
                    {/* Sample Clip 1 */}
                    <div className="h-full bg-zinc-800 rounded-lg overflow-hidden border border-white/10 flex items-center relative group" style={{ width: 500 }}>
                        <div className="absolute inset-0 flex space-x-0.5 opacity-30">
                             {/* Mock Thumbnails */}
                             {Array.from({ length: 10 }).map((_, k) => (
                                 <div key={k} className="flex-1 bg-zinc-600"></div>
                             ))}
                        </div>
                        <span className="relative z-10 ml-2 text-xs font-medium text-white shadow-black drop-shadow-md select-none">Video Clip 01</span>

                        {/* Clip Handles */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/10 hover:bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/10 hover:bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Sample Clip 2 */}
                    <div className="h-full bg-zinc-800 rounded-lg overflow-hidden border border-white/10 flex items-center relative ml-1 group" style={{ width: 350 }}>
                         <div className="absolute inset-0 flex space-x-0.5 opacity-30">
                             {Array.from({ length: 7 }).map((_, k) => (
                                 <div key={k} className="flex-1 bg-zinc-600"></div>
                             ))}
                        </div>
                         <span className="relative z-10 ml-2 text-xs font-medium text-white shadow-black drop-shadow-md select-none">Video Clip 02</span>
                         <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/10 hover:bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/10 hover:bg-white/30 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                 </div>

                 {/* Audio Track */}
                 <div className="h-10 flex items-center mt-4">
                      <div className="h-full bg-emerald-900/20 border border-emerald-500/30 rounded-lg w-[850px] flex items-center relative overflow-hidden">
                           <span className="relative z-10 ml-2 text-[10px] font-medium text-emerald-400 select-none">Background Music.mp3</span>
                           {/* Waveform Visualization (Mock) */}
                           <div className="absolute inset-0 flex items-center justify-between px-1 opacity-50">
                                {Array.from({ length: 100 }).map((_, i) => (
                                    <div key={i} className="w-1 bg-emerald-500/40 rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                                ))}
                           </div>
                      </div>
                 </div>
            </div>

        </motion.div>
    </div>
  );
};
