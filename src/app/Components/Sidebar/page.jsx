"use client";
import React from "react";
import { LayoutDashboard, Users, CheckSquare, MessageSquare, Heart, CreditCard, Brain, Users2, FileText, BarChart2, ShieldCheck, FileCog, Bell, Settings, UserCog, ListChecks, } from "lucide-react";

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Users Management", icon: <Users size={20} /> },
        { name: "Profile Approvals", icon: <CheckSquare size={20} /> },
        { name: "AI & Security", icon: <Brain size={20} /> },
        { name: "Analytics & Reports", icon: <BarChart2 size={20} /> },
        { name: "Settings", icon: <Settings size={20} /> },
        // { name: "Chats & Reports", icon: <MessageSquare size={20} /> },
        // { name: "Matches Overview", icon: <Heart size={20} /> },
        // { name: "Payments & Subscriptions", icon: <CreditCard size={20} /> },
        // { name: "Community Management", icon: <Users2 size={20} /> },
        // { name: "AI Bio & Suggestions", icon: <FileText size={20} /> },
        // { name: "Verification Requests", icon: <ShieldCheck size={20} /> },
        // { name: "Content Management", icon: <FileCog size={20} /> },
        // { name: "Notifications", icon: <Bell size={20} /> },
        // { name: "Admin Roles & Permissions", icon: <UserCog size={20} /> },
        // { name: "Audit Logs", icon: <ListChecks size={20} /> },
    ];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Logo / Header */}
            <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    Dhakad Matrimonial
                </h2>
            </div>

            {/* Menu */}
            <ul className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all"
                    >
                        {item.icon}
                        <span className="text-sm font-small text-nowrap">{item.name}</span>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            {/* <div className="p-4 border-t text-xs text-gray-500 text-center">
        © 2025 Dhakad Admin
      </div> */}
        </div>
    );
};

export default Sidebar;
