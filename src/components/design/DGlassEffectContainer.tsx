import React, { useEffect, useRef, useState } from 'react';

interface DGlassEffectContainerProps {
  children: React.ReactNode;
  glassEffectID?: string;
  threshold?: number;
  className?: string;
  blurred?: boolean;
  morphingEnabled?: boolean;
  onMorphStateChange?: (isMorphed: boolean) => void;
}

interface ChildRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLElement;
}

const calculateDistance = (rect1: ChildRect, rect2: ChildRect): number => {
  const centerX1 = rect1.x + rect1.width / 2;
  const centerY1 = rect1.y + rect1.height / 2;
  const centerX2 = rect2.x + rect2.width / 2;
  const centerY2 = rect2.y + rect2.height / 2;
  
  return Math.hypot(centerX2 - centerX1, centerY2 - centerY1);
};

export const DGlassEffectContainer: React.FC<DGlassEffectContainerProps> = ({
  children,
  glassEffectID = `glass-${Date.now()}`,
  threshold = 40,
  className = '',
  blurred = true,
  morphingEnabled = true,
  onMorphStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRefsMap = useRef<Map<string, HTMLElement>>(new Map());
  const [isMorphed, setIsMorphed] = useState(false);
  const [morphStyle, setMorphStyle] = useState<React.CSSProperties>({});
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!morphingEnabled || !containerRef.current) return;

    const updateMorphing = () => {
      const children = containerRef.current?.children || [];
      const childRects: ChildRect[] = [];

      Array.from(children).forEach((child, index) => {
        const element = child as HTMLElement;
        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          childRects.push({
            id: `child-${index}`,
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height,
            element,
          });
        }
      });

      // Check if any children are within threshold distance
      let shouldMorph = false;
      let morphedIndices: number[] = [];

      for (let i = 0; i < childRects.length; i++) {
        for (let j = i + 1; j < childRects.length; j++) {
          const distance = calculateDistance(childRects[i], childRects[j]);
          if (distance < threshold) {
            shouldMorph = true;
            morphedIndices = [i, j];
            break;
          }
        }
        if (shouldMorph) break;
      }

      if (shouldMorph && morphedIndices.length === 2) {
        const rect1 = childRects[morphedIndices[0]];
        const rect2 = childRects[morphedIndices[1]];

        // Calculate merged bounding box with padding
        const padding = 8;
        const minX = Math.min(rect1.x, rect2.x) - padding;
        const minY = Math.min(rect1.y, rect2.y) - padding;
        const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width) + padding;
        const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height) + padding;

        const mergedWidth = maxX - minX;
        const mergedHeight = maxY - minY;
        const borderRadius = mergedHeight / 2; // Capsule shape

        setMorphStyle({
          position: 'absolute',
          left: minX,
          top: minY,
          width: mergedWidth,
          height: mergedHeight,
          borderRadius,
          pointerEvents: 'none',
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        });

        // Make morphed children hide temporarily
        rect1.element.style.opacity = '0.7';
        rect2.element.style.opacity = '0.7';

        setIsMorphed(true);
        onMorphStateChange?.(true);
      } else {
        // Reset morphed children
        childRects.forEach((rect) => {
          rect.element.style.opacity = '1';
        });

        if (isMorphed) {
          setIsMorphed(false);
          onMorphStateChange?.(false);
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateMorphing);
    };

    animationFrameRef.current = requestAnimationFrame(updateMorphing);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [morphingEnabled, threshold, isMorphed, onMorphStateChange]);

  return (
    <div
      ref={containerRef}
      data-glass-effect-id={glassEffectID}
      className={`
        relative
        transition-all duration-300
        ${blurred ? 'backdrop-filter backdrop-blur-[20px] saturate-[1.8]' : ''}
        ${className}
      `}
      style={{
        backgroundColor: blurred ? 'rgba(255, 255, 255, 0.75)' : undefined,
      }}
    >
      {/* Morphed overlay (visible when elements merge) */}
      {isMorphed && (
        <div
          style={morphStyle}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
        />
      )}

      {children}
    </div>
  );
};

export default DGlassEffectContainer;
