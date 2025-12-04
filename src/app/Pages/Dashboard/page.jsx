"use client";
import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import MainContent from "../../Components/MainContent/page.jsx";
import { Menu } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";


const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay when sidebar open (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        ></div>
      )}

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with mobile menu button */}
        <div className="flex items-center justify-between border-b bg-white shadow-sm px-4 py-1 lg:py-0">
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-1 overflow-auto">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Page);


