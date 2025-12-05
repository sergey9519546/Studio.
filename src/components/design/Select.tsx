import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T extends FieldValues = FieldValues>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Select component with optional React Hook Form integration
 * Can be used standalone or with useController from react-hook-form
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select...',
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'w-full appearance-none border rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-offset-1 pr-10';

    const variantStyles = {
      primary: `border-border-subtle bg-surface text-ink-primary ${
        error
          ? 'border-state-danger focus:ring-state-danger/40 focus:border-state-danger'
          : 'focus:border-primary focus:ring-primary/40'
      }`,
      secondary: `border-border-subtle bg-subtle text-ink-primary ${
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

    const selectClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide">
            {label}
            {props.required && <span className="text-state-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 text-ink-tertiary pointer-events-none flex-shrink-0"
            strokeWidth={2}
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

Select.displayName = 'Select';

/**
 * Select component wrapper for React Hook Form integration
 * Usage: <SelectField control={control} name="status" label="Status" options={statusOptions} rules={{required: "Status is required"}} />
 */
interface SelectFieldProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
  label?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  selectProps?: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'>;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, helperText, options, placeholder, variant, size, selectProps, ...fieldProps }, ref) => {
    const { field, fieldState } = useController(fieldProps);
    const { ref: fieldRef, ...restField } = field;
    const setRef = (instance: HTMLSelectElement | null) => {
      if (typeof ref === 'function') ref(instance);
      else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = instance;
      fieldRef(instance);
    };

    return (
      <Select
        ref={setRef}
        {...restField}
        {...selectProps}
        label={label}
        error={fieldState.error?.message}
        helperText={helperText}
        options={options}
        placeholder={placeholder}
        variant={variant}
        size={size}
      />
    );
  },
);

SelectField.displayName = 'SelectField';
