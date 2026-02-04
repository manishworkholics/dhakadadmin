"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://143.110.244.163:5000/api/plan";

const Plan = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    gstPercent: "",
    durationMonths: "",
    features: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  /* ---------- Fetch All Plans ---------- */
  const loadPlans = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setPlans(res.data.plans);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  /* ---------- Handle Input change ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- Create / Update Plan ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      features: form.features.split(",").map((f) => f.trim()), // convert CSV → array
    };

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editMode) {
        await axios.put(`${API_URL}/plans/${editId}`, payload, { headers });
        toast.success("Plan updated!");
      } else {
        await axios.post(`${API_URL}/plans`, payload, { headers });
        toast.success("Plan created!");
      }

      setForm({
        name: "",
        price: "",
        gstPercent: "",
        durationMonths: "",
        features: "",
      });
      setEditMode(false);
      loadPlans();
    } catch {
      toast.error("Failed to save plan");
    }
  };

  /* ---------- Edit Plan ---------- */
  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      price: plan.price,
      gstPercent: plan.gstPercent,
      durationMonths: plan.durationMonths,
      features: plan.features.join(", "),
    });
    setEditId(plan._id);
    setEditMode(true);
  };

  /* ---------- Delete Plan ---------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete plan?")) return;
    try {
      await axios.delete(`${API_URL}/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plan deleted");
      loadPlans();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg 
          transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="items-center justify-between">
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <Header />
          </div>

          {/* Main Content */}
          <div className="p-6 overflow-auto">
            <h1 className="text-2xl font-semibold mb-3">Manage Plans</h1>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-3"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input border p-2 rounded"
                placeholder="Plan Name"
                required
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="form-input border p-2 rounded"
                placeholder="Price"
                type="number"
                required
              />
              <input
                name="gstPercent"
                value={form.gstPercent}
                onChange={handleChange}
                className="form-input border p-2 rounded"
                placeholder="GST %"
                type="number"
                required
              />
              <input
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                className="form-input border p-2 rounded"
                placeholder="Duration (Months)"
                type="number"
                required
              />
              <input
                name="features"
                value={form.features}
                onChange={handleChange}
                className="form-input border p-2 rounded col-span-2"
                placeholder="Features (comma separated)"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
              >
                {editMode ? "Update Plan" : "Create Plan"}
              </button>
            </form>

            {/* Plans Table */}
            <table className="table-auto w-full bg-white rounded shadow text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Features</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p._id} className="border">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">₹{p.price} + {p.gstPercent}% GST</td>
                    <td className="p-2">{p.durationMonths} Months</td>
                    <td className="p-2">{p.features.join(", ")}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="text-blue-600"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {plans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-3 text-gray-500">
                      No plans yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtectedRoute(Plan);
