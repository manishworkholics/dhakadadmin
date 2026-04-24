"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

import { Eye, Trash2, CheckCircle, Mail } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API = "https://dhakadmatrimony.com/api/contact";

const ContactCRM = () => {

  const [contacts, setContacts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken")
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
    <AdminShell>

      <Card className="p-4 md:p-6">

        <PageHeader
          title="Contact CRM"
          actions={
            <div className="flex gap-3">

              <div className="w-64">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button onClick={exportCSV}>
                Export CSV
              </Button>

            </div>
          }
        />

        {/* ================= TABLE ================= */}
        <div className="mt-6">
          <Table
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "subject", header: "Subject" },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <Badge
                    variant={
                      item.status === "resolved"
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.status || "new"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Action",
                render: (item) => (
                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(item)}
                    >
                      <Eye size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(`mailto:${item.email}?subject=Reply: ${item.subject}`)
                      }
                    >
                      <Mail size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => resolveMessage(item._id)}
                    >
                      <CheckCircle size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteMessage(item._id)}
                    >
                      <Trash2 size={14} />
                    </Button>

                  </div>
                ),
              },
            ]}
            rows={filtered}
            emptyText="No messages found"
          />
        </div>

      </Card>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <Card className="p-6 w-[420px]">

            <h3 className="font-semibold mb-4">
              Contact Message
            </h3>

            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selected.name}</p>
              <p><b>Email:</b> {selected.email}</p>
              <p><b>Phone:</b> {selected.phone}</p>
              <p><b>Subject:</b> {selected.subject}</p>
              <p className="mt-2">{selected.message}</p>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>

          </Card>

        </div>
      )}

    </AdminShell>
  );

}

export default ProtectedRoute(ContactCRM)