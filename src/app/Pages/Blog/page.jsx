"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import RichTextEditor from "@webbycrown/react-advanced-richtext-editor";

const API = "https://dhakadmatrimony.com/api/blogs";
const UPLOAD = "https://dhakadmatrimony.com/api/upload-image";




const Page = () => {

    const [blogs, setBlogs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        tags: "",
        seoTitle: "",
        seoDescription: "",
        status: "draft"
    });

    const editorValue = useMemo(() => form.content || "", [form.content]);

    // ================= FETCH BLOGS =================

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(API);
            setBlogs(res.data.blogs || []);
        } catch (error) {
            handleApiError(error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // ================= HANDLE CHANGE =================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= IMAGE UPLOAD =================

    const handleImageUpload = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {

            setUploading(true);

            const res = await axios.post(UPLOAD, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {

                setForm({
                    ...form,
                    image: res.data.url
                });

                toast.success("Image uploaded");

            }

        } catch (error) {
            handleApiError(error);
        } finally {
            setUploading(false);
        }

    };

    // ================= CREATE / UPDATE BLOG =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                ...form,
                tags: form.tags.split(",").map(t => t.trim())
            };

            if (editingId) {

                await axios.put(`${API}/${editingId}`, payload);
                toast.success("Blog updated");

            } else {

                await axios.post(API, payload);
                toast.success("Blog created");

            }

            setForm({
                title: "",
                excerpt: "",
                content: "",
                image: "",
                tags: "",
                seoTitle: "",
                seoDescription: "",
                status: "draft"
            });

            setEditingId(null);

            fetchBlogs();

        } catch (error) {
            handleApiError(error);
        }

    };

    // ================= EDIT =================

    const handleEdit = (blog) => {

        setEditingId(blog._id);

        setForm({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image,
            tags: blog.tags?.join(","),
            seoTitle: blog.seoTitle,
            seoDescription: blog.seoDescription,
            status: blog.status
        });

    };

    // ================= DELETE =================

    const handleDelete = async (id) => {

        if (!confirm("Delete blog?")) return;

        try {

            await axios.delete(`${API}/${id}`);

            toast.success("Blog deleted");

            fetchBlogs();

        } catch (error) {
            handleApiError(error);
        }

    };

   return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader title="Blog Management" />

      {/* ================= FORM ================= */}
      <Card className="p-5 mt-6">

        <h2 className="font-semibold mb-4">
          {editingId ? "Update Blog" : "Create Blog"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-4">

            <Input
              name="title"
              placeholder="Blog Title"
              value={form.title}
              onChange={handleChange}
            />

            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />

            <Input
              name="seoTitle"
              placeholder="SEO Title"
              value={form.seoTitle}
              onChange={handleChange}
            />

            <Input
              name="seoDescription"
              placeholder="SEO Description"
              value={form.seoDescription}
              onChange={handleChange}
            />

            <Select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>

            <input
              type="file"
              onChange={handleImageUpload}
              className="border rounded-lg p-2"
            />

          </div>

          {uploading && (
            <p className="text-sm text-primary mt-2">
              Uploading image...
            </p>
          )}

          {form.image && (
            <img
              src={form.image}
              className="h-28 mt-3 rounded"
            />
          )}

          <textarea
            name="excerpt"
            placeholder="Short excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-4"
          />

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700">
              Content
            </label>
            <div className="mt-2 border rounded-lg overflow-hidden">
              <RichTextEditor
                value={editorValue}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, content: value }))
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Blog content is saved as HTML.
            </p>
          </div>

          <Button type="submit" className="mt-4">
            {editingId ? "Update Blog" : "Create Blog"}
          </Button>

        </form>

      </Card>

      {/* ================= BLOG LIST ================= */}
      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">

        {blogs.map((blog) => (

          <Card key={blog._id} className="p-3 space-y-2">

            <img
              src={blog.image}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="font-semibold line-clamp-2">
              {blog.title}
            </h3>

            <Badge variant={blog.status === "published" ? "success" : "secondary"}>
              {blog.status}
            </Badge>

            <div className="flex gap-2 pt-2">

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(blog)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(blog._id)}
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
