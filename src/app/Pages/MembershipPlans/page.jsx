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

const API_URL = "http://143.110.244.163:5000/api/plan";

const Plan = () => {
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
      features: form.features.split(",").map((f) => f.trim()),
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

            <div className="md:col-span-2">
              <Input
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="Features (comma separated)"
              />
            </div>

          </div>

          <Button className="mt-4">
            {editMode ? "Update Plan" : "Create Plan"}
          </Button>

        </Card>

        {/* TABLE */}
        <div className="mt-6">
          <Table
            columns={[
              { key: "name", header: "Name" },
              {
                key: "price",
                header: "Price",
                render: (p) => (
                  <span>
                    ₹{p.price}{" "}
                    <span className="text-xs text-muted-foreground">
                      + {p.gstPercent}% GST
                    </span>
                  </span>
                ),
              },
              {
                key: "durationMonths",
                header: "Duration",
                render: (p) => `${p.durationMonths} Months`,
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