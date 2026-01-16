import React from 'react';

interface LiquidGlassContainerProps {
  children: React.ReactNode;
  className?: string;
  level?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

/**
 * LiquidGlassContainer
 *
 * The fundamental material of the Liquid Glass design system.
 * Embodies the aesthetic: weightless, luminous, reductionist.
 *
 * Uses backdrop-filter blur(20px) saturate(180%) with rgba(255,255,255,0.75)
 * for sidebar and floating header elements.
 */
export const LiquidGlassContainer: React.FC<LiquidGlassContainerProps> = ({
  children,
  className = '',
  level = 'md',
  interactive = false,
}) => {
  const levelStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        glass
        rounded-[24px]
        shadow-ambient
        transition-all duration-200
        ${levelStyles[level]}
        ${interactive ? 'hover:shadow-float hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default LiquidGlassContainer;
