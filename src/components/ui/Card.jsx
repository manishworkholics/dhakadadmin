import React from "react";
import { cn } from "@/lib/cn";

export default function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background shadow-soft-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

