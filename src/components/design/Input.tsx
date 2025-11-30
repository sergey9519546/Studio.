import React from 'react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';

interface InputProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  control?: any; // React Hook Form control object (if used with useController)
  name?: string; // If using with React Hook Form
}

/**
 * Input component with optional React Hook Form integration
 * Can be used standalone or with useController from react-hook-form
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'w-full px-4 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-offset-1';

    const variantStyles = {
      primary: `border-border-subtle bg-surface text-ink-primary placeholder-ink-tertiary ${
        error
          ? 'border-state-danger focus:ring-state-danger/40 focus:border-state-danger'
          : 'focus:border-primary focus:ring-primary/40'
      }`,
      secondary: `border-border-subtle bg-subtle text-ink-primary placeholder-ink-tertiary ${
        error
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

    const inputClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide">
            {label}
            {props.required && <span className="text-state-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-ink-tertiary pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
            {...props}
          />
        </div>
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

Input.displayName = 'Input';

/**
 * Input component wrapper for React Hook Form integration
 * Usage: <InputField control={control} name="email" label="Email" rules={{required: "Email is required"}} />
 */
interface InputFieldProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helperText, icon, variant, size, inputProps, ...fieldProps }, ref) => {
    const { field, fieldState } = useController(fieldProps);

    return (
      <Input
        ref={ref}
        {...field}
        {...inputProps}
        label={label}
        error={fieldState.error?.message}
        helperText={helperText}
        icon={icon}
        variant={variant}
        size={size}
      />
    );
  },
);

InputField.displayName = 'InputField';
