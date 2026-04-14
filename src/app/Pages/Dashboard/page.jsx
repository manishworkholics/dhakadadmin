"use client";
import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import MainContent from "../../Components/MainContent/page.jsx";
import { Menu } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
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

      <div className="flex-1 flex flex-col h-screen">

        {/* HEADER (FIXED) */}
        <Header />

        {/* CONTENT (SCROLLABLE ONLY) */}
        <div className="flex-1 overflow-y-auto">
          <MainContent />
        </div>

      </div>

    </div>
  );
};

export default ProtectedRoute(Page);