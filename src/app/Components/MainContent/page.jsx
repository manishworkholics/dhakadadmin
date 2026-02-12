"use client";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/page.jsx";
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
import { Users, DollarSign, Activity, Heart } from "lucide-react";

const monthNames = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const page = () => {
  const [dashboard, setDashboard] = useState(null);

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
      <Header />

      <div className="p-6 space-y-8">

        {/* ================= TOP CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* Total Users */}
  <div className="relative bg-white rounded-xl shadow-sm flex items-center pe-4 py-3 w-[375px] overflow-hidden hover:shadow-md transition-all duration-200">
    
    {/* FULL HEIGHT STRIP */}
    <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-blue-600 to-blue-400"></div>

    <div className="ml-4 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-5">
      <Users className="text-blue-600" size={18} />
    </div>

    <div className="leading-tight">
      <h5 className="text-md text-gray-500">Total Users</h5>
      <p className="text-lg font-semibold text-gray-900">
        {stats.totalUsers}
      </p>
    </div>
  </div>

  {/* Active Matches */}
  <div className="relative bg-white rounded-xl shadow-sm flex items-center pe-4 py-3 w-[375px] overflow-hidden hover:shadow-md transition-all duration-200">
    <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-pink-600 to-pink-400"></div>

    <div className="ml-4 w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mr-5">
      <Heart className="text-pink-600" size={18} />
    </div>

    <div className="leading-tight">
      <h5 className="text-md text-gray-500">Active Matches</h5>
      <p className="text-lg font-semibold text-gray-900">
        {stats.activeMatches}
      </p>
    </div>
  </div>

  {/* Revenue */}
  <div className="relative bg-white rounded-xl shadow-sm flex items-center pe-4 py-3 w-[375px] overflow-hidden hover:shadow-md transition-all duration-200">
    <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-green-600 to-green-400"></div>

    <div className="ml-4 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-5">
      <DollarSign className="text-green-600" size={18} />
    </div>

    <div className="leading-tight">
      <h5 className="text-md text-gray-500">Revenue</h5>
      <p className="text-lg font-semibold text-gray-900">
        ₹ {stats.revenue}
      </p>
    </div>
  </div>

  {/* Active Today */}
  <div className="relative bg-white rounded-xl shadow-sm flex items-center pe-4 py-3 w-[375px] overflow-hidden hover:shadow-md transition-all duration-200">
    <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-yellow-500 to-yellow-300"></div>

    <div className="ml-4 w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center mr-5">
      <Activity className="text-yellow-500" size={18} />
    </div>

    <div className="leading-tight">
      <h5 className="text-md text-gray-500">Active Today</h5>
      <p className="text-lg font-semibold text-gray-900">
        {stats.activeToday}
      </p>
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


        {/* ================= RECENT ACTIVITIES ================= */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4 text-black">Recent Activities</h3>

          <ul className="divide-y divide-gray-200">
            {recentActivities.map((item, index) => (
              <li key={index} className="py-3 flex justify-between">
                <span className="text-gray-700">{item.message}</span>
                <span className="text-sm text-gray-500">
                  {timeAgo(item.time)}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
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
