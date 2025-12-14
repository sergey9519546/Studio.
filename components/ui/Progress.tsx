import React from 'react';

interface ProgressProps {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  label?: string;
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorStyles = {
  primary: 'bg-primary',
  secondary: 'bg-ink-tertiary',
  success: 'bg-state-success',
  warning: 'bg-state-warning',
  danger: 'bg-state-danger',
};

const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  showPercentage = false,
  size = 'md',
  color = 'primary',
  className = '',
  label,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const progressBarStyles = `
    w-full 
    bg-subtle 
    rounded-full 
    overflow-hidden
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const progressFillStyles = `
    h-full 
    transition-all duration-300 ease-out
    ${colorStyles[color]}
    rounded-full
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {(showPercentage || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-ink-primary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-ink-secondary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div 
        className={progressBarStyles}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div 
          className={progressFillStyles}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
