"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const Header = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

 const handleLogout = () => {
  localStorage.removeItem("admintoken");
  window.location.href = "/dhakadadmin/Pages/Login";
};


  const handleNavigateProfile = () => {
   router.push("/Pages/Pofile"); 
  }

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <div className="hidden lg:block text-sm font-semibold text-foreground">
        Dhakad Matrimonial Admin
      </div>

      {/* Right: Icons and Profile */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
    
    {/* Notification */}
    <Button variant="outline" size="sm" className="h-9 w-9 px-0 relative" aria-label="Notifications">
      <Bell />
      <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
    </Button>

    {/* Profile */}
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted transition"
    >
      <img
        src="https://i.pravatar.cc/40"
        alt="Profile"
        className="w-8 h-8 rounded-full border border-border"
      />
      <span className="hidden md:block text-foreground font-medium">
        Admin
      </span>
    </div>

    {/* Dropdown Menu */}
    {openDropdown && (
      <div className={cn(
        "absolute right-0 top-12 w-56 rounded-xl border border-border bg-background shadow-soft py-2 z-50"
      )}>

        <div className="px-4 py-2">
          <p className="font-semibold text-gray-800"></p>
          <p className="text-sm text-gray-500"></p>
        </div>

        <hr className="border-gray-200 my-2" />

        <ul className="text-sm text-foreground">
          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted cursor-pointer transition"
            onClick={handleNavigateProfile}
          >
            <User className="text-muted-foreground size-4" />
            View Profile
          </li>

          <li className="flex items-center gap-2 px-4 py-2 hover:bg-muted cursor-pointer transition">
            <Settings className="text-muted-foreground size-4" />
            Account Settings
          </li>

          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-danger/10 text-danger cursor-pointer transition"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </li>
        </ul>
      </div>
    )}
  </div>
</header>
  );
};

export default Header;
