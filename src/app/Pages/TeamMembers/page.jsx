"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

import { handleApiError } from "@/utils/apiErrorHandler.js";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, X } from "lucide-react";

const API_LIST = "https://dhakadmatrimony.com/api/team/admin";
const API_BASE = "https://dhakadmatrimony.com/api/team";
const API_UPLOAD = "https://dhakadmatrimony.com/api/upload-image";

const Page = () => {


  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    photo: "",
    post: "",
    order: "",
    status: true,
  });

  const [uploading, setUploading] = useState(false);

  const isEditing = Boolean(editingId);

  const normalizedMembers = useMemo(() => {
    return (members || []).map((m) => {
      const statusVal =
        typeof m?.status === "boolean"
          ? m.status
          : String(m?.status || "").toLowerCase() === "active";

      return {
        _id: m?._id || m?.id,
        name: m?.name || "",
        phone: m?.phone || m?.mobile || "",
        photo: m?.photo || m?.image || "",
        post: m?.post || m?.position || "",
        order:
          typeof m?.order === "number"
            ? m.order
            : typeof m?.order === "string"
            ? Number(m.order)
            : typeof m?.sortOrder === "number"
            ? m.sortOrder
            : "",
        status: statusVal,
        raw: m,
      };
    });
  }, [members]);

  // ================= FETCH =================
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_LIST);
      setMembers(res.data?.team || res.data?.members || res.data?.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await axios.post(API_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          photo: res.data.url,
        }));
        toast.success("Image uploaded");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  // ================= FORM =================
  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      photo: "",
      post: "",
      order: "",
      status: true,
    });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || "",
      phone: member.phone || "",
      photo: member.photo || "",
      post: member.post || "",
      order: member.order === "" ? "" : String(member.order ?? ""),
      status: Boolean(member.status),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.photo) {
      toast.error("Upload image first");
      return;
    }

    const payload = {
      name: form.name,
      phone: form.phone,
      photo: form.photo,
      post: form.post,
      order: form.order === "" ? "" : Number(form.order),
      status: form.status,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, payload);
        toast.success("Member updated");
      } else {
        await axios.post(API_BASE, payload);
        toast.success("Member added");
      }

      closeModal();
      fetchMembers();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      toast.success("Deleted");
      fetchMembers();
    } catch (error) {
      handleApiError(error);
    }
  };

return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader
        title="Team Members"
        actions={
          <Button onClick={openAdd} className="flex gap-2">
            <Plus size={16} />
            Add Member
          </Button>
        }
      />

      {/* ================= TABLE ================= */}
      <div className="mt-6">
        <Table
          columns={[
            {
              key: "photo",
              header: "Photo",
              render: (m) =>
                m.photo ? (
                  <img
                    src={m.photo}
                    className="h-12 w-12 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted border" />
                ),
            },
            { key: "name", header: "Name" },
            { key: "phone", header: "Phone" },
            { key: "post", header: "Post" },
            {
              key: "order",
              header: "Order",
              render: (m) => (m.order !== "" ? m.order : "-"),
            },
            {
              key: "status",
              header: "Status",
              render: (m) => (
                <Badge variant={m.status ? "success" : "secondary"}>
                  {m.status ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Action",
              render: (m) => (
                <div className="flex gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(m)}
                  >
                    <Pencil size={14} />
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(m._id)}
                  >
                    <Trash2 size={14} />
                  </Button>

                </div>
              ),
            },
          ]}
          rows={normalizedMembers}
          loading={loading}
          emptyText="No team members found"
        />
      </div>

    </Card>

    {/* ================= MODAL ================= */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

        <Card className="p-6 w-[600px]">

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              {isEditing ? "Update Member" : "Add Member"}
            </h2>

            <button onClick={closeModal}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-2 gap-4">

              <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              <Input name="post" value={form.post} onChange={handleChange} placeholder="Post" />
              <Input name="order" value={form.order} onChange={handleChange} placeholder="Order" />

              <div className="md:col-span-2">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="border rounded-lg p-2 w-full"
                />

                {uploading && (
                  <p className="text-sm text-primary mt-2">
                    Uploading...
                  </p>
                )}

                {form.photo && (
                  <img
                    src={form.photo}
                    className="h-20 mt-2 rounded border object-cover"
                  />
                )}
              </div>

              <label className="md:col-span-2 flex items-center gap-3 border rounded-lg p-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                />
                <span className="text-sm">
                  Status: {form.status ? "Active" : "Inactive"}
                </span>
              </label>

            </div>

            <div className="flex gap-3">

              <Button type="submit" disabled={submitting || uploading}>
                {submitting
                  ? "Saving..."
                  : isEditing
                  ? "Update"
                  : "Create"}
              </Button>

              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>

            </div>

          </form>

        </Card>

      </div>
    )}

  </AdminShell>
);
};

export default ProtectedRoute(Page);