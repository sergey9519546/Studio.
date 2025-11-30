import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface ModalAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryAction: ModalAction;
  secondaryAction?: ModalAction;
  variant?: 'confirm' | 'danger' | 'info';
  icon?: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

/**
 * Modal component for confirmations, alerts, and important user actions
 * Replaces window.confirm() and window.alert()
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'confirm',
  icon,
  closeOnBackdropClick = true,
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Determine icon and styling based on variant
  const variantConfig = {
    confirm: {
      icon: <CheckCircle size={24} className="text-primary" />,
      headerClass: 'bg-primary-tint',
    },
    danger: {
      icon: <AlertTriangle size={24} className="text-state-danger" />,
      headerClass: 'bg-state-danger-bg',
    },
    info: {
      icon: <AlertCircle size={24} className="text-primary" />,
      headerClass: 'bg-primary-tint',
    },
  };

  const { icon: variantIcon, headerClass } = variantConfig[variant];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => closeOnBackdropClick && onClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-surface rounded-2xl shadow-lg border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-5 flex items-center gap-4 ${headerClass}`}>
          {icon || variantIcon}
          <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
          <button
            onClick={onClose}
            className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors text-ink-primary"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        {description && (
          <div className="px-6 py-4">
            <p className="text-sm text-ink-secondary leading-relaxed">{description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border-subtle flex gap-3 justify-end">
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'secondary'}
              size="md"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.loading || primaryAction.loading}
            >
              {secondaryAction.label}
            </Button>
          )}
          <Button
            variant={primaryAction.variant || 'primary'}
            size="md"
            onClick={primaryAction.onClick}
            isLoading={primaryAction.loading}
            disabled={primaryAction.loading || secondaryAction?.loading}
          >
            {primaryAction.label}
          </Button>
        </div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
