import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface EditorObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

interface ObjectEditorProps {
  mode: 'edit' | 'magic' | 'layers'; // Mapped from parent tool
}

export function ObjectEditor({ mode }: ObjectEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [objects, _setObjects] = useState<EditorObject[]>([
    { id: 'obj1', x: 100, y: 100, width: 120, height: 180, color: 'bg-rose-500', label: 'Person A' },
    { id: 'obj2', x: 300, y: 200, width: 100, height: 100, color: 'bg-emerald-500', label: 'Prop B' },
  ]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMoveGlobal = (e: React.MouseEvent) => {
    if (mode === 'layers' && containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        mouseX.set(x);
        mouseY.set(y);
    }
  };

  // Motion Brush Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'magic') {
      setIsDrawing(true);
      const { left, top } = svgRef.current!.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setCurrentPath(`M ${x} ${y}`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMouseMoveGlobal(e);
    if (mode === 'magic' && isDrawing) {
      const { left, top } = svgRef.current!.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setCurrentPath((prev) => `${prev} L ${x} ${y}`);
    }
  };

  const handleMouseUp = () => {
    if (mode === 'magic' && isDrawing) {
      setIsDrawing(false);
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath('');
    }
  };

  return (
    <div className="relative w-full h-full perspective-1000" style={{ perspective: '1000px' }}>
      <motion.div
        ref={containerRef}
        className="relative w-full h-full bg-neutral-900 rounded-3xl shadow-2xl border border-white/10 group overflow-hidden"
        style={mode === 'layers' ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
        onMouseMove={handleMouseMove}
      >
        {/* Video Preview Mockup - Background Layer */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-50"
            style={mode === 'layers' ? { translateZ: -50 } : {}}
        />
        <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={mode === 'layers' ? { translateZ: -20 } : {}}
        >
            <span className="text-white/5 text-9xl font-bold uppercase tracking-widest">Video</span>
        </motion.div>

        {/* Interactive Objects Layer */}
        {(mode === 'edit' || mode === 'layers') && (
            <div className="absolute inset-0" style={mode === 'layers' ? { transformStyle: 'preserve-3d' } : {}}>
            {objects.map((obj, i) => (
                <motion.div
                key={obj.id}
                drag={mode === 'edit'}
                dragMomentum={false}
                whileHover={mode === 'edit' ? { scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" } : {}}
                whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
                className={`absolute ${obj.color}/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xs border border-white/20 ${mode === 'edit' ? 'cursor-grab' : ''}`}
                style={{
                    width: obj.width,
                    height: obj.height,
                    left: obj.x,
                    top: obj.y,
                    translateZ: mode === 'layers' ? (i + 1) * 50 : 0, // Stagger depth
                }}
                >
                {obj.label}
                {/* Inpainting indicator */}
                {mode === 'edit' && (
                    <motion.div
                        className="absolute -inset-4 border-2 border-white/0 rounded-xl"
                        whileDrag={{ borderColor: "rgba(255,255,255,0.5)", borderStyle: "dashed" }}
                    />
                )}
                {/* Depth Indicator Line */}
                {mode === 'layers' && (
                    <div className="absolute top-1/2 left-1/2 w-0 h-[100px] border-l border-white/30 border-dashed -translate-x-1/2 -translate-y-1/2 -z-10 origin-top rotate-x-90" />
                )}
                </motion.div>
            ))}

            {mode === 'edit' && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/70 text-sm">
                <span className="text-white font-semibold">Tap & Drag</span> to move objects. Background inpaints automatically.
                </div>
            )}
            </div>
        )}

      {/* Motion Brush Layer */}
      {mode === 'magic' && (
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg ref={svgRef} className="w-full h-full pointer-events-none">
            {paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                 {/* Simulate "Flow" animation on the stroke */}
                 <animate
                    attributeName="stroke-dasharray"
                    values="0,100;100,0"
                    dur="3s"
                    repeatCount="indefinite"
                 />
              </motion.path>
            ))}
            {currentPath && (
              <path
                d={currentPath}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>
           <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/70 text-sm pointer-events-none">
            <span className="text-white font-semibold">Motion Brush:</span> Paint to animate static areas.
          </div>
        </div>
      )}

      {/* 3D Depth Layer Overlay Info */}
      {mode === 'layers' && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/70 text-sm z-50 pointer-events-none" style={{ transform: 'translateZ(100px)' }}>
            <span className="text-white font-semibold">Spatial Depth:</span> Move mouse to inspect Z-Axis layers.
        </div>
      )}

      </motion.div>
    </div>
  );
}
