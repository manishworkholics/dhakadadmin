import React from "react";
import { cn } from "@/lib/cn";

export default function Loader({ label = "Loading...", className = "" }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-10", className)}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70" />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  );
}

