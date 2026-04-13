import React from "react";
import { cn } from "@/lib/cn";

export default function Input({ className = "", size = "md", ...props }) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-3 text-sm",
    lg: "h-11 px-4 text-sm",
  };
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-background text-foreground shadow-soft-sm outline-none transition",
        "placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/25 focus:border-ring",
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
}

