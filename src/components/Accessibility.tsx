import React, { ReactNode, forwardRef } from 'react';

/**
 * Accessibility Utilities and Components
 * Ensures WCAG 2.1 AA compliance across the application
 */

// Skip link component for keyboard navigation
export const SkipLink = () => (
  <a
    href="#main-content"
    className="skip-link focus:top-6 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
    role="link"
    aria-label="Skip to main content"
  >
    Skip to main content
  </a>
);

// Screen reader only text
export const ScreenReaderOnly = ({ children }: { children: ReactNode }) => (
  <span className="sr-only">{children}</span>
);

// Focus management utilities
export const FocusTrap = ({ 
  children, 
  isActive = true 
}: { 
  children: ReactNode; 
  isActive?: boolean; 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
  
  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};

// Accessible button with proper ARIA attributes
export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: ReactNode;
  }
>(({ variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
  const baseClasses = [
    'btn',
    'touch-target',
    'focus-ring',
    'transition-all',
    'duration-200',
    'ease-out',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-subtle/50',
    danger: 'bg-state-danger text-white hover:bg-red-600',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };
  
  return (
    <button
      ref={ref}
      className={[
        ...baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'rounded-xl',
      ].join(' ')}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" aria-hidden="true" />
          <ScreenReaderOnly>Loading</ScreenReaderOnly>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

// Accessible input with proper labeling and error handling
export const AccessibleInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    helpText?: string;
    required?: boolean;
    id: string;
  }
>(({ label, error, helpText, required, id, className = '', ...props }, ref) => {
  const inputId = `${id}-input`;
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-ink-primary"
      >
        {label}
        {required && (
          <span className="text-state-danger ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        ref={ref}
        id={inputId}
        className={[
          'form-input',
          error ? 'border-state-danger focus:border-state-danger focus:ring-state-danger/20' : '',
          className,
        ].join(' ')}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[
          helpId,
          errorId,
        ].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      
      {helpText && !error && (
        <p id={helpId} className="text-xs text-ink-secondary">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-xs text-state-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';

// Accessible modal/dialog component
export const AccessibleModal = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ isOpen, onClose, title, children, size = 'md', className = '', ...props }, ref) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  
  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={[
          'relative bg-surface rounded-2xl shadow-float border border-border-subtle',
          'animate-scale-in',
          sizeClasses[size],
          'w-full max-h-[90vh] overflow-y-auto',
          className,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        {...props}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-semibold text-ink-primary">
              {title}
            </h2>
            <AccessibleButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-4"
            >
              x
            </AccessibleButton>
          </div>
          
          <FocusTrap isActive={isOpen}>
            <div className="mt-4">
              {children}
            </div>
          </FocusTrap>
        </div>
      </div>
    </div>
  );
});

AccessibleModal.displayName = 'AccessibleModal';

// Accessible toast notification
export const AccessibleToast = ({
  type = 'info',
  title,
  message,
  onClose,
  duration = 5000,
}: {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number;
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const typeStyles = {
    success: 'bg-state-success-bg border-state-success text-state-success',
    error: 'bg-state-danger-bg border-state-danger text-state-danger',
    warning: 'bg-state-warning-bg border-state-warning text-state-warning',
    info: 'bg-primary/10 border-primary/20 text-primary',
  };
  
  return (
    <div
      className={[
        'fixed bottom-4 right-4 z-50 p-4 rounded-xl border shadow-float',
        'animate-slide-up',
        'max-w-sm',
        typeStyles[type],
      ].join(' ')}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-sm mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
        
        <AccessibleButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-2"
        >
          x
        </AccessibleButton>
      </div>
    </div>
  );
};

// Loading state with proper accessibility
export const LoadingState = ({ 
  message = 'Loading...',
  className = '',
}: {
  message?: string;
  className?: string;
}) => (
  <div 
    className={`flex items-center gap-3 ${className}`}
    role="status"
    aria-live="polite"
  >
    <div 
      className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
      aria-hidden="true"
    />
    <ScreenReaderOnly>Loading</ScreenReaderOnly>
    <span className="text-sm text-ink-secondary">{message}</span>
  </div>
);

// Empty state component
export const EmptyState = ({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) => (
  <div className="text-center py-12">
    {Icon && (
      <Icon 
        size={48} 
        className="mx-auto text-ink-tertiary mb-4" 
        aria-hidden="true" 
      />
    )}
    <h3 className="text-lg font-semibold text-ink-primary mb-2">
      {title}
    </h3>
    <p className="text-ink-secondary mb-6 max-w-sm mx-auto">
      {description}
    </p>
    {action}
  </div>
);

// Error boundary wrapper
export class AccessibleErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center py-12">
            <div className="text-state-danger mb-4 text-3xl" role="img" aria-label="Error">
              !
            </div>
            <h2 className="text-lg font-semibold text-ink-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-ink-secondary mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <AccessibleButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </AccessibleButton>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
