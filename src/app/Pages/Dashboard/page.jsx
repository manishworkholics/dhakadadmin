"use client";
import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import MainContent from "../../Components/MainContent/page.jsx";
import { Menu } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const Page = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      {/* Desktop Sidebar (FLEX ITEM) */}
      <div className="hidden lg:block ...">
  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
</div>

{/* Mobile Sidebar */}
<div className="lg:hidden fixed ...">
  <Sidebar collapsed={false} setCollapsed={() => {}} />
</div>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center bg-white shadow-sm px-4">

          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto transition-all duration-300">
          <MainContent />
        </div>

      </div>

    </div>
  );
};

export default ProtectedRoute(Page);