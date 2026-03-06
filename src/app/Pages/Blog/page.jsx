"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const API = "http://143.110.244.163:5000/api/blogs";
const UPLOAD = "http://143.110.244.163:5000/api/upload-image";




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

        <div className="flex h-screen bg-gray-100 overflow-hidden">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Header />

                <div className="p-6 overflow-y-auto">

                    <h1 className="text-2xl font-bold mb-6">
                        Blog Management
                    </h1>

                    {/* ================= FORM ================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow mb-8"
                    >

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                type="text"
                                name="title"
                                placeholder="Blog Title"
                                value={form.title}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            />

                            <input
                                type="text"
                                name="tags"
                                placeholder="Tags (comma separated)"
                                value={form.tags}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                name="seoTitle"
                                placeholder="SEO Title"
                                value={form.seoTitle}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                name="seoDescription"
                                placeholder="SEO Description"
                                value={form.seoDescription}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>

                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="border p-2 rounded"
                            />

                        </div>

                        {uploading && (
                            <p className="text-blue-500 text-sm mt-2">
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
                            className="border p-2 rounded w-full mt-4"
                        />

                        {/* ================= RICH TEXT ================= */}

                        <div className="mt-4">
                            <textarea
                                name="content"
                                placeholder="Write blog content..."
                                value={form.content}
                                onChange={handleChange}
                                className="border p-3 rounded w-full mt-4 h-48"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-slate-800 text-white px-6 py-2 rounded mt-4"
                        >
                            {editingId ? "Update Blog" : "Create Blog"}
                        </button>

                    </form>

                    {/* ================= BLOG LIST ================= */}

                    <div className="grid md:grid-cols-3 gap-6">

                        {blogs.map((blog) => (

                            <div
                                key={blog._id}
                                className="bg-white rounded shadow p-4"
                            >

                                <img
                                    src={blog.image}
                                    className="h-40 w-full object-cover rounded"
                                />

                                <h3 className="font-bold mt-3">
                                    {blog.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {blog.status}
                                </p>

                                <div className="flex gap-2 mt-3">

                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
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

export default ProtectedRoute(Page);