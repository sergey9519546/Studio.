import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodboardItem } from '../../services/types';

interface InfinityTableProps {
  items: MoodboardItem[];
  onItemUpdate?: (id: string, metadata: any) => void;
}

// Helper to calculate smart stack position
// Moved outside component to avoid "impure function" linting errors
const calculateSmartStackPosition = (
  currentX: number,
  currentY: number,
  id: string,
  allItems: any[]
): { x: number; y: number } | null => {
  const STACK_THRESHOLD = 50; // pixels

  for (const otherItem of allItems) {
    if (otherItem.id === id) continue;

    const dist = Math.sqrt(
      Math.pow(currentX - otherItem._x, 2) + Math.pow(currentY - otherItem._y, 2)
    );

    if (dist < STACK_THRESHOLD) {
      // Snap to the target item's position
      let newX = otherItem._x;
      let newY = otherItem._y;

      // Add a tiny random offset to make it look like a natural pile
      // Using a pseudo-random seed based on ID or time to be slightly more deterministic if needed,
      // but Math.random() is fine here as this is an event handler helper.
      newX += (Math.random() - 0.5) * 10;
      newY += (Math.random() - 0.5) * 10;

      return { x: newX, y: newY };
    }
  }
  return null;
};

export const InfinityTable: React.FC<InfinityTableProps> = ({ items, onItemUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Local state for optimistic updates
  const [localItems, setLocalItems] = useState<MoodboardItem[]>(items);

  // Sync props to state when items change externally
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Initial layout calculation (memoized to prevent jumps on re-renders unless items change)
  const positionedItems = useMemo(() => {
    return localItems.map((item, index) => {
      const x = item.metadata?.x ?? 100 + (index % 3) * 350;
      const y = item.metadata?.y ?? 100 + Math.floor(index / 3) * 450;
      return { ...item, _x: x, _y: y };
    });
  }, [localItems]);

  const handleDragEnd = (id: string, info: any) => {
    const item = positionedItems.find(i => i.id === id);
    if (!item) return;

    // Calculate new position
    // info.point is global, but we are dragging relative to parent.
    // Framer motion 'drag' on a motion.div modifies the transform style.
    // However, since we are rendering using absolute positioning with `left/top` props in the initial render,
    // we need to be careful.

    // Better approach: Let Framer handle the visual drag.
    // On drag end, we read the *actual* position from the DOM element or rely on the offset.
    // But `info.offset` gives the delta.

    const currentX = item._x;
    const currentY = item._y;
    const deltaX = info.offset.x;
    const deltaY = info.offset.y;

    let newX = currentX + deltaX;
    let newY = currentY + deltaY;

    // Magnetic Snapping (20px Grid)
    newX = Math.round(newX / 20) * 20;
    newY = Math.round(newY / 20) * 20;

    // Smart Stacks: Check for overlap with other items
    const stackPos = calculateSmartStackPosition(newX, newY, id, positionedItems);
    if (stackPos) {
      newX = stackPos.x;
      newY = stackPos.y;
    }

    // Update local state
    const updatedItems = localItems.map(i => {
      if (i.id === id) {
        return {
          ...i,
          metadata: {
            ...i.metadata,
            x: newX,
            y: newY
          }
        };
      }
      return i;
    });
    setLocalItems(updatedItems);

    // Persist
    if (onItemUpdate) {
      onItemUpdate(id, { x: newX, y: newY });
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-app relative"
    >
      {/* The Infinite Canvas Surface */}
      <motion.div
        className="absolute top-0 left-0 w-[5000px] h-[5000px] origin-top-left touch-none"
        drag
        dragConstraints={{ left: -4000, top: -4000, right: 0, bottom: 0 }}
        dragElastic={0.1}
      >
        {/* Grid Background Pattern */}
        <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}
        />

        {/* Items */}
        {positionedItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute w-[300px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-border-subtle group hover:ring-2 hover:ring-primary/50 transition-shadow cursor-move"
            style={{
              x: item._x, // Use x/y transform instead of left/top for better performance and Framer Motion compatibility
              y: item._y,
            }}
            drag
            dragMomentum={false}
            // Stop propagation to prevent canvas panning when dragging item
            onPointerDown={(e) => e.stopPropagation()}
            onDragEnd={(e, info) => handleDragEnd(item.id, info)}
            whileDrag={{ scale: 1.05, zIndex: 50, shadow: "0px 20px 40px rgba(0,0,0,0.2)" }}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-subtle pointer-events-none">
              <img
                src={item.url}
                alt={item.title || "Moodboard Item"}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>

            {/* Content */}
            <div className="p-4 bg-surface backdrop-blur-sm pointer-events-none">
                <h3 className="font-bold text-sm text-ink-primary truncate">
                    {item.title || "Untitled"}
                </h3>
                {item.moods && item.moods.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {item.moods.slice(0, 3).map(mood => (
                            <span key={mood} className="text-[10px] px-1.5 py-0.5 bg-subtle rounded-full text-ink-secondary">
                                {mood}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Visual Snap Guide (simulated) */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors" />
          </motion.div>
        ))}
      </motion.div>

      {/* Helper UI */}
      <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/80 backdrop-blur text-white text-xs rounded-full pointer-events-none select-none z-50">
        Infinity Table • Drag items to organize • Drag background to pan
      </div>
    </div>
  );
};
