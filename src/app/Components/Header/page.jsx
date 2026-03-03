"use client";
import React, { useState, useEffect, useRef } from "react";
import {Moon,Sun,Bell,Search,User,Settings,LogOut} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Header = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

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
  localStorage.removeItem("token");
  toast.success("Logged out successfully!");

  setTimeout(() => {
    window.location.href = "/dhakadadmin/Pages/Login";
  }, 1000); 
};


  const handleNavigateProfile = () => {
   router.push("/Pages/Pofile"); 
  }

  return (
    <header className="flex items-center justify-between 
bg-slate-800 text-slate-100
border-b border-slate-700
px-6 py-2 mt-0 shadow-md">

  <div className="text-xl font-semibold text-white">
    Dhakad Matrimonial Admin
  </div>

  <ToastContainer position="top-right" autoClose={2000} />

  {/* Right: Icons and Profile */}
  <div className="flex items-center gap-5 relative" ref={dropdownRef}>
    
    {/* Notification */}
    <button className="relative text-slate-300 hover:text-white transition cursor-pointer">
      <Bell size={22} />
      <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
    </button>

    {/* Profile */}
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition"
    >
      <img
        src="https://i.pravatar.cc/40"
        alt="Profile"
        className="w-8 h-8 rounded-full border border-slate-600"
      />
      <span className="hidden md:block text-slate-200 font-medium">
        Admin
      </span>
    </div>

    {/* Dropdown Menu */}
    {openDropdown && (
      <div className="absolute right-0 top-14 w-56 
      bg-white 
      border border-gray-200 
      rounded-lg shadow-lg py-2 z-50">

        <div className="px-4 py-2">
          <p className="font-semibold text-gray-800"></p>
          <p className="text-sm text-gray-500"></p>
        </div>

        <hr className="border-gray-200 my-2" />

        <ul className="text-gray-700">
          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
            onClick={handleNavigateProfile}
          >
            <User size={18} className="text-gray-600" />
            View Profile
          </li>

          <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition">
            <Settings size={18} className="text-gray-600" />
            Account Settings
          </li>

          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition"
            onClick={handleLogout}
          >
            <LogOut size={18} />
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
