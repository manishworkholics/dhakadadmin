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

      {/* MAIN */}

      <div className="flex-1 flex flex-col h-screen">

        <Header />

        <div className="flex-1 overflow-y-auto p-6">

          <h1 className="text-2xl font-bold mb-6">Testimonials / Reviews</h1>

          {/* ================= PENDING ================= */}

          <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {pending?.map((item) => (
              <div key={item?._id} className="bg-white p-4 rounded shadow">

                <p className="font-bold">{item?.title}</p>

                <p className="text-yellow-500">
                  {"⭐".repeat(item?.rating || 5)}
                </p>

                <p className="text-gray-600 mt-2">
                  {item?.comment}
                </p>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => approveReview(item?._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectReview(item?._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => deleteReview(item?._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* ================= APPROVED ================= */}

          <h2 className="text-xl font-semibold mb-4">Approved Reviews</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {approved?.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow">

                <p className="font-bold">{item?.title}</p>

                <p className="text-yellow-500">
                  {"⭐".repeat(item?.rating || 5)}
                </p>

                <p className="text-gray-600 mt-2">
                  {item?.comment}
                </p>

                <button
                  onClick={() => deleteReview(item?._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded mt-4"
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