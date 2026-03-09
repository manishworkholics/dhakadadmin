"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Pencil, Trash2, Eye, Globe } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://143.110.244.163:5000/api/seo";

const Page = () => {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
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

    <div className="flex h-screen bg-[#F6FAFF]">


      {/* SIDEBAR */}

      <div className="hidden lg:block">
        <Sidebar />
      </div>



      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        <Header />


        <div className="p-6 space-y-6 overflow-auto">


          {/* HEADER */}

          <div className="flex justify-between items-center">

            <h1 className="text-2xl font-semibold">
              SEO Management
            </h1>

            <div className="flex gap-3">

              <button
                onClick={() => window.open(`${API}/sitemap.xml`)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
              >

                <Globe size={16} />
                Sitemap

              </button>

              <div className="relative">

                <Search size={16} className="absolute left-3 top-3 text-gray-400" />

                <input
                  placeholder="Search page..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border pl-9 pr-3 py-2 rounded-lg"
                />

              </div>

            </div>

          </div>



          {/* ================= FORM ================= */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-4">

              {editId ? "Update SEO" : "Add SEO"}

            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="page"
                placeholder="Page slug"
                value={formData.page}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="title"
                placeholder="Meta Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="keywords"
                placeholder="Keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="canonicalUrl"
                placeholder="Canonical URL"
                value={formData.canonicalUrl}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Meta Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                name="ogTitle"
                placeholder="OG Title"
                value={formData.ogTitle}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="ogDescription"
                placeholder="OG Description"
                value={formData.ogDescription}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="ogImage"
                placeholder="OG Image URL"
                value={formData.ogImage}
                onChange={handleChange}
                className="border p-2 rounded"
              />

            </div>

            <div className="flex gap-3 mt-4">

              <button
                onClick={handleSubmit}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg"
              >

                {editId ? "Update SEO" : "Create SEO"}

              </button>

              {editId && (

                <button
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >

                  Cancel

                </button>

              )}

            </div>

          </div>



          {/* ================= TABLE ================= */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-4">

              SEO Pages

            </h2>


            {loading ? (

              <div className="text-center py-10">
                Loading SEO pages...
              </div>

            ) : (


              <table className="w-full text-sm">

                <thead className="bg-slate-900 text-white">

                  <tr>

                    <th className="p-3 text-left">Page</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Keywords</th>
                    <th className="p-3 text-left">Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSeo.map(seo => (

                    <tr key={seo._id} className="border-b hover:bg-gray-50">

                      <td className="p-3">

                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">

                          {seo.page}

                        </span>

                      </td>

                      <td className="p-3">
                        {seo.title}
                      </td>

                      <td className="p-3 text-gray-600">
                        {seo.keywords}
                      </td>

                      <td className="p-3 flex gap-3">

                        <button
                          onClick={() => handlePreview(seo._id)}
                          className="text-purple-600 flex items-center gap-1"
                        >

                          <Eye size={16} />
                          Preview

                        </button>

                        <button
                          onClick={() => handleEdit(seo)}
                          className="text-blue-600 flex items-center gap-1"
                        >

                          <Pencil size={16} />
                          Edit

                        </button>

                        <button
                          onClick={() => handleDelete(seo._id)}
                          className="text-red-600 flex items-center gap-1"
                        >

                          <Trash2 size={16} />
                          Delete

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}



            {/* PAGINATION */}

            <div className="flex justify-end gap-3 mt-4">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded"
              >

                Prev

              </button>

              <span>

                Page {page} / {totalPages}

              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded"
              >

                Next

              </button>

            </div>

          </div>


        </div>

      </div>



      {/* ================= PREVIEW MODAL ================= */}

      {preview && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[500px]">

            <h2 className="text-lg font-semibold mb-3">
              SEO Preview
            </h2>

            <p className="font-semibold text-blue-600">
              {preview.title}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              {preview.meta?.[0]?.content}
            </p>

            {preview.og?.image && (

              <img
                src={preview.og.image}
                className="mt-4 rounded"
              />

            )}

            <button
              onClick={() => setPreview(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>

  )

}

export default ProtectedRoute(Page)