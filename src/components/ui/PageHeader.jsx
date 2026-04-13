import React from "react";
import { cn } from "@/lib/cn";

export default function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

