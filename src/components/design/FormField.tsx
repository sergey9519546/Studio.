import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

/**
 * FormField wrapper component for custom inputs or when you need to wrap a custom control
 * Provides consistent label, error message, and helper text styling
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  htmlFor,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-bold text-ink-secondary uppercase tracking-wide">
          {label}
          {required && <span className="text-state-danger ml-1">*</span>}
        </label>
      )}
      <div>{children}</div>
      {error && <p className="text-xs font-medium text-state-danger">{error}</p>}
      {helperText && !error && <p className="text-xs text-ink-tertiary font-medium">{helperText}</p>}
    </div>
  );
};

FormField.displayName = 'FormField';
