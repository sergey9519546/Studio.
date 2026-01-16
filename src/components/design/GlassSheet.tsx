import React from 'react';

interface GlassSheetProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  position?: 'center' | 'right';
  glassEffectID?: string;
}

/**
 * Minimal glass surface container to prevent import errors in design index.
 * Provides a consistent frosted panel for inline use, with optional modal affordances.
 */
export const GlassSheet: React.FC<GlassSheetProps> = ({
  children,
  className = '',
  padding = 'md',
  isOpen = true,
  onClose,
  title,
  size = 'md',
  position = 'center',
}) => {
  if (!isOpen) return null;

  const paddingClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
        ? 'p-4'
        : padding === 'lg'
          ? 'p-8'
          : 'p-6';

  const sizeClass =
    size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-5xl' : size === 'full' ? 'w-full' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        className={`
          bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[28px] shadow-float
          w-full ${sizeClass} ${paddingClass} ${className}
          ${position === 'right' ? 'ml-auto mr-8' : ''}
        `}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink-primary">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-black/5 transition-colors text-ink-secondary"
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default GlassSheet;
