"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "../Common_Method/protectedroute.js";

import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import RichTextEditor from "@webbycrown/react-advanced-richtext-editor";

const API_URL = "http://143.110.244.163:5000/api/plan";

const formatFeaturesForEditor = (features = []) => {
  if (!Array.isArray(features) || features.length === 0) {
    return "";
  }

  const items = features
    .filter((feature) => feature?.trim())
    .map((feature) => `<li>${feature.trim()}</li>`)
    .join("");

  return `<ul>${items}</ul>`;
};

const parseFeaturesFromEditor = (content = "") => {
  return content
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split(/\n|,/)
    .map((feature) => feature.replace(/\s+/g, " ").trim())
    .filter(Boolean);
};

const Plan = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    gstPercent: "",
    durationMonths: "",
    offerPrice: "",
    actualPrice: "",
    description: "",
    features: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admintoken")
      : null;

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      gstPercent: Number(form.gstPercent),
      durationMonths: Number(form.durationMonths),
      offerPrice: form.offerPrice ? Number(form.offerPrice) : undefined,
      actualPrice: form.actualPrice ? Number(form.actualPrice) : undefined,
      features: parseFeaturesFromEditor(form.features),
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
  offerPrice: "",
  actualPrice: "",
  description: "",
  features: "",
});
      setEditMode(false);
      loadPlans();
    } catch {
      toast.error("Failed to save plan");
    }
  };
  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      price: plan.price,
      gstPercent: plan.gstPercent,
      durationMonths: plan.durationMonths,
      offerPrice: plan.offerPrice || "",
      actualPrice: plan.actualPrice || "",
      description: plan.description || "",
      features: formatFeaturesForEditor(plan.features),
    });
    setEditId(plan._id);
    setEditMode(true);
  };

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
    <AdminShell>
      <ToastContainer />

      <Card className="p-4 md:p-6">

        <PageHeader title="Plan Management" />

        {/* FORM */}
        <Card className="p-5 mt-4">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Plan Name"
              />

              <Input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
              />

              <Input
                name="gstPercent"
                value={form.gstPercent}
                onChange={handleChange}
                placeholder="GST %"
                type="number"
              />

              <Input
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                placeholder="Duration (Months)"
                type="number"
              />

              <Input
                name="offerPrice"
                value={form.offerPrice}
                onChange={handleChange}
                placeholder="Offer Price"
                type="number"
              />

              <Input
                name="actualPrice"
                value={form.actualPrice}
                onChange={handleChange}
                placeholder="Actual Price"
                type="number"
              />

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Plan description..."
                  className="w-full mt-2 border rounded-lg p-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Features
                </label>
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={form.features}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, features: value }))
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add each feature on a new line or as bullet points.
                </p>
              </div>

            </div>

            <Button className="mt-4" type="submit">
              {editMode ? "Update Plan" : "Create Plan"}
            </Button>
          </form>
        </Card>

        {/* TABLE */}
        <div className="mt-6">
          <Table
          columns={[
  { key: "name", header: "Name" },

  {
    key: "price",
    header: "Pricing",
    render: (p) => (
      <div className="flex flex-col">
        <span className="font-semibold">
          ₹{p.offerPrice || p.price}
        </span>

        {p.actualPrice && (
          <span className="text-xs line-through text-gray-400">
            ₹{p.actualPrice}
          </span>
        )}

        <span className="text-xs text-muted-foreground">
          + {p.gstPercent}% GST
        </span>
      </div>
    ),
  },

  {
    key: "durationMonths",
    header: "Duration",
    render: (p) => `${p.durationMonths} Months`,
  },

  {
    key: "description",
    header: "Description",
    render: (p) => (
      <span className="text-sm text-gray-600 line-clamp-2">
        {p.description || "-"}
      </span>
    ),
  },

  {
    key: "features",
    header: "Features",
    render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.features.map((f, i) => (
          <Badge key={i} variant="secondary">
            {f}
          </Badge>
        ))}
      </div>
    ),
  },

  {
    key: "status",
    header: "Status",
    render: (p) => (
      <Badge variant={p.isActive ? "success" : "destructive"}>
        {p.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },

  {
    key: "actions",
    header: "Action",
    render: (p) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(p)}
        >
          Edit
        </Button>

        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(p._id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
]}
            rows={plans}
            emptyText="No plans yet"
          />
        </div>

      </Card>
    </AdminShell>
  );
};

export default ProtectedRoute(Plan);
