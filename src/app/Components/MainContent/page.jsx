"use client";
import React from "react";
import Header from "../../Components/Header/page.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Users, DollarSign, Activity, Heart } from "lucide-react";

const page = () => {
  // Dummy data for charts
  const data = [
    { name: "Jan", users: 400, revenue: 240 },
    { name: "Feb", users: 300, revenue: 139 },
    { name: "Mar", users: 200, revenue: 980 },
    { name: "Apr", users: 278, revenue: 390 },
    { name: "May", users: 189, revenue: 480 },
  ];

  return (
    <div className="min-h-screen bg-[#F7FBFF]">
      <Header />

      <div className="p-6 space-y-8">
        {/* Top 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h2 className="text-2xl font-bold text-black">12,430</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-500" size={28} />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Matches</p>
              <h2 className="text-2xl font-bold text-black">2,140</h2>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="text-pink-500" size={28} />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <h2 className="text-2xl font-bold text-black">$84,300</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-500" size={28} />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Today</p>
              <h2 className="text-2xl font-bold text-black">530</h2>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Activity className="text-yellow-500" size={28} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-black">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Analytics Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Recent Activities</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between">
              <span className="text-gray-700">New user registered: <strong>Priya Sharma</strong></span>
              <span className="text-sm text-gray-500">5 min ago</span>
            </li>
            <li className="py-3 flex justify-between">
              <span className="text-gray-700">Subscription upgraded: <strong>Rahul Verma</strong></span>
              <span className="text-sm text-gray-500">15 min ago</span>
            </li>
            <li className="py-3 flex justify-between">
              <span className="text-gray-700">Profile approved: <strong>Anjali Singh</strong></span>
              <span className="text-sm text-gray-500">30 min ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;
