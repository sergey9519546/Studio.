import React from 'react';

interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  default: 'bg-primary text-white',
  secondary: 'bg-subtle text-ink-primary',
  destructive: 'bg-state-danger text-white',
  outline: 'border border-border-subtle bg-transparent text-ink-primary',
  success: 'bg-state-success text-white',
  warning: 'bg-state-warning text-ink-primary',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const badgeStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeStyles}>
      {children}
    </span>
  );
};

export default Badge;
