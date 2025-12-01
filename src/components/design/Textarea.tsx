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
 * Textarea component with optional React Hook Form integration
 * Can be used standalone or with useController from react-hook-form
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
      'w-full px-4 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-offset-1 resize-none';

    const variantStyles = {
      primary: `border-border-subtle bg-surface text-ink-primary placeholder-ink-tertiary ${error
          ? 'border-state-danger focus:ring-state-danger/40 focus:border-state-danger'
          : 'focus:border-primary focus:ring-primary/40'
        }`,
      secondary: `border-border-subtle bg-subtle text-ink-primary placeholder-ink-tertiary ${error
          ? 'border-state-danger focus:ring-state-danger/40 focus:border-state-danger'
          : 'focus:border-primary focus:ring-primary/40'
        }`,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3.5 text-base',
    };

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed bg-subtle' : '';

    const textareaClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

    return (
      <div className="flex flex-col gap-1.5">
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

/**
 * Textarea component wrapper for React Hook Form integration
 * Usage: <TextareaField control={control} name="description" label="Description" rules={{required: "Description is required"}} />
 */
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

    return (
      <Textarea
        ref={ref}
        {...field}
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
