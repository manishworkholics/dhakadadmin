"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Eye, Trash2, CheckCircle, Mail } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API = "http://143.110.244.163:5000/api/contact";

const ContactCRM = () => {

  const [contacts, setContacts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null


  /* ================= LOAD CONTACTS ================= */

  const loadContacts = async () => {

    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setContacts(res.data.contacts)
    setFiltered(res.data.contacts)

  }

  useEffect(() => {
    loadContacts()
  }, [])



  /* ================= SEARCH ================= */

  useEffect(() => {

    const list = contacts.filter(c =>

      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())

    )

    setFiltered(list)

  }, [search, contacts])



  /* ================= DELETE ================= */

  const deleteMessage = async (id) => {

    if (!confirm("Delete message?")) return

    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    loadContacts()

  }



  /* ================= RESOLVE ================= */

  const resolveMessage = async (id) => {

    await axios.patch(`${API}/${id}/resolve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    loadContacts()

  }



  /* ================= EXPORT CSV ================= */

  const exportCSV = () => {

    const rows = contacts.map(c => [
      c.name,
      c.email,
      c.phone,
      c.subject,
      c.status
    ])

    let csv = "Name,Email,Phone,Subject,Status\n"

    rows.forEach(r => {
      csv += r.join(",") + "\n"
    })

    const blob = new Blob([csv])
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "contacts.csv"
    a.click()

  }



  return (

    <div className="flex h-screen bg-[#F6FAFF]">


      {/* SIDEBAR */}

      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300
lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        <Sidebar />

      </div>


      <div className="flex-1 flex flex-col">


        <Header />


        <div className="p-6 space-y-6">


          {/* HEADER */}

          <div className="flex justify-between items-center">

            <h1 className="text-2xl font-semibold">
              Contact CRM
            </h1>

            <div className="flex gap-3">

              <input
                placeholder="Search..."
                className="border px-3 py-2 rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                onClick={exportCSV}
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                Export CSV
              </button>

            </div>

          </div>



          {/* TABLE */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full text-sm">

              <thead className="bg-slate-900 text-white">

                <tr>

                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>

                </tr>

              </thead>


              <tbody>

                {filtered.map(item => (

                  <tr key={item._id} className="border-b hover:bg-gray-50">

                    <td className="p-3">{item.name}</td>

                    <td className="p-3">{item.email}</td>

                    <td className="p-3">{item.subject}</td>


                    <td className="p-3">

                      <span className={`px-2 py-1 text-xs rounded-full
${item.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"}`}>

                        {item.status || "new"}

                      </span>

                    </td>


                    <td className="p-3 flex gap-2 justify-center">


                      {/* VIEW */}

                      <button onClick={() => setSelected(item)}>
                        <Eye size={18} />
                      </button>


                      {/* EMAIL */}

                      <a href={`mailto:${item.email}?subject=Reply: ${item.subject}`}>
                        <Mail size={18} />
                      </a>


                      {/* RESOLVE */}

                      <button onClick={() => resolveMessage(item._id)}>
                        <CheckCircle size={18} />
                      </button>


                      {/* DELETE */}

                      <button onClick={() => deleteMessage(item._id)}>
                        <Trash2 size={18} />
                      </button>


                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>



      {/* ================= MODAL ================= */}

      {selected && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white rounded-xl p-6 w-[420px]">

            <h3 className="text-lg font-semibold mb-4">
              Contact Message
            </h3>

            <p><strong>Name:</strong> {selected.name}</p>

            <p><strong>Email:</strong> {selected.email}</p>

            <p><strong>Phone:</strong> {selected.phone}</p>

            <p><strong>Subject:</strong> {selected.subject}</p>

            <p className="mt-3">{selected.message}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-red-500 text-white px-3 py-2 rounded w-full"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  )

}

export default ProtectedRoute(ContactCRM)