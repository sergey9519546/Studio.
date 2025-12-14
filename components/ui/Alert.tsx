import React, { forwardRef } from 'react';

interface AlertProps {
  /** Alert content */
  children: React.ReactNode;
  /** Alert variant */
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
  /** Additional CSS classes */
  className?: string;
  /** Show icon */
  showIcon?: boolean;
}

const variantStyles = {
  default: 'border-border-subtle bg-surface',
  destructive: 'border-state-danger bg-state-danger/10 text-ink-primary',
  warning: 'border-state-warning bg-state-warning/10 text-ink-primary',
  success: 'border-state-success bg-state-success/10 text-ink-primary',
  info: 'border-primary/30 bg-primary/10 text-ink-primary',
};

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  className = '',
  showIcon = true,
}) => {
  const alertStyles = `
    p-4 rounded-xl border
    ${variantStyles[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={alertStyles} role="alert">
      {showIcon && (
        <div className="mb-2">
          {variant === 'destructive' && <span aria-hidden="true">⚠️</span>}
          {variant === 'warning' && <span aria-hidden="true">⚠️</span>}
          {variant === 'success' && <span aria-hidden="true">✅</span>}
          {variant === 'info' && <span aria-hidden="true">ℹ️</span>}
          {variant === 'default' && <span aria-hidden="true">💡</span>}
        </div>
      )}
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

export default Alert;
