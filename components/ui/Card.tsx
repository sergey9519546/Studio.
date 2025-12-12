import React, { forwardRef, KeyboardEvent } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  noPadding?: boolean;
  /** Make card interactive/clickable with proper accessibility */
  interactive?: boolean;
  /** ARIA label for screen readers */
  ariaLabel?: string;
  /** ARIA describedby for additional context */
  ariaDescribedBy?: string;
  /** Card variant for different visual styles */
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  /** Disable hover effects */
  noHover?: boolean;
  /** HTML element role */
  role?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

const variantStyles = {
  default: 'bg-surface border border-border-subtle shadow-card',
  elevated: 'bg-surface border border-border-subtle shadow-elevation hover:shadow-float',
  outlined: 'bg-transparent border-2 border-border-subtle hover:border-primary/30',
  glass: 'glass border border-white/20 backdrop-blur-xl',
};

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = "",
  onClick,
  onKeyDown,
  noPadding = false,
  interactive = false,
  ariaLabel,
  ariaDescribedBy,
  variant = 'default',
  noHover = false,
  role,
  tabIndex,
}, ref) => {
  const isClickable = Boolean(onClick) || interactive;
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
      return;
    }
    // Handle Enter and Space for accessibility
    if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const baseStyles = `
    rounded-2xl 
    ${noPadding ? '' : 'p-6 md:p-8'} 
    transition-all duration-300 ease-out
    ${variantStyles[variant]}
    ${!noHover && isClickable ? 'hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer' : ''}
    ${isClickable ? 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={baseStyles}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

// Additional Card subcomponents for better composition
export const CardHeader: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`text-lg font-bold text-ink-primary mb-2 ${className}`}>
    {children}
  </Component>
);

export const CardDescription: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={`text-sm text-ink-secondary ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-border-subtle flex items-center gap-3 ${className}`}>
    {children}
  </div>
);
