"use client";

import React, { useState } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-100">

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 
          lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          ></div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header with menu button */}
          <div className=" items-center justify-between">
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <Header />
          </div>

          {/* Main Content */}
          <div className="flex-1 pt-0 overflow-auto">
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 flex justify-center">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">

                {/* Profile Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex items-center gap-6">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Admin"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                  />

                  <div>
                    <h1 className="text-3xl font-bold">Super Admin</h1>
                    <p className="text-sm opacity-90 mt-1">
                      admin@dhakadmatrimony.com
                    </p>
                    <div className="mt-3 inline-block px-4 py-1 bg-white/25 rounded-full text-sm font-semibold tracking-wide">
                      ADMINISTRATOR
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-8 space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-500 text-sm block">Username</label>
                      <p className="text-gray-800 font-medium">SuperAdmin</p>
                    </div>

                    <div>
                      <label className="text-gray-500 text-sm block">Email</label>
                      <p className="text-gray-800 font-medium">
                        admin@dhakadmatrimony.com
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-500 text-sm block">Mobile Number</label>
                      <p className="text-gray-800 font-medium">+91 9999999999</p>
                    </div>

                    <div>
                      <label className="text-gray-500 text-sm block">Role</label>
                      <p className="text-gray-800 font-medium">Administrator</p>
                    </div>

                    <div>
                      <label className="text-gray-500 text-sm block">Account Created</label>
                      <p className="text-gray-800 font-medium">Jan 10, 2025</p>
                    </div>

                    <div>
                      <label className="text-gray-500 text-sm block">Account Status</label>
                      <p className="text-green-600 font-semibold">Active</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-gray-500 text-sm block">Address</label>
                      <p className="text-gray-800 font-medium">
                        24, Vaishali Nagar, Indore, Madhya Pradesh
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-gray-500 text-sm block">About</label>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        I am the Super Admin responsible for managing Dhakad Matrimony system 
                        including profiles, reports, verification, and user activities.
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-end">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition">
                      Edit Profile
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
          
        </div>

      </div>
    </>
  );
};

export default ProtectedRoute(Page);
