"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  DatabaseBackup,
  Mail,
  Search,
  Users,
  Phone,
  Info,
  Image,
  UsersRound,
  Briefcase,
  Newspaper,
  Trophy,
  UserCog,
  Heart,
  Star,
  MapPin,
  CreditCard,
  Gift,
  Store,
  Shield,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/Pages/Dashboard" },
    { name: "BackUp", icon: <DatabaseBackup size={20} />, path: "/Pages/BackUp" },
    { name: "AutoSendEmail", icon: <Mail size={20} />, path: "/Pages/AutoSendEmail" },
    { name: "Seo", icon: <Search size={20} />, path: "/Pages/Seo" },
    { name: "Members", icon: <Users size={20} />, path: "/Pages/Members" },
    { name: "ContactInfo", icon: <Phone size={20} />, path: "/Pages/ContactInfo" },
    { name: "Contact Us", icon: <Phone size={20} />, path: "/Pages/ContactUs" },
    { name: "AboutUs", icon: <Info size={20} />, path: "/Pages/AboutUs" },
    { name: "Sliders", icon: <Image size={20} />, path: "/Pages/Sliders" },
    { name: "Gallery", icon: <Image size={20} />, path: "/Pages/Gallery" },
    { name: "TeamMembers", icon: <UsersRound size={20} />, path: "/Pages/TeamMembers" },
    { name: "Committee", icon: <UsersRound size={20} />, path: "/Pages/Committee" },
    { name: "BusinessCategory", icon: <Briefcase size={20} />, path: "/Pages/BusinessCategory" },
    { name: "NewsCategory", icon: <Newspaper size={20} />, path: "/Pages/NewsCategory" },
    { name: "SuccessStory", icon: <Trophy size={20} />, path: "/Pages/SuccessStory" },
    { name: "Profile Management", icon: <UserCog size={20} />, path: "/Pages/ProfileManagement" },
    { name: "Hobbies", icon: <Heart size={20} />, path: "/Pages/Hobbies" },
    { name: "Testimonials", icon: <Star size={20} />, path: "/Pages/Testimonials" },
    { name: "Casts", icon: <Users size={20} />, path: "/Pages/Casts" },
    { name: "Cities", icon: <MapPin size={20} />, path: "/Pages/Cities" },
    { name: "MembershipPlans", icon: <CreditCard size={20} />, path: "/Pages/MembershipPlans" },
    { name: "MarriagePackages", icon: <Gift size={20} />, path: "/Pages/MarriagePackages" },
    { name: "Relation", icon: <Heart size={20} />, path: "/Pages/Relation" },
    { name: "UserOffer", icon: <Gift size={20} />, path: "/Pages/UserOffer" },
    { name: "Vendors", icon: <Store size={20} />, path: "/Pages/Vendors" },
    { name: "AdminUser", icon: <Shield size={20} />, path: "/Pages/AdminUser" },
    { name: "Users Management", icon: <Users size={20} />, path: "/Pages/UserManagement" },
    { name: "Payment Management", icon: <BarChart2 size={20} />, path: "/Pages/PaymentManagement" },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
  className={`h-full flex flex-col bg-[#0F172A]
  transition-all duration-300
  ${collapsed ? "w-20" : "w-64"}`}
>
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex justify-center flex-1">
            <img
              src="/dhakadadmin/assets/images/dhakadlogo.png"
              className="h-10 object-contain"
            />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white p-1 rounded hover:bg-[#7B2A3A]"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <Link href={item.path || "#"} key={index}>
              <li
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-[#7B2A3A] text-white"
                    : "text-white hover:bg-[#7B2A3A]"
                }`}
              >
                {/* ICON FIX */}
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
                  <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    {item.name}
                  </span>
                )}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;