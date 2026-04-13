import React from "react";
import { cn } from "@/lib/cn";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    "disabled:opacity-60 disabled:pointer-events-none"
  );

  const variants = {
    primary: "bg-primary text-primary-foreground hover:brightness-95 active:brightness-90 shadow-soft-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:brightness-105 active:brightness-95 shadow-soft-sm",
    success: "bg-success text-success-foreground hover:brightness-95 active:brightness-90 shadow-soft-sm",
    danger: "bg-danger text-danger-foreground hover:brightness-95 active:brightness-90 shadow-soft-sm",
    outline:
      "border border-border bg-background text-foreground hover:bg-muted active:bg-muted/80 shadow-soft-sm",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        base,
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {leftIcon ? (
        <span className="shrink-0 [&>svg]:size-4 [&>svg]:translate-y-[0.5px]">
          {leftIcon}
        </span>
      ) : null}
      {children}
      {rightIcon ? (
        <span className="shrink-0 [&>svg]:size-4 [&>svg]:translate-y-[0.5px]">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
}

