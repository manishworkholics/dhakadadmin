"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import toast from "react-hot-toast";

const API = "http://143.110.244.163:5000/api/success";

const Page = () => {
  const [stories, setStories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    partnerName: "",
    title: "",
    story: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://143.110.244.163:5000/api/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          image: res.data.url,
        }));
        toast.success("Image uploaded");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  // ================= FETCH =================
  const fetchStories = async () => {
    try {
      const res = await axios.get(API);
      setStories(res.data.stories || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      partnerName: "",
      title: "",
      story: "",
      image: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      toast.error("Upload image first");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        toast.success("Story updated");
      } else {
        await axios.post(API, form);
        toast.success("Story added");
      }

      resetForm();
      fetchStories();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (story) => {
    setEditingId(story._id);
    setForm(story);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this story?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      toast.success("Deleted");
      fetchStories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Success Stories</h1>
            {editingId && (
              <span className="text-sm text-blue-600 font-medium">
                Editing Mode
              </span>
            )}
          </div>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-8 border"
          >
            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="partnerName"
                placeholder="Partner Name"
                value={form.partnerName}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="title"
                placeholder="Story Title"
                value={form.title}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 rounded-lg w-full"
                />

                {uploading && <p className="text-blue-500">Uploading...</p>}

                {form.image && (
                  <img src={form.image} className="h-20 mt-2 rounded" />
                )}
              </div>

            </div>

            <textarea
              name="story"
              placeholder="Write Story..."
              value={form.story}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-4"
              rows="4"
              required
            />

            <div className="flex gap-3 mt-4">

              <button
                type="submit"
                className={`px-6 py-2 rounded-lg text-white ${
                  editingId ? "bg-blue-600" : "bg-green-600"
                }`}
              >
                {editingId ? "Update Story" : "Add Story"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>

          {/* ================= LIST ================= */}
          {stories.length === 0 ? (
            <p className="text-gray-500">No success stories yet</p>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {stories.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition p-4"
                >
                  <img
                    src={item.image}
                    className="h-48 w-full object-cover rounded-lg"
                  />

                  <h3 className="font-bold mt-3">
                    {item.name} ❤️ {item.partnerName}
                  </h3>

                  <p className="text-sm text-gray-500">{item.title}</p>

                  <p className="text-sm mt-2 line-clamp-3">
                    {item.story}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedStory(item)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= MODAL ================= */}
          {selectedStory && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-xl w-[900px]">
                <img
                  src={selectedStory.image}
                  className="h-64 mx-auto object-contain"
                />

                <h2 className="font-bold mt-4 text-lg">
                  {selectedStory.name} ❤️ {selectedStory.partnerName}
                </h2>

                <p className="text-gray-500">{selectedStory.title}</p>

                <p className="mt-3">{selectedStory.story}</p>

                <button
                  onClick={() => setSelectedStory(null)}
                  className="mt-4 bg-black text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Page);