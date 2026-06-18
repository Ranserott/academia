import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-white block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
            error ? 'border-red-500 focus:ring-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
