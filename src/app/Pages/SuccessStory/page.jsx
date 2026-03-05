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
  const [selectedStory, setSelectedStory] = useState(null);
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
              className="bg-slate-800 text-white px-6 py-2 rounded mt-4"
            >
              {editingId ? "Update Story" : "Create Story"}
            </button>

          </form>

          {/* ================= LIST ================= */}

          <div className="grid md:grid-cols-5 gap-6">

            {stories?.map((item) => {

              const isLongStory = item.story.length > 120;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-4"
                >
                  <div className="relative  w-full h-56 rounded-xl overflow-hidden flex items-center justify-center">
                    {/* Blurred Background */}
                    <img
                      src={item.image}
                      className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-80"
                    />
                    {/* Main Image */}
                    <img
                      src={item.image}
                      className="relative h-56 object-contain z-10 shadow"
                    />
                  </div>

                  <h3 className="font-bold mt-3">
                    {item.name} ❤️ {item.partnerName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  {/* Story Preview */}
                  <p className="text-sm mt-2 line-clamp-3">
                    {item.story}
                  </p>

                  <div className="flex gap-2 mt-4">

                    {/* View button only if story long */}
                    {isLongStory && (
                      <button
                        onClick={() => setSelectedStory(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    )}

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
              );

            })}
            {selectedStory && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white w-[1200px] rounded-lg p-6 shadow-lg">

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative w-full h-[350px] rounded overflow-hidden mb-3">

                      {/* Blur background */}
                      <img
                        src={selectedStory.image}
                        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                      />

                      {/* Main image */}
                      <img
                        src={selectedStory.image}
                        className="relative h-full mx-auto object-contain"
                      />

                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-bold mb-2">
                        {selectedStory.name} ❤️ {selectedStory.partnerName}
                      </h2>

                      <p className="text-sm text-gray-500 mb-3">
                        {selectedStory.title}
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedStory.story}
                      </p>

                      <button
                        onClick={() => setSelectedStory(null)}
                        className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div >
  );
};

export default ProtectedRoute(Page);