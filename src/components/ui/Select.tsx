import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border bg-base-surface px-3.5 py-2.5 text-sm text-cream transition-colors focus:outline-none focus:ring-2 focus:ring-brown-400/50 ${
            error ? "border-loss" : "border-border focus:border-brown-400"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-loss">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
