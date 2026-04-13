/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Sidebar from "@/app/Components/Sidebar/page";
import Header from "@/app/Components/Header/page";
import { Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function AdminShell({ children, className = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-muted/40">
      <div className="flex min-h-dvh">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar (off-canvas) */}
        <div
          className={cn(
            "fixed inset-0 z-40 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/40 transition-opacity",
              mobileOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-72 max-w-[80vw] transition-transform",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
            <div className="flex items-center gap-2 px-3 py-2 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileOpen(true)}
                className="h-9 w-9 px-0"
                aria-label="Open sidebar"
              >
                <Menu />
              </Button>
              <div className="text-sm font-semibold text-foreground">
                Dhakad Admin
              </div>
            </div>
            <Header />
          </div>

          <main className={cn("min-w-0 flex-1 p-4 md:p-6", className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

