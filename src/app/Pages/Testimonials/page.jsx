"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://143.110.244.163:5000/api/review";

const Page = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    rating: 5,
    comment: "",
    reviewerName: "",
  });

  // ================= FETCH =================
  const fetchReviews = async () => {
    const res = await axios.get(`${API}/testimonials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(res.data.data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= STATS =================
  const approved = reviews.filter((r) => r.isApproved);
  const pending = reviews.filter((r) => !r.isApproved);

  const avgRating =
    approved.reduce((acc, r) => acc + (r.rating || 0), 0) /
    (approved.length || 1);

  // ================= SEARCH =================
  const filteredReviews = reviews.filter((r) =>
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= STAR CLICK =================
  const handleStarClick = (value) => {
    setForm({ ...form, rating: value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `${API}/admin/update-review/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        `${API}/admin/add-review`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setForm({ title: "", rating: 5, comment: "", reviewerName: "" });
    setEditingId(null);
    fetchReviews();
  };

  // ================= EDIT =================
  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm({
      title: r.title,
      rating: r.rating,
      comment: r.comment,
      reviewerName: r.reviewerName || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const deleteReview = async (id) => {
    await axios.delete(`${API}/admin/delete-review/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  // ================= APPROVE =================
  const approveReview = async (id) => {
    await axios.patch(`${API}/admin/status/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <div className="p-6 overflow-y-auto">

          <h1 className="text-2xl font-bold mb-6">
            Review Management
          </h1>

          {/* 🔥 ANALYTICS */}
          <div className="grid grid-cols-4 gap-4 mb-6">

            <Card title="Total" value={reviews.length} />
            <Card title="Approved" value={approved.length} />
            <Card title="Pending" value={pending.length} />
            <Card title="Avg Rating" value={avgRating.toFixed(1)} />

          </div>

          {/* 🔍 SEARCH */}
          <input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded w-full mb-6"
          />

          {/* 🔥 FORM */}
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow mb-8">

            <h2 className="font-bold mb-4">
              {editingId ? "Edit Review" : "Add Review"}
            </h2>

            <input
              name="reviewerName"
              placeholder="Reviewer Name"
              value={form.reviewerName}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            {/* ⭐ STAR UI */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-2xl cursor-pointer ${star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              name="comment"
              placeholder="Comment"
              value={form.comment}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <button className="bg-green-600 text-white px-5 py-2 rounded">
              {editingId ? "Update" : "Add"}
            </button>

          </form>

          {/* 🔥 LIST */}
          <div className="grid md:grid-cols-3 gap-6">

            {filteredReviews.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded shadow">

                <h3 className="font-bold">{r.title}</h3>

                <div className="text-yellow-400">
                  {"★".repeat(r.rating)}
                </div>

                <p className="text-sm mt-2">{r.comment}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {r.reviewerName || "Anonymous"}
                </p>

                <div className="flex gap-2 mt-3">

                  {!r.isApproved && (
                    <button
                      onClick={() => approveReview(r._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteReview(r._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

// 🔥 SMALL CARD COMPONENT
const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <h4 className="text-gray-500">{title}</h4>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

export default ProtectedRoute(Page);