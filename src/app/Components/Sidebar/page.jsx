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
    { name: "Contact Us", icon: <Phone size={20} />, path: "/Pages/ContactUs" },
    { name: "Success Stories", icon: <Trophy size={20} />, path: "/Pages/SuccessStory" },
    { name: "Profile Management", icon: <UserCog size={20} />, path: "/Pages/ProfileManagement" },
    { name: "Testimonials", icon: <Star size={20} />, path: "/Pages/Testimonials" },
    { name: "Membership Plans", icon: <CreditCard size={20} />, path: "/Pages/MembershipPlans" },
    { name: "Admin User", icon: <Shield size={20} />, path: "/Pages/AdminUser" },
    { name: "Users Management", icon: <Users size={20} />, path: "/Pages/UserManagement" },
    { name: "Payment Management", icon: <BarChart2 size={20} />, path: "/Pages/PaymentManagement" },
    { name: "Cities", icon: <MapPin size={20} />, path: "/Pages/Cities" },
    { name: "Seo", icon: <Search size={20} />, path: "/Pages/Seo" },
    { name: "Blog", icon: <Search size={20} />, path: "/Pages/Blog" },

    //  { name: "Backup", icon: <DatabaseBackup size={20} />, path: "/Pages/Backup" },
    // { name: "Auto Send Email", icon: <Mail size={20} />, path: "/Pages/AutoSendEmail" },

    // { name: "Members", icon: <Users size={20} />, path: "/Pages/Members" },
    // { name: "Contact Info", icon: <Phone size={20} />, path: "/Pages/ContactInfo" },
    // { name: "About Us", icon: <Info size={20} />, path: "/Pages/AboutUs" },
    // { name: "Sliders", icon: <Image size={20} />, path: "/Pages/Sliders" },
    // { name: "Gallery", icon: <Image size={20} />, path: "/Pages/Gallery" },
    // { name: "Team Members", icon: <UsersRound size={20} />, path: "/Pages/TeamMembers" },
    // { name: "Committee", icon: <UsersRound size={20} />, path: "/Pages/Committee" },
    // { name: "Business Category", icon: <Briefcase size={20} />, path: "/Pages/BusinessCategory" },
    // { name: "News Category", icon: <Newspaper size={20} />, path: "/Pages/NewsCategory" },
    // { name: "Hobbies", icon: <Heart size={20} />, path: "/Pages/Hobbies" },
    // { name: "Casts", icon: <Users size={20} />, path: "/Pages/Casts" },

    // { name: "Marriage Packages", icon: <Gift size={20} />, path: "/Pages/MarriagePackages" },
    // { name: "Relation", icon: <Heart size={20} />, path: "/Pages/Relation" },
    // { name: "User  Offer", icon: <Gift size={20} />, path: "/Pages/UserOffer" },
    // { name: "Vendors", icon: <Store size={20} />, path: "/Pages/Vendors" },
    // { name: "Settings", icon: <Settings size={20} /> },

  ];

  return (
    <div
      className={`h-screen flex flex-col 
  bg-slate-800 text-slate-200
  transition-all duration-300
  shadow-xl
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
          className="bg-[#F7FBFF] text-slate-800 p-1 rounded hover:bg-slate-700"
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
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-all
                ${isActive
                    ? "bg-[#F7FBFF] text-slate-800"
                    : "text-white hover:bg-[#F7FBFF] hover:text-slate-800"
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