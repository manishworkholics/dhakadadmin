"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import NProgress from "nprogress";
import { adminMenuItems } from "./menuItems";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigation = (path) => {
    if (pathname === path) return;

    NProgress.start();
    router.push(path);

    setTimeout(() => {
      NProgress.done();
    }, 500); // smooth UX
  };

  return (
    <div
      className={cn(
        "h-dvh flex flex-col bg-background text-foreground transition-all duration-300",
        "border-r border-border",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex justify-center flex-1">
            <img
              src="/dhakadadmin/assets/images/dhakadlogo.png"
              className="h-10 object-contain"
            />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg border border-border bg-background hover:bg-muted transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
        {adminMenuItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <li
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {/* ICON */}
              <div className="min-w-[20px] flex justify-center">
                {item.icon}
              </div>

              {/* TEXT */}
              {!collapsed && (
                <span className="text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}

              {/* TOOLTIP */}
              {collapsed && (
                <span className="absolute left-16 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-soft-sm">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;