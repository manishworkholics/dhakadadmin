import React from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

export default function Select({ className = "", children, ...props }) {
  return (
    <div className={cn("relative", className)}>
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-foreground shadow-soft-sm outline-none transition",
          "focus:ring-2 focus:ring-ring/25 focus:border-ring"
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

