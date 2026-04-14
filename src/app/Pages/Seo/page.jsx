"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

import axios from "axios";
import { toast } from "react-toastify";
import { Search, Pencil, Trash2, Eye, Globe } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://143.110.244.163:5000/api/seo";

const Page = () => {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken")
      : null;

  const axiosAuth = axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` }
  });


  const [seoList, setSeoList] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const [preview, setPreview] = useState(null)


  const [formData, setFormData] = useState({
    page: "",
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  })

  const [editId, setEditId] = useState(null)



  /* ================= FETCH SEO ================= */

  const fetchSeo = async (p = 1) => {

    try {

      setLoading(true)

      const res = await axiosAuth.get(`/list?page=${p}`)

      setSeoList(res.data.seo)
      setTotal(res.data.total)

    } catch (err) {

      toast.error("Failed to load SEO")

    }

    setLoading(false)

  }

  useEffect(() => {
    fetchSeo(page)
  }, [page])



  /* ================= INPUT ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }



  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    try {

      if (editId) {

        await axiosAuth.put(`/${editId}`, formData)

        toast.success("SEO updated")

      } else {

        await axiosAuth.post("/create", formData)

        toast.success("SEO created")

      }

      resetForm()

      fetchSeo(page)

    } catch (err) {

      toast.error("Something went wrong")

    }

  }



  /* ================= RESET ================= */

  const resetForm = () => {

    setFormData({
      page: "",
      title: "",
      description: "",
      keywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
    })

    setEditId(null)

  }



  /* ================= EDIT ================= */

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
    })

    setEditId(seo._id)

    window.scrollTo({ top: 0, behavior: "smooth" })

  }



  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    if (!confirm("Delete SEO record?")) return

    await axiosAuth.delete(`/${id}`)

    toast.success("SEO deleted")

    fetchSeo(page)

  }



  /* ================= PREVIEW ================= */

  const handlePreview = async (id) => {

    const res = await axiosAuth.get(`/preview/${id}`)

    setPreview(res.data)

  }



  /* ================= FILTER ================= */

  const filteredSeo = seoList.filter(item =>
    item.page.toLowerCase().includes(search.toLowerCase())
  )



  const totalPages = Math.ceil(total / limit)



  return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader
        title="SEO Management"
        actions={
          <div className="flex gap-3">

            <Button
              onClick={() => window.open(`${API}/sitemap.xml`)}
              className="flex gap-2"
            >
              <Globe size={16} />
              Sitemap
            </Button>

            <div className="w-64">
              <Input
                placeholder="Search page..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>
        }
      />

      {/* ================= FORM ================= */}
      <Card className="p-5 mt-6">

        <h2 className="font-semibold mb-4">
          {editId ? "Update SEO" : "Add SEO"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <Input name="page" placeholder="Page slug" value={formData.page} onChange={handleChange} />
          <Input name="title" placeholder="Meta Title" value={formData.title} onChange={handleChange} />
          <Input name="keywords" placeholder="Keywords" value={formData.keywords} onChange={handleChange} />
          <Input name="canonicalUrl" placeholder="Canonical URL" value={formData.canonicalUrl} onChange={handleChange} />

          <div className="md:col-span-2">
            <textarea
              name="description"
              placeholder="Meta Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <Input name="ogTitle" placeholder="OG Title" value={formData.ogTitle} onChange={handleChange} />
          <Input name="ogDescription" placeholder="OG Description" value={formData.ogDescription} onChange={handleChange} />
          <Input name="ogImage" placeholder="OG Image URL" value={formData.ogImage} onChange={handleChange} />

        </div>

        <div className="flex gap-3 mt-4">

          <Button onClick={handleSubmit}>
            {editId ? "Update SEO" : "Create SEO"}
          </Button>

          {editId && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}

        </div>

      </Card>

      {/* ================= TABLE ================= */}
      <div className="mt-6">

        {loading ? (
          <div className="text-center py-10">
            Loading SEO pages...
          </div>
        ) : (

          <Table
            columns={[
              {
                key: "page",
                header: "Page",
                render: (seo) => (
                  <Badge variant="secondary">
                    {seo.page}
                  </Badge>
                ),
              },
              { key: "title", header: "Title" },
              { key: "keywords", header: "Keywords" },
              {
                key: "actions",
                header: "Action",
                render: (seo) => (
                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(seo._id)}
                    >
                      <Eye size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(seo)}
                    >
                      <Pencil size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(seo._id)}
                    >
                      <Trash2 size={14} />
                    </Button>

                  </div>
                ),
              },
            ]}
            rows={filteredSeo}
            emptyText="No SEO pages found"
          />

        )}

        {/* PAGINATION */}
        <div className="flex justify-end items-center gap-3 mt-5">

          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>

        </div>

      </div>

    </Card>

    {/* ================= PREVIEW MODAL ================= */}
    {preview && (

      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

        <Card className="p-6 w-[500px]">

          <h2 className="text-lg font-semibold mb-3">
            SEO Preview
          </h2>

          <p className="font-semibold text-primary">
            {preview.title}
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            {preview.meta?.[0]?.content}
          </p>

          {preview.og?.image && (
            <img
              src={preview.og.image}
              className="mt-4 rounded"
            />
          )}

          <Button
            className="mt-4 w-full"
            onClick={() => setPreview(null)}
          >
            Close
          </Button>

        </Card>

      </div>

    )}

  </AdminShell>
);

}

export default ProtectedRoute(Page)