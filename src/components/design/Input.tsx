import React from 'react';
import {
  Control,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  control?: Control<FieldValues>;
  name?: string;
}

/**
 * Input component with Liquid Glass aesthetic
 * No borders. Separation via luminance and spacing.
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
      'w-full rounded-[24px] text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary/40';

    const variantStyles = {
      primary: `bg-surface text-ink-primary placeholder-ink-tertiary ${
        error
          ? 'focus:ring-state-danger/40 focus:bg-danger-bg'
          : 'focus:bg-subtle focus:ring-primary/40'
      }`,
      secondary: `bg-subtle text-ink-primary placeholder-ink-tertiary ${
        error
          ? 'focus:ring-state-danger/40'
          : 'focus:bg-surface focus:ring-primary/40'
      }`,
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3.5 text-base',
    };

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed bg-subtle' : '';

    const inputClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide">
            {label}
            {props.required && (
              <span className="text-state-danger ml-1">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-ink-tertiary pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputClasses} ${icon ? "pl-10" : ""}`}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${props.name}-error`
                : helperText
                  ? `${props.name}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${props.name}-error`}
            className="text-xs font-medium text-state-danger"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${props.name}-helper`}
            className="text-xs text-ink-tertiary font-medium"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

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
    const { ref: fieldRef, ...restField } = field;
    const setRef = (instance: HTMLInputElement | null) => {
      if (typeof ref === 'function') ref(instance);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = instance;
      fieldRef(instance);
    };

    return (
      <Input
        ref={setRef}
        {...restField}
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
