import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-[24px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-ink-inverse shadow-ambient hover:shadow-float hover:-translate-y-0.5 focus:ring-primary/40",

    secondary: "bg-surface text-ink-primary hover:bg-subtle shadow-ambient hover:shadow-float focus:ring-primary/20",

    ghost: "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-subtle rounded-[24px]",

    danger: "bg-state-danger text-ink-inverse hover:bg-state-danger/90 shadow-ambient hover:shadow-float hover:-translate-y-0.5 focus:ring-state-danger/40",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
      {!isLoading && leftIcon && <span className="mr-2 opacity-90">{leftIcon}</span>}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
};
