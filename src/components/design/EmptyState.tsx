import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean; // Reduce padding/spacing for inline use
}

/**
 * EmptyState component for displaying friendly messages when there's no data
 * Replaces silent empty lists/tables with actionable UI
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  cta,
  compact = false,
}) => {
  const paddingClass = compact ? 'py-8 px-4' : 'py-16 px-6';

  const isReactNode = React.isValidElement(Icon);
  const isComponent = typeof Icon === 'function';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${paddingClass}`}>
      {/* Icon */}
      <div className="mb-4">
        {isReactNode ? (
          Icon
        ) : isComponent ? (
          <Icon size={48} className="text-ink-tertiary" strokeWidth={1.5} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-subtle flex items-center justify-center">
            {Icon as React.ReactNode}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-ink-primary mb-2">{title}</h3>

      {/* Description */}
      {description && <p className="text-sm text-ink-secondary mb-6 max-w-md leading-relaxed">{description}</p>}

      {/* CTA Button */}
      {cta && (
        <Button variant="primary" size="md" onClick={cta.onClick}>
          {cta.label}
        </Button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
