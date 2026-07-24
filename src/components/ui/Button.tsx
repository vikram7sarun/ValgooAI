import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brown-500 text-cream hover:bg-brown-400 focus-visible:ring-brown-300 disabled:bg-brown-800 disabled:text-muted",
  secondary:
    "bg-base-elevated text-cream border border-border hover:border-brown-400 focus-visible:ring-brown-300",
  ghost: "bg-transparent text-cream hover:bg-base-elevated focus-visible:ring-brown-300",
  danger: "bg-loss/10 text-loss border border-loss/40 hover:bg-loss/20 focus-visible:ring-loss",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
