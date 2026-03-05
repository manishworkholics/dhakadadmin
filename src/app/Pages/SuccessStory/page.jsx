"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const API = "http://143.110.244.163:5000/api/success";

const Page = () => {

  const [stories, setStories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    partnerName: "",
    title: "",
    story: "",
    image: "",
  });

  const fetchStories = async () => {
    try {
      const res = await axios.get(API);
      setStories(res.data.stories || res.stories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

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

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }

      resetForm();
      fetchStories();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (story) => {
    setEditingId(story._id);
    setForm({
      name: story.name,
      partnerName: story.partnerName,
      title: story.title,
      story: story.story,
      image: story.image,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this success story?")) return;

    try {
      await axios.delete(`${API}/${id}`);
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

          <h1 className="text-2xl font-bold mb-6">Success Stories</h1>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow mb-8"
          >

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="partnerName"
                placeholder="Partner Name"
                value={form.partnerName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="title"
                placeholder="Story Title"
                value={form.title}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

            </div>

            <textarea
              name="story"
              placeholder="Write Story"
              value={form.story}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-4"
              rows="4"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
            >
              {editingId ? "Update Story" : "Create Story"}
            </button>

          </form>

          {/* ================= LIST ================= */}

          <div className="grid md:grid-cols-3 gap-6">

            {stories?.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow p-4"
              >

                <img
                  src={item.image}
                  className="w-full h-40 object-cover rounded"
                />

                <h3 className="font-bold mt-3">
                  {item.name} ❤️ {item.partnerName}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <p className="text-sm mt-2">
                  {item.story}
                </p>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
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