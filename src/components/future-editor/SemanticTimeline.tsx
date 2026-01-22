import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  type: 'action' | 'dialogue' | 'laughter';
  start: number; // 0-100 percentage
  end: number;
  intensity: number; // 0-1
}

const mockEvents: TimelineEvent[] = [
  { type: 'action', start: 10, end: 25, intensity: 0.8 },
  { type: 'dialogue', start: 30, end: 45, intensity: 0.6 },
  { type: 'laughter', start: 50, end: 55, intensity: 0.9 },
  { type: 'action', start: 70, end: 85, intensity: 0.7 },
  { type: 'dialogue', start: 90, end: 95, intensity: 0.5 },
];

const typeColors = {
  action: 'from-red-500/0 via-red-500/50 to-red-500/0',
  dialogue: 'from-blue-500/0 via-blue-500/50 to-blue-500/0',
  laughter: 'from-yellow-500/0 via-yellow-500/50 to-yellow-500/0',
};

export function SemanticTimeline() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Haptic feedback function
  const triggerHaptic = (type: string) => {
    if (navigator.vibrate) {
      // Different patterns for different types
      if (type === 'action') navigator.vibrate([10, 10, 10]); // Rough
      if (type === 'dialogue') navigator.vibrate([20]); // Smooth bump
      if (type === 'laughter') navigator.vibrate([5, 5, 5, 5, 5]); // Bubbly
    }
  };

  const handleSeek = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const newProgress = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    setProgress(newProgress);

    // Check if we hit an event for haptics
    const hitEvent = mockEvents.find(ev => newProgress >= ev.start && newProgress <= ev.end);
    if (hitEvent) {
      triggerHaptic(hitEvent.type);
    }
  };

  const jumpToNextPeak = () => {
      const nextEvent = mockEvents.find(ev => ev.start > progress + 5);
      if (nextEvent) {
          setProgress(nextEvent.start + (nextEvent.end - nextEvent.start) / 2); // Center of event
          triggerHaptic(nextEvent.type);
      } else {
          setProgress(0); // Loop back
      }
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4">
       <div className="flex justify-between items-center text-white/50 text-xs uppercase tracking-widest font-bold">
            <span>Semantic Scrubbing</span>
            <div className="flex gap-4">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Action</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Dialogue</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"/> Laughter</span>
            </div>
       </div>

       {/* Timeline Track */}
       <div
         ref={containerRef}
         className="relative w-full h-16 bg-white/5 rounded-xl overflow-hidden cursor-col-resize group"
         onClick={handleSeek}
       >
          {/* Heatmap Layers */}
          {mockEvents.map((ev, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 bg-gradient-to-r ${typeColors[ev.type]} opacity-60`}
                style={{
                    left: `${ev.start}%`,
                    width: `${ev.end - ev.start}%`,
                }}
              />
          ))}

          {/* Playhead */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
            animate={{ left: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
             {/* Playhead Handle */}
             <div className="absolute top-0 -translate-x-1/2 w-4 h-4 bg-white rounded-b-lg" />
             <div className="absolute bottom-0 -translate-x-1/2 w-4 h-4 bg-white rounded-t-lg" />
          </motion.div>

          {/* Time text */}
          <div className="absolute top-2 left-4 text-white/30 text-xs font-mono">
              {mockEvents.find(ev => progress >= ev.start && progress <= ev.end) ?
                `DETECTED: ${mockEvents.find(ev => progress >= ev.start && progress <= ev.end)?.type.toUpperCase()}` :
                '00:00:00'
              }
          </div>
       </div>

       {/* Navigation Helper */}
       <div className="flex justify-center">
            <button
                onClick={jumpToNextPeak}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors"
            >
                Flick to Next Peak →
            </button>
       </div>
    </div>
  );
}
