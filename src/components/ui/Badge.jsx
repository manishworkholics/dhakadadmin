import React from "react";
import { cn } from "@/lib/cn";

export default function Badge({ variant = "default", className = "", children }) {
  const variants = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    outline: "border border-border bg-transparent text-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

