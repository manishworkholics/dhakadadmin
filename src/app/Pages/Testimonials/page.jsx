"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const API = "http://143.110.244.163:5000/api/review";

const Page = () => {

  const [reviews, setReviews] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/testimonials`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(res.data.data || res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Approve Review
  const approveReview = async (id) => {
    try {
      await axios.patch(
        `${API}/admin/status/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  // Reject Review
  const rejectReview = async (id) => {
    try {
      await axios.patch(
        `${API}/admin/status/${id}?status=rejected`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Review
  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const approved = reviews.filter((r) => r.isApproved === true);
  const pending = reviews.filter((r) => r.isApproved === false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}

      <div className="hidden lg:block h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar collapsed={false} setCollapsed={() => { }} />
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* MAIN AREA */}

      <div className="flex-1 flex flex-col h-screen">

        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F7FBFF]">

          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Testimonials / Reviews
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Pending Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-xl">📥</span>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm">Pending Reviews</h4>
                <h2 className="text-2xl font-bold text-gray-900">
                  {pending?.length || 0}
                </h2>
              </div>
            </div>

            {/* Approved Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xl">✔</span>
              </div>

              <div>
                <h4 className="text-gray-500 text-sm">Approved Reviews</h4>
                <h2 className="text-2xl font-bold text-gray-900">
                  {approved?.length || 0}
                </h2>
              </div>
            </div>
          </div>
          {/* ================= PENDING ================= */}

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

            {pending?.map((item) => (
              <div
                key={item?._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-lg transition-all duration-300"
              >

                <h3 className="font-semibold text-gray-900">
                  {item?.title}
                </h3>

                <div className="text-yellow-400 mt-1 text-lg">
                  {"⭐".repeat(item?.rating || 5)}
                </div>

                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {item?.comment}
                </p>

                <div className="flex gap-2 mt-5">

                  <button
                    onClick={() => approveReview(item?._id)}
                    className="bg-green-400 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-md transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectReview(item?._id)}
                    className="bg-indigo-400 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => deleteReview(item?._id)}
                    className="bg-rose-400 hover:bg-rose-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ================= APPROVED ================= */}

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Approved Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {approved?.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-lg transition-all duration-300"
              >

                <h3 className="font-semibold text-gray-900">
                  {item?.title}
                </h3>

                <div className="text-yellow-400 mt-1 text-lg">
                  {"⭐".repeat(item?.rating || 5)}
                </div>

                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {item?.comment}
                </p>

                <button
                  onClick={() => deleteReview(item?._id)}
                  className="mt-5 bg-rose-400 hover:bg-rose-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProtectedRoute(Page);