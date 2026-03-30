"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Eye, Download } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API_URL =
  "http://143.110.244.163:5000/api/plan/get-all-payment-history";

const PaymentManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ================= LOAD PAYMENTS =================

  const loadPayments = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPayments(res.data.payments);
        setFiltered(res.data.payments);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // ================= SEARCH + FILTER =================

  useEffect(() => {
    let data = [...payments];

    if (search) {
      data = data.filter((p) => {
        const user = p.user || {};
        const plan = p.plan || {};

        return (
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          plan.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [search, statusFilter, payments]);

  // ================= ANALYTICS =================

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const success = payments.filter((p) => p.status === "paid").length;
  const failed = payments.filter((p) => p.status === "failed").length;

  // ================= PAGINATION =================

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  // ================= EXPORT CSV =================

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Plan", "Amount", "PaymentId", "Status"],
      ...payments.map((p) => [
        p?.user?.name,
        p?.user?.email,
        p?.plan?.name,
        p.amount,
        p.razorpayPaymentId,
        p.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "payments.csv";
    link.click();
  };

  return (
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

      {/* Main */}

      <div className="flex-1 flex flex-col">

        <Header />

        <div className="p-6 space-y-6">

          {/* Page Title */}

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Payment Management
            </h1>

            <button
              onClick={exportCSV}
              className="flex gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* Analytics Cards */}

          <div className="grid grid-cols-4 gap-4">

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Revenue</p>
             <h2 className="text-2xl font-bold text-green-600">
  ₹{Math.round(totalRevenue)}
</h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Payments</p>
              <h2 className="text-2xl font-bold">
                {payments.length}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Successful</p>
              <h2 className="text-2xl font-bold text-green-600">
                {success}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Failed</p>
              <h2 className="text-2xl font-bold text-red-600">
                {failed}
              </h2>
            </div>

          </div>

          {/* Filters */}

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Search payments..."
              className="border p-2 rounded w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >

              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>

            </select>

          </div>

          {/* Table */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-800 text-white">

                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Payment ID</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>

              </thead>

              <tbody>

                {paginated.map((p) => (

                  <tr key={p._id} className="border-t hover:bg-gray-50">

                    <td className="p-3">{p?.user?.name}</td>

                    <td className="p-3">{p?.user?.email}</td>

                    <td className="p-3">{p?.plan?.name}</td>

                    <td className="p-3 font-semibold text-green-600">
                      ₹{p.amount}
                    </td>

                    <td className="p-3 text-sm">
                      {p.razorpayPaymentId}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-2 py-1 text-xs rounded text-white ${
                          p.status === "paid"
                            ? "bg-green-600"
                            : p.status === "failed"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {p.status}
                      </span>

                    </td>

                    <td className="p-3 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">

                      <button
                        className="text-blue-500"
                        onClick={() => setSelected(p)}
                      >
                        <Eye size={18} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}

          <div className="flex justify-center gap-3">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>

          </div>

        </div>
      </div>

      {/* Modal */}

      {selected && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-semibold mb-4">
              Payment Details
            </h2>

            <p><b>Name:</b> {selected?.user?.name}</p>
            <p><b>Email:</b> {selected?.user?.email}</p>
            <p><b>Plan:</b> {selected?.plan?.name}</p>
            <p><b>Amount:</b> ₹{selected.amount}</p>
            <p><b>Payment ID:</b> {selected.razorpayPaymentId}</p>
            <p><b>Status:</b> {selected.status}</p>

            <button
              onClick={() => setSelected(null)}
              className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
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