import React, { forwardRef, InputHTMLAttributes, useId, useState } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message - shows error state when present */
  error?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Visually hide the label but keep it accessible */
  hideLabel?: boolean;
}

const sizeStyles = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-sm',
  lg: 'py-4 px-5 text-base',
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  hideLabel = false,
  className = '',
  id: providedId,
  disabled,
  required,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const [isFocused, setIsFocused] = useState(false);

  const describedByIds = [
    ariaDescribedBy,
    helperText ? helperId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  const inputStyles = `
    ${fullWidth ? 'w-full' : ''}
    ${sizeStyles[size]}
    ${leftIcon ? 'pl-11' : ''}
    ${rightIcon ? 'pr-11' : ''}
    bg-app/50 
    border 
    ${error 
      ? 'border-state-danger focus:border-state-danger focus:ring-state-danger/20' 
      : 'border-border-subtle focus:border-primary focus:ring-primary/20'
    }
    rounded-xl 
    text-ink-primary 
    placeholder-ink-tertiary
    font-medium
    transition-all 
    duration-200
    focus:outline-none 
    focus:ring-2
    focus:bg-white
    disabled:opacity-50 
    disabled:cursor-not-allowed
    disabled:bg-subtle
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block mb-2 text-sm font-semibold text-ink-primary
            ${hideLabel ? 'sr-only' : ''}
            ${required ? "after:content-['*'] after:ml-1 after:text-state-danger" : ''}
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div 
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 
              transition-colors duration-200
              ${isFocused ? 'text-primary' : 'text-ink-tertiary'}
              ${error ? 'text-state-danger' : ''}
            `.trim().replace(/\s+/g, ' ')}
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedByIds}
          aria-required={required ? 'true' : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={inputStyles}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 
              transition-colors duration-200
              ${isFocused ? 'text-primary' : 'text-ink-tertiary'}
              ${error ? 'text-state-danger' : ''}
            `.trim().replace(/\s+/g, ' ')}
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <div className="mt-2">
          {error && (
            <p 
              id={errorId}
              className="text-sm text-state-danger font-medium flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <span aria-hidden="true">⚠️</span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p 
              id={helperId}
              className="text-sm text-ink-tertiary"
            >
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// TextArea component with similar accessibility features
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  hideLabel?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  helperText,
  error,
  fullWidth = false,
  hideLabel = false,
  className = '',
  id: providedId,
  disabled,
  required,
  rows = 4,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const textareaStyles = `
    ${fullWidth ? 'w-full' : ''}
    py-3 px-4 
    bg-app/50 
    border 
    ${error 
      ? 'border-state-danger focus:border-state-danger focus:ring-state-danger/20' 
      : 'border-border-subtle focus:border-primary focus:ring-primary/20'
    }
    rounded-xl 
    text-sm
    text-ink-primary 
    placeholder-ink-tertiary
    font-medium
    transition-all 
    duration-200
    focus:outline-none 
    focus:ring-2
    focus:bg-white
    disabled:opacity-50 
    disabled:cursor-not-allowed
    disabled:bg-subtle
    resize-y
    min-h-[100px]
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block mb-2 text-sm font-semibold text-ink-primary
            ${hideLabel ? 'sr-only' : ''}
            ${required ? "after:content-['*'] after:ml-1 after:text-state-danger" : ''}
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[helperText ? helperId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
        aria-required={required ? 'true' : undefined}
        className={textareaStyles}
        {...props}
      />

      {(helperText || error) && (
        <div className="mt-2">
          {error && (
            <p id={errorId} className="text-sm text-state-danger font-medium" role="alert">
              <span aria-hidden="true">⚠️</span> {error}
            </p>
          )}
          {helperText && !error && (
            <p id={helperId} className="text-sm text-ink-tertiary">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
