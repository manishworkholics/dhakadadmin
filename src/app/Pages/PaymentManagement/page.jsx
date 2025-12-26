"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Eye, FileDown, RefreshCw } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api/plan/get-all-payment-history";

const PaymentManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const loadPayments = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPayments(res.data.plans || []);
        setFiltered(res.data.plans || []);
      }
    } catch (err) {
      console.log("Error loading payment history:", err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Search Filter
  useEffect(() => {
    const list = payments.filter((p) => {
      const user = p.user || {};
      const plan = p.plan || {};

      return (
        (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (plan.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.razorpayPaymentId || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.status || "").toLowerCase().includes(search.toLowerCase())
      );
    });
    setFiltered(list);
    setPage(1);
  }, [search, payments]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300
          lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        ></div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="items-center justify-between">
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>
          <Header />
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Payment Management</h2>

          {/* 🔍 Search */}
          <input
            type="text"
            className="border rounded p-2 w-full mb-4"
            placeholder="Search by name, email, plan, paymentId, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Table */}
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Payment ID</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">{item?.user?.name || "-"}</td>
                    <td className="p-2">{item?.user?.email || "-"}</td>
                    <td className="p-2">{item?.plan?.name || "-"}</td>
                    <td className="p-2">₹{item.amount}</td>
                    <td className="p-2">{item.razorpayPaymentId || "-"}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          item.status === "paid"
                            ? "bg-green-600"
                            : item.status === "failed"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 flex gap-3">
                      <button
                        className="text-blue-500 flex gap-1 items-center"
                        onClick={() => setSelected(item)}
                      >
                        <Eye size={16} /> View
                      </button>
                      <button className="text-gray-500 flex gap-1 items-center" disabled>
                        <FileDown size={16} /> Invoice
                      </button>
                      <button className="text-orange-500 flex gap-1 items-center" disabled>
                        <RefreshCw size={16} /> Resend
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="text-center text-gray-500 italic p-4"
                    colSpan={8}
                  >
                    No payment found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-3">
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 rounded ${
                  page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 rounded ${
                  page >= totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Payment Details</h3>

            <p><strong>Name:</strong> {selected?.user?.name}</p>
            <p><strong>Email:</strong> {selected?.user?.email}</p>
            <p><strong>Plan:</strong> {selected?.plan?.name}</p>
            <p><strong>Amount:</strong> ₹{selected.amount}</p>
            <p><strong>Payment ID:</strong> {selected.razorpayPaymentId}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p className="text-sm text-gray-500 mt-2">
              Date: {new Date(selected.createdAt).toLocaleString()}
            </p>

            <button
              className="bg-red-500 w-full mt-4 py-2 text-white rounded"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute(PaymentManagement);
