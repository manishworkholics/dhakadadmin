import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "lg",
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        className={cn(
          "w-full rounded-xl border border-border bg-background shadow-soft",
          sizes[size] || sizes.lg
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 px-0"
            aria-label="Close"
          >
            <X />
          </Button>
        </div>

        <div className="p-4">{children}</div>

        {footer ? <div className="p-4 pt-0">{footer}</div> : null}
      </div>
    </div>
  );
}

