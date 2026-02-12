"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Eye } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API_URL = "http://143.110.244.163:5000/api/contact";

const ContactUs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* 🔹 Fetch Contact Messages */
  const loadContacts = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setContacts(res.data.contacts);
        setFiltered(res.data.contacts);
      }
    } catch (error) {
      console.log("Error fetching contacts", error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  /* 🔹 Search Filter */
  useEffect(() => {
    const list = contacts.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search) ||
        item.subject.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
    setPage(1);
  }, [search, contacts]);

  const paginatedContacts = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300
          lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="items-center justify-between">
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>
          <Header />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 ">
            <div >
              <div className="px-6 py-4  flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" >
                <h1 className="text-2xl font-semibold mb-3">Contact Messages</h1>

                {/* 🔍 Search Input */}
                <input
                  type="text"
                  placeholder="Search..."
                  className="border p-2 rounded lg:w-1/3 md:w-full mb-3"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* 📋 Table */}
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow rounded table-auto text-center">
                  <thead className="bg-[#7B2A3A] text-white">
                    <tr>
                      <th className="p-2 border border-[#7B2A3A]">Name</th>
                      <th className="p-2 border border-[#7B2A3A]">Email</th>
                      <th className="p-2 border border-[#7B2A3A]">Phone</th>
                      <th className="p-2 border border-[#7B2A3A]">Subject</th>
                      <th className="p-2 border border-[#7B2A3A]">Date</th>
                      <th className="p-2 border border-[#7B2A3A]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContacts.length > 0 ? (
                      paginatedContacts.map((item) => (
                        <tr key={item._id} className="">
                          <td className="p-2 border border-[#7B2A3A]">{item.name}</td>
                          <td className="p-2 border border-[#7B2A3A]">{item.email}</td>
                          <td className="p-2 border border-[#7B2A3A]">{item.phone}</td>
                          <td className="p-2 border border-[#7B2A3A]">{item.subject}</td>
                          <td className="p-2 border border-[#7B2A3A]">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border border-[#7B2A3A]">
                            <div className="p-2 flex justify-center">
                              <button
                                onClick={() => setSelectedMessage(item)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={18} /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center p-4 text-gray-500 italic"
                        >
                          No messages found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* 🔻 Pagination Buttons */}
              <div className="flex justify-between items-center mt-3">
                <span>
                  Page {page} of {totalPages || 1}
                </span>

                <div className="flex gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                      }`}
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1 rounded ${page >= totalPages
                      ? "bg-gray-300"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 🟦 Modal for View Details */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 className="text-lg font-semibold mb-3">Contact Detail</h3>

                <p><strong>Name:</strong> {selectedMessage.name}</p>
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                <p><strong>Message:</strong> {selectedMessage.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded mt-4 w-full"
                  onClick={() => setSelectedMessage(null)}
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

export default ProtectedRoute(ContactUs);
