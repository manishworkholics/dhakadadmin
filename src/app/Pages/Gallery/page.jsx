"use client";
import React, { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/api.js";


const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: "",
      order: "",
      status: true,
    },
  });

  const imageUrl = watch("image");
  const statusVal = watch("status");

  const sortedItems = useMemo(() => {
    return [...(items || [])].sort((a, b) => {
      const ao = Number(a?.order ?? 0);
      const bo = Number(b?.order ?? 0);
      return ao - bo;
    });
  }, [items]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/gallery");
      setItems(res.data?.gallery || res.data?.items || res.data?.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onClose = () => {
    setOpen(false);
    setEditingId(null);
    reset({
      title: "",
      description: "",
      image: "",
      order: "",
      status: true,
    });
  };

  const onAdd = () => {
    onClose();
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditingId(row._id || row.id);
    reset({
      title: row.title || "",
      description: row.description || "",
      image: row.image || "",
      order: row.order === 0 ? 0 : row.order ? String(row.order) : "",
      status: Boolean(row.status),
    });
    setOpen(true);
  };

  // ================= IMAGE UPLOAD =================
 const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploading(true);

    const res = await api.post(
      "https://dhakadmatrimony.com/api/upload-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // ✅ same pattern as your working code
    if (res.data?.success) {
      const imageUrl = res.data.url || res.data.imageUrl;

      // react-hook-form
      setValue("image", imageUrl, { shouldDirty: true });

      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed");
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    setUploading(false);
  }
};

  const onSubmit = async (values) => {
    if (!values.image) {
      toast.error("Upload image before saving");
      return;
    }

    const payload = {
      title: values.title,
      description: values.description,
      image: values.image,
      order: values.order === "" ? 0 : Number(values.order),
      status: Boolean(values.status),
    };

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/api/gallery/${editingId}`, payload);
        toast.success("Gallery item updated");
      } else {
        await api.post("/api/gallery/add", payload);
        toast.success("Gallery item added");
      }

      onClose();
      fetchGallery();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this gallery item?")) return;

    try {
      await api.delete(`/api/gallery/${id}`);
      toast.success("Deleted");
      fetchGallery();
    } catch (error) {
      handleApiError(error);
    }
  };

  const onToggleStatus = async (row) => {
    const id = row._id || row.id;
    if (!id) return;

    try {
      await api.put(`/api/gallery/${id}`, {
        ...row,
        status: !row.status,
      });
      toast.success("Status updated");
      fetchGallery();
    } catch (error) {
      handleApiError(error);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.title || "Gallery"}
            className="h-12 w-12 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
        ),
    },
    { key: "title", header: "Title" },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <div className="max-w-[420px] text-gray-700 line-clamp-2">
          {row.description || "-"}
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (row) => (row.order ?? "-"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <button
          onClick={() => onToggleStatus(row)}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            row.status ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
          }`}
          title="Toggle status"
        >
          {row.status ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="primary" className="px-3 py-2" onClick={() => onEdit(row)}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button
            variant="danger"
            className="px-3 py-2"
            onClick={() => onDelete(row._id || row.id)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader
        title="Gallery Management"
        actions={
          <Button onClick={onAdd} className="flex gap-2">
            <Plus size={16} />
            Add Gallery Item
          </Button>
        }
      />

      {/* TABLE */}
      <div className="mt-6">
        <Table
          columns={columns}
          rows={sortedItems}
          loading={loading}
          emptyText="No gallery items yet"
        />
      </div>

    </Card>

    {/* ================= MODAL ================= */}
    <Modal
      open={open}
      title={editingId ? "Edit Gallery Item" : "Add Gallery Item"}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button
            variant={editingId ? "primary" : "success"}
            type="submit"
            form="galleryForm"
            disabled={saving || uploading}
          >
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </Button>

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >

      <form
        id="galleryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <Input
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <Input
            type="number"
            placeholder="Order"
            {...register("order")}
          />

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              className="w-full border rounded-lg p-3"
              rows={4}
              {...register("description")}
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-lg p-2 w-full"
            />

            {uploading && (
              <p className="text-sm text-primary mt-2">
                Uploading...
              </p>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="h-24 mt-3 rounded border object-cover"
              />
            )}
          </div>

          <label className="md:col-span-2 flex items-center gap-3 border rounded-lg p-3">
            <input type="checkbox" {...register("status")} />
            <span className="text-sm font-medium">
              Status: {statusVal ? "Active" : "Inactive"}
            </span>
          </label>

        </div>

      </form>

    </Modal>

  </AdminShell>
);
};

export default ProtectedRoute(Page);