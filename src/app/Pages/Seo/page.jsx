"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://143.110.244.163:5000/api/seo";

const Page = () => {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const axiosAuth = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [seoList, setSeoList] = useState([]);

  const [formData, setFormData] = useState({
    page: "",
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  });

  const [editId, setEditId] = useState(null);

  // ================= GET SEO =================

  const fetchSeo = async () => {
    try {

      const res = await axiosAuth.get("/list");

      setSeoList(res.data.seo);

    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // ================= ADD / UPDATE SEO =================

  const handleSubmit = async () => {

    try {

      if (editId) {

        await axiosAuth.put(`/${editId}`, formData);

        toast.success("SEO updated");

      } else {

        await axiosAuth.post("/create", formData);

        toast.success("SEO added");

      }

      setFormData({
        page: "",
        title: "",
        description: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        canonicalUrl: "",
      });

      setEditId(null);

      fetchSeo();

    } catch (error) {
      handleApiError(error);
    }
  };

  // ================= EDIT =================

  const handleEdit = (seo) => {

    setFormData({
      page: seo.page,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      ogTitle: seo.ogTitle || "",
      ogDescription: seo.ogDescription || "",
      ogImage: seo.ogImage || "",
      canonicalUrl: seo.canonicalUrl || "",
    });

    setEditId(seo._id);

  };

  // ================= DELETE =================

  const handleDelete = async (id) => {

    if (!confirm("Delete this SEO?")) return;

    try {

      await axiosAuth.delete(`/${id}`);

      toast.success("SEO deleted");

      fetchSeo();

    } catch (error) {
      handleApiError(error);
    }

  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <div className="hidden lg:block h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen">
        <Header />
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* FORM */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Update SEO" : "Add SEO"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="page"
                placeholder="Page (home/about/contact)"
                value={formData.page}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="title"
                placeholder="Meta Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="keywords"
                placeholder="Keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Meta Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="ogTitle"
                placeholder="OG Title"
                value={formData.ogTitle}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="ogDescription"
                placeholder="OG Description"
                value={formData.ogDescription}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="ogImage"
                placeholder="OG Image URL"
                value={formData.ogImage}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="canonicalUrl"
                placeholder="Canonical URL"
                value={formData.canonicalUrl}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-slate-700 text-white px-6 py-2 rounded"
            >
              {editId ? "Update SEO" : "Add SEO"}
            </button>
          </div>
          {/* TABLE */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">
              SEO List
            </h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="p-2">Page</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Keywords</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seoList.map((seo) => (
                  <tr key={seo._id} className="border-t">
                    <td className="p-2">{seo.page}</td>
                    <td className="p-2">{seo.title}</td>
                    <td className="p-2">{seo.keywords}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(seo)}
                        className="bg-slate-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(seo._id)}
                        className="bg-rose-400 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Page);