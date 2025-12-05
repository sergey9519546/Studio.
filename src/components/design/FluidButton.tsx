import React, { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface FluidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'edge';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fluidMorph?: boolean;
  hapticFeedback?: boolean;
  glassEffect?: boolean;
}

export const FluidButton: React.FC<FluidButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fluidMorph = true,
  hapticFeedback = true,
  glassEffect = false,
  className = '',
  disabled,
  onMouseDown,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const baseStyles = `
    relative inline-flex items-center justify-center font-medium 
    transition-all duration-200 ease-out 
    disabled:opacity-50 disabled:cursor-not-allowed 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    overflow-hidden
    active:scale-[0.96]
    ${fluidMorph ? 'active:shadow-none' : ''}
  `;
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs tracking-wide rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5",
  };

  const variants = {
    primary: `
      bg-primary hover:bg-primary-hover text-ink-inverse shadow-md 
      hover:shadow-lg hover:-translate-y-[2px] 
      focus:ring-primary/40 
      border border-transparent
      active:bg-primary active:shadow-sm
    `,
    
    secondary: `
      bg-surface border border-border-subtle text-ink-primary 
      hover:bg-subtle/60 hover:border-border-hover hover:shadow-md 
      focus:ring-border-subtle shadow-sm
      active:bg-subtle active:border-border-hover
    `,
    
    ghost: `
      bg-transparent text-ink-secondary 
      hover:text-ink-primary hover:bg-subtle/50 
      focus:ring-primary/20 
      active:bg-subtle/70
    `,

    danger: `
      bg-state-danger text-white 
      hover:bg-red-700 hover:shadow-lg hover:-translate-y-[2px] 
      focus:ring-red-500/40 shadow-md
      active:bg-red-800 active:shadow-sm
    `,

    edge: `
      bg-gradient-to-r from-primary via-edge-teal to-edge-magenta 
      text-white shadow-lg
      hover:shadow-xl hover:-translate-y-[2px]
      focus:ring-primary/40
      active:shadow-md
      border border-white/10
    `,
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    setIsPressed(true);

    // Calculate ripple position
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    // Haptic feedback simulation (Web Haptics API if available)
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }

    onMouseDown?.(e);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate([5, 10, 5]); // Complex haptic pattern
    }
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variants[variant]}
        ${glassEffect ? 'backdrop-filter backdrop-blur-md saturate-150 bg-opacity-75' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple Effect */}
      {isPressed && (
        <div
          style={{
            position: 'absolute',
            left: ripplePosition.x,
            top: ripplePosition.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      )}

      {/* Loading spinner */}
      {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}

      {/* Left Icon */}
      {!isLoading && leftIcon && (
        <span className="opacity-90 transition-transform duration-200 group-hover:scale-110">
          {leftIcon}
        </span>
      )}

      {/* Children Text */}
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {children}
      </span>

      {/* Right Icon */}
      {!isLoading && rightIcon && (
        <span className="opacity-90 transition-transform duration-200 group-hover:scale-110">
          {rightIcon}
        </span>
      )}

      {/* Morphing Glow Effect (for edge variant) */}
      {variant === 'edge' && !disabled && (
        <div
          className={`
            absolute inset-0 rounded-[inherit]
            bg-gradient-to-r from-primary/0 via-white/0 to-primary/0
            transition-opacity duration-300
            ${isPressed ? 'opacity-40' : 'opacity-0'}
            pointer-events-none
          `}
        />
      )}

      <style>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default FluidButton;
