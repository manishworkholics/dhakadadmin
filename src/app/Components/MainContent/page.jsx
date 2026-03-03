"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  Users, DollarSign, Activity, Heart,
  Image, AlertTriangle,
  Clock,
  ShieldOff,
  MessageCircle,
} from "lucide-react";

const monthNames = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const page = () => {
  const [dashboard, setDashboard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // ================= FETCH API DIRECTLY =================
  useEffect(() => {
    fetch("http://143.110.244.163:5000/api/admin/dashboard")
      .then(res => res.json())
      .then(res => {
        setDashboard(res);
      });
  }, []);

  if (!dashboard) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const { stats, userGrowth, revenueOverview, recentActivities } = dashboard;

  // convert for charts
  const userChartData = userGrowth.map(d => ({
    name: monthNames[d.month],
    users: d.count
  }));

  const revenueChartData = revenueOverview.map(d => ({
    name: monthNames[d.month],
    revenue: d.amount
  }));

  return (
    <div className="min-h-screen bg-[#F7FBFF]">
      <div className="p-6 space-y-8 w-full max-w-none">

        {/* ================= TOP CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Users */}
          <div className="rounded-2xl p-5 
  bg-gradient-to-br from-blue-50 to-blue-100 
  border border-blue-100
  transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Users
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.totalUsers}
                </p>

                <div className="mt-3 text-xs text-blue-600 font-medium">
                  +7% this month
                </div>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-200 flex items-center justify-center">
                <Users className="text-blue-700" size={20} />
              </div>

            </div>
          </div>


          {/* Active Matches */}
          <div className="rounded-2xl p-5 
  bg-gradient-to-br from-pink-50 to-pink-100 
  border border-pink-100
  transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Active Matches
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.activeMatches}
                </p>

                <div className="mt-3 text-xs text-pink-600 font-medium">
                  +20% this month
                </div>
              </div>

              <div className="w-11 h-11 rounded-xl bg-pink-200 flex items-center justify-center">
                <Heart className="text-pink-700" size={20} />
              </div>

            </div>
          </div>


          {/* Revenue */}
          <div className="rounded-2xl p-5 
  bg-gradient-to-br from-green-50 to-green-100 
  border border-green-100
  transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Revenue
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ₹ {stats.revenue}
                </p>

                <div className="mt-3 text-xs text-green-600 font-medium">
                  +42% this month
                </div>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-200 flex items-center justify-center">
                <DollarSign className="text-green-700" size={20} />
              </div>

            </div>
          </div>


          {/* Active Today */}
          <div className="rounded-2xl p-5 
  bg-gradient-to-br from-yellow-50 to-yellow-100 
  border border-yellow-100
  transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Active Today
                </p>

                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.activeToday}
                </p>

                <div className="mt-3 text-xs text-yellow-600 font-medium">
                  0% today
                </div>
              </div>

              <div className="w-11 h-11 rounded-xl bg-yellow-200 flex items-center justify-center">
                <Activity className="text-yellow-700" size={20} />
              </div>

            </div>
          </div>

        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* User Growth */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">User Growth</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">Revenue Overview</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ================= RECENT ACTIVITIES ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h3>
              <button
                onClick={() => setOpenModal(true)}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg transition cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* List */}
            <ul className="space-y-4">
              {recentActivities.map((item, index) => {

                // Extract name from message (first word)
                const name = item.message?.split(" ")[0] || "User";

                // Detect type from message
                const type =
                  item.message?.toLowerCase().includes("purchased")
                    ? "purchased"
                    : item.message?.toLowerCase().includes("reported")
                      ? "reported"
                      : "registered";

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-xl px-4 py-3"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">

                      {/* Blue Dot */}
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                        {name.charAt(0)}
                      </div>

                      {/* Message */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-800 font-medium">
                          {name}
                        </span>

                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium
                  ${type === "registered"
                              ? "bg-blue-100 text-blue-600"
                              : type === "purchased"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                        >
                          {type}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {timeAgo(item.time)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ================= ACTION CENTER ================= */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Action Center
              </h3>
              <button className="text-sm bg-slate-800 hover:bg-slate-800 text-white px-3 py-1 rounded-lg transition cursor-pointer">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Pending Profile Approvals */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Pending Profile Approvals
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.pendingApprovals}
                    </p>
                    <div className="mt-3 text-xs text-blue-600 font-medium">
                      Needs review
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-200 flex items-center justify-center">
                    <Users className="text-blue-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Pending Photo Verification */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Pending Photo Verification
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.pendingPhotos}
                    </p>
                    <div className="mt-3 text-xs text-pink-600 font-medium">
                      Awaiting approval
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-pink-200 flex items-center justify-center">
                    <Image className="text-pink-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Reported Users */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-red-100 border border-red-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Reported Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.reportedUsers}
                    </p>
                    <div className="mt-3 text-xs text-red-600 font-medium">
                      Needs attention
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-red-200 flex items-center justify-center">
                    <AlertTriangle className="text-red-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Expiring Memberships */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Expiring Memberships
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.expiringMemberships}
                    </p>
                    <div className="mt-3 text-xs text-yellow-600 font-medium">
                      Expiring soon
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-yellow-200 flex items-center justify-center">
                    <Clock className="text-yellow-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Blocked Users */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Blocked Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.blockedUsers}
                    </p>
                    <div className="mt-3 text-xs text-gray-600 font-medium">
                      Restricted accounts
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center">
                    <ShieldOff className="text-gray-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Unread Support Requests */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Unread Support Requests
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {stats.unreadSupport}
                    </p>
                    <div className="mt-3 text-xs text-indigo-600 font-medium">
                      Requires response
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-indigo-200 flex items-center justify-center">
                    <MessageCircle className="text-indigo-700" size={20} />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          {/* Modal Box */}
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All Recent Activities
              </h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable List */}
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">

              {recentActivities.map((item, index) => {

                const name = item.message?.split(" ")[0] || "User";

                const type =
                  item.message?.toLowerCase().includes("purchased")
                    ? "purchased"
                    : item.message?.toLowerCase().includes("reported")
                      ? "reported"
                      : "registered";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>

                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                        {name.charAt(0)}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {name}
                        </span>

                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium
                    ${type === "registered"
                              ? "bg-blue-100 text-blue-600"
                              : type === "purchased"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                        >
                          {type}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {timeAgo(item.time)}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;


/* ================= SMALL REUSABLE CARD ================= */
function Card({ title, value, icon, bg }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-black">{value}</h2>
      </div>
      <div className={`${bg} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
}


/* ================= TIME FORMAT ================= */
function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";

  return Math.floor(diff / 86400) + " days ago";
}
