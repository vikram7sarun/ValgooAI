import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-base-surface px-3.5 py-2.5 text-sm text-cream placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-400/50 ${
            error ? "border-loss" : "border-border focus:border-brown-400"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-loss">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
