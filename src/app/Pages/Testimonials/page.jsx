"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "../Common_Method/protectedroute.js";

import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const API = "http://143.110.244.163:5000/api/review";

const Page = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken")
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

  const fetchReviews = async () => {
    const res = await axios.get(`${API}/testimonials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(res.data.data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approved = reviews.filter((r) => r.isApproved);
  const pending = reviews.filter((r) => !r.isApproved);

  const avgRating =
    approved.reduce((acc, r) => acc + (r.rating || 0), 0) /
    (approved.length || 1);

  const filteredReviews = reviews.filter((r) =>
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStarClick = (value) => {
    setForm({ ...form, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/admin/update-review/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${API}/admin/add-review`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({ title: "", rating: 5, comment: "", reviewerName: "" });
    setEditingId(null);
    fetchReviews();
  };

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

  const deleteReview = async (id) => {
    await axios.delete(`${API}/admin/delete-review/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const approveReview = async (id) => {
    await axios.patch(`${API}/admin/status/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  return (
    <AdminShell>
      <Card className="p-4 md:p-6">

        <PageHeader title="Review Management" />

        {/* 🔥 ANALYTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <h2 className="text-xl font-bold">{reviews.length}</h2>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Approved</p>
            <h2 className="text-xl font-bold">{approved.length}</h2>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <h2 className="text-xl font-bold">{pending.length}</h2>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Avg Rating</p>
            <h2 className="text-xl font-bold">{avgRating.toFixed(1)}</h2>
          </Card>

        </div>

        {/* 🔍 SEARCH */}
        <div className="mt-6 max-w-md">
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🔥 FORM */}
        <Card className="p-5 mt-6">

          <h2 className="font-semibold mb-4">
            {editingId ? "Edit Review" : "Add Review"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <Input
              name="reviewerName"
              placeholder="Reviewer Name"
              value={form.reviewerName}
              onChange={handleChange}
            />

            <Input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />

          </div>

          {/* ⭐ STARS */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={`text-2xl cursor-pointer ${
                  star <= form.rating
                    ? "text-yellow-400"
                    : "text-muted-foreground"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              name="comment"
              placeholder="Comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <Button className="mt-4">
            {editingId ? "Update Review" : "Add Review"}
          </Button>

        </Card>

        {/* 🔥 LIST */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">

          {filteredReviews.map((r) => (

            <Card key={r._id} className="p-4 space-y-2">

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{r.title}</h3>
                <Badge variant={r.isApproved ? "success" : "warning"}>
                  {r.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>

              <div className="text-yellow-400">
                {"★".repeat(r.rating)}
              </div>

              <p className="text-sm text-muted-foreground">
                {r.comment}
              </p>

              <p className="text-xs text-muted-foreground">
                {r.reviewerName || "Anonymous"}
              </p>

              <div className="flex gap-2 pt-2">

                {!r.isApproved && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => approveReview(r._id)}
                  >
                    Approve
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(r)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteReview(r._id)}
                >
                  Delete
                </Button>

              </div>

            </Card>

          ))}

        </div>

      </Card>
    </AdminShell>
  );
};

export default ProtectedRoute(Page);