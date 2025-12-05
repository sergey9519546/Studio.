import React from 'react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Textarea component with Liquid Glass aesthetic
 * No borders. Separation via luminance and spacing.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'w-full rounded-[24px] text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 resize-none';

    const variantStyles = {
      primary: `bg-surface text-ink-primary placeholder-ink-tertiary ${error
          ? 'focus:ring-state-danger/40 focus:bg-danger-bg'
          : 'focus:bg-subtle focus:ring-primary/40'
        }`,
      secondary: `bg-subtle text-ink-primary placeholder-ink-tertiary ${error
          ? 'focus:ring-state-danger/40'
          : 'focus:bg-surface focus:ring-primary/40'
        }`,
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    };

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed bg-subtle' : '';

    const textareaClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide">
            {label}
            {props.required && <span className="text-state-danger ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.name}-error`} className="text-xs font-medium text-state-danger">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.name}-helper`} className="text-xs text-ink-tertiary font-medium">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

interface TextareaFieldProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
  label?: string;
  helperText?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
  textareaProps?: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, helperText, variant, size, rows, textareaProps, ...fieldProps }, ref) => {
    const { field, fieldState } = useController(fieldProps);
    const { ref: fieldRef, ...restField } = field;
    const setRef = (instance: HTMLTextAreaElement | null) => {
      if (typeof ref === 'function') ref(instance);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = instance;
      fieldRef(instance);
    };

    return (
      <Textarea
        ref={setRef}
        {...restField}
        {...textareaProps}
        label={label}
        error={fieldState.error?.message}
        helperText={helperText}
        variant={variant}
        size={size}
        rows={rows}
      />
    );
  },
);

TextareaField.displayName = 'TextareaField';
