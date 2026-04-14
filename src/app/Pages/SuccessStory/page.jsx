"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import toast from "react-hot-toast";

// ✅ FIXED BASE URL
const API = "http://143.110.244.163:5000/api/success";

const Page = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken")
      : "";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

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
      const res = await axios.get(`${API}/admin`, { headers });
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
        // ✅ FIXED UPDATE
        await axios.put(`${API}/${editingId}`, form, { headers });
        toast.success("Story updated");
      } else {
        // ✅ FIXED CREATE
        await axios.post(`${API}/admin`, form, { headers });

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
      // ✅ FIXED DELETE
      await axios.delete(`${API}/${id}`, { headers });
      toast.success("Deleted");
      fetchStories();
    } catch (error) {
      console.log(error);
    }
  };

  const changeApproval = async (id, approved) => {
    try {
      await axios.put(`${API}/${id}`, { approved }, { headers }); // ✅ FINAL
      toast.success(approved ? "Story approved" : "Story disapproved");
      fetchStories();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AdminShell>

      <Card className="p-4 md:p-6">

        <PageHeader
          title="Success Stories"
          subtitle={editingId ? "Editing Mode" : ""}
        />

        {/* ================= FORM ================= */}
        <Card className="p-5 mt-6">

          <form onSubmit={handleSubmit}>

            <div className="grid md:grid-cols-2 gap-4">

              <Input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                name="partnerName"
                placeholder="Partner Name"
                value={form.partnerName}
                onChange={handleChange}
              />

              <Input
                name="title"
                placeholder="Story Title"
                value={form.title}
                onChange={handleChange}
              />

              <div>
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

                {form.image && (
                  <img
                    src={form.image}
                    className="h-20 mt-2 rounded"
                  />
                )}
              </div>

            </div>

            <textarea
              name="story"
              placeholder="Write Story..."
              value={form.story}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-4"
              rows="4"
            />

            <div className="flex gap-3 mt-4">

              <Button type="submit">
                {editingId ? "Update Story" : "Add Story"}
              </Button>

              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}

            </div>

          </form>

        </Card>

        {/* ================= LIST ================= */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

          {stories.length === 0 ? (
            <p className="text-muted-foreground">
              No success stories yet
            </p>
          ) : (

            stories.map((item) => (

              <Card key={item._id} className="p-3 space-y-2">

                <img
                  src={item.image}
                  className="h-40 w-full object-cover rounded"
                />

                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-sm">
                    {item.name} ❤️ {item.partnerName}
                  </h3>
                  <Badge variant={item.approved ? "success" : "warning"}>
                    {item.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  {item.title}
                </p>

                <p className="text-sm line-clamp-3">
                  {item.story}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {!item.approved ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => changeApproval(item._id, true)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => changeApproval(item._id, false)}
                    >
                      Disapprove
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedStory(item)}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </div>

              </Card>

            ))

          )}

        </div>

      </Card>

      {/* ================= MODAL ================= */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <Card className="p-6 w-[800px]">

            <img
              src={selectedStory.image}
              className="h-60 mx-auto object-contain"
            />

            <h2 className="font-semibold mt-4">
              {selectedStory.name} ❤️ {selectedStory.partnerName}
            </h2>

            <p className="text-muted-foreground">
              {selectedStory.title}
            </p>

            <p className="mt-3 text-sm">
              {selectedStory.story}
            </p>

            <Button
              className="mt-4 w-full"
              onClick={() => setSelectedStory(null)}
            >
              Close
            </Button>

          </Card>

        </div>
      )}

    </AdminShell>
  );
};

export default ProtectedRoute(Page);