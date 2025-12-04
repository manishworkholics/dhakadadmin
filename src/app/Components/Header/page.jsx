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
    <header className="flex items-center justify-between border-s-1 bg-white dark:bg-white-900 border-b border-gray-200 dark:border-border-700 px-6 py-2 mt-0 ">
      <div className="text-xl font-semibold text-gray-800 dark:text-black">
        Dhakad Matrimonial Admin
      </div>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Center: Search Bar */}
      {/* <div className="hidden md:flex items-center bg-gray-100 dark:bg-blue-100 px-3 py-2 rounded-lg w-1/3">
        <Search className="text-gray-500 dark:text-black-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-black-700 dark:text-black-200 w-full"
        />
      </div> */}

      {/* Right: Icons and Profile */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* Notification */}
        <button className="relative text-gray-700 hover:text-blue-600 transition">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Profile */}
        <div
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <span className="hidden md:block text-gray-800 dark:text-gray-300 font-medium">
            Admin
          </span>
        </div>

        {/* Dropdown Menu */}
        {openDropdown && (
          <div className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                Priyanshi Choudhary
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                admin@dhakad.com
              </p>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-2" />

            <ul className="text-gray-700 dark:text-gray-200">
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"  onClick={handleNavigateProfile}>
                <User size={18} className="text-gray-600 dark:text-gray-300" />
                View Profile
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                <Settings
                  size={18}
                  className="text-gray-600 dark:text-gray-300"
                />
                Account Settings
              </li>
              <li className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-700 text-red-600 dark:text-red-400 cursor-pointer transition" onClick={handleLogout}>
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
