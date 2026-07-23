import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-border bg-base-surface shadow-[0_1px_0_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    />
  );
}
