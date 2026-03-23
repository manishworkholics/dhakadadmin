"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Ban, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { IoIosArrowRoundBack } from "react-icons/io";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);
    // Fetch Users
    const fetchUsers = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);

            const res = await axios.get(
                "http://143.110.244.163:5000/api/admin/users",
                {
                    params: {
                        search: debouncedSearch,
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                setUsers(res.data.users);
                setTotalUsers(res.data.total);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage, debouncedSearch]);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token, fetchUsers]);

    // 🔍 Search Handler
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Block User
    const handleBlock = async (userId) => {
        try {
            const res = await axios.put(
                `http://143.110.244.163:5000/api/admin/users/${userId}/block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const message = res.data.message?.toLowerCase() || "";

                if (message.includes("unblocked")) {
                    toast.success("User unblocked successfully!");
                } else if (message.includes("blocked")) {
                    toast.success("User blocked successfully!");
                } else {
                    toast.success("User updated successfully!");
                }

                fetchUsers();
            }
        } catch (error) {
            handleApiError(error);
        }
    };


    const handleVerify = async (userId) => {
        try {
            const res = await axios.put(
                `http://143.110.244.163:5000/api/admin/users/${userId}/verify`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const message = res.data.message?.toLowerCase() || "";

                if (message.includes("unblocked")) {
                    toast.success("User unblocked successfully!");
                } else if (message.includes("blocked")) {
                    toast.success("User blocked successfully!");
                } else {
                    toast.success("User updated successfully!");
                }

                fetchUsers();
            }
        } catch (error) {
            handleApiError(error);
        }
    };



    // Delete User
    const handleDelete = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            const res = await axios.delete(
                `http://143.110.244.163:5000/api/admin/users/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("User deleted successfully!");
                fetchUsers();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleBackout = () => {
        router.push('/Pages/Dashboard');
    }

    return (
        <>
            <div className="flex h-screen bg-gray-100">

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 
                    lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
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
                    {/* Header */}
                    <div className="items-center justify-between">
                        <button
                            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu size={22} />
                        </button>
                        <Header />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className=" ">
                            <div >
                                <div className="px-6 py-4 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" >
                                    {/* Back Icon + Title (NO GAP) */}
                                    <div className="flex items-center gap-1">
                                        <button onClick={handleBackout} className="flex items-center text-gray-700 hover:text-black">
                                            <IoIosArrowRoundBack size={28} />
                                        </button>

                                        <h1 className="text-2xl font-semibold text-gray-800">
                                            User Management
                                        </h1>
                                    </div>

                                    {/* Search */}
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search by name, email, phone, location..."
                                        className="w-full lg:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-black-300"
                                    />
                                </div>

                                {/* Table */}
                                {loading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-900 border-t-transparent"></div>
                                        <p className="ml-4 text-lg font-medium text-gray-700">
                                            Loading Users...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full mb-3">
                                                <thead className="bg-slate-800 text-white">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-b-0 border-r-0 ">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0">
                                                            Email
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0">
                                                            Phone
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0 ">
                                                            Create for
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0 ">
                                                            Verified
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0 ">
                                                            Blocked
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border border-slate-800 border-l-0 border-b-0 border-r-0 ">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white divide-y divide-gray-300">
                                                    {users.length > 0 ? (
                                                        users.map((user) => (
                                                            <tr key={user._id} className="hover:bg-gray-100 transition">
                                                                <td className="px-6 py-4 text-xs font-medium border border-slate-800 whitespace-nowrap">
                                                                    {user.name || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border border-slate-800 whitespace-nowrap">
                                                                    {user.email || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border border-slate-800 whitespace-nowrap">
                                                                    {user.phone || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border border-slate-800 whitespace-nowrap">
                                                                    {user.createdfor || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 border border-slate-800 whitespace-nowrap">
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium 
                                                                            ${user.isVerified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                                                                    >
                                                                        {user.isVerified ? "Yes" : "No"}
                                                                    </span>
                                                                </td>

                                                                <td className="px-6 py-4 border border-slate-800 whitespace-nowrap">
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs 
                                                                        ${user.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                                                                    >
                                                                        {user.isBlocked ? "Yes" : "No"}
                                                                    </span>
                                                                </td>

                                                                <td className="px-6 py-4 border border-slate-800 whitespace-nowrap">

                                                                    {/* Block / Unblock */}
                                                                    <button
                                                                        className="me-3 text-yellow-600 hover:text-yellow-800 cursor-pointer"
                                                                        onClick={() => handleBlock(user._id)}
                                                                        title={user.isBlocked ? "Unblock User" : "Block User"}
                                                                    >
                                                                        <Ban size={20} />
                                                                    </button>

                                                                    {/* Verify / Unverify */}
                                                                    <button
                                                                        className="me-3 cursor-pointer"
                                                                        onClick={() => handleVerify(user._id)}
                                                                        title={user.isVerified ? "Remove Verification" : "Verify User"}
                                                                    >
                                                                        {user.isVerified ? (
                                                                            <X size={20} className="text-red-500 hover:text-red-700" />
                                                                        ) : (
                                                                            <Check size={20} className="text-green-600 hover:text-green-800" />
                                                                        )}
                                                                    </button>

                                                                    {/* Delete */}
                                                                    <button
                                                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                                                        onClick={() => handleDelete(user._id)}
                                                                        title="Delete User"
                                                                    >
                                                                        <Trash2 size={20} />
                                                                    </button>

                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="15" className="text-center py-6 text-gray-500">
                                                                No users found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-center items-center my-6 gap-2 flex-wrap">

                                            {/* Prev Button */}
                                            <button
                                                className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Prev
                                            </button>

                                            {/* Dynamic Pages */}
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;

                                                let start = Math.max(currentPage - 2, 1);
                                                let end = Math.min(start + maxVisible - 1, totalPages);

                                                if (end - start < maxVisible - 1) {
                                                    start = Math.max(end - maxVisible + 1, 1);
                                                }

                                                // First page + dots
                                                if (start > 1) {
                                                    pages.push(
                                                        <button key={1}
                                                            onClick={() => handlePageChange(1)}
                                                            className="px-3 py-2 bg-gray-200 rounded-md"
                                                        >
                                                            1
                                                        </button>
                                                    );

                                                    if (start > 2) {
                                                        pages.push(<span key="start-dots">...</span>);
                                                    }
                                                }

                                                // Middle pages
                                                for (let i = start; i <= end; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePageChange(i)}
                                                            className={`px-3 py-2 rounded-md 
                        ${currentPage === i ? "bg-black text-white" : "bg-gray-200"}`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }

                                                // Last page + dots
                                                if (end < totalPages) {
                                                    if (end < totalPages - 1) {
                                                        pages.push(<span key="end-dots">...</span>);
                                                    }

                                                    pages.push(
                                                        <button key={totalPages}
                                                            onClick={() => handlePageChange(totalPages)}
                                                            className="px-3 py-2 bg-gray-200 rounded-md"
                                                        >
                                                            {totalPages}
                                                        </button>
                                                    );
                                                }

                                                return pages;
                                            })()}

                                            {/* Next Button */}
                                            <button
                                                className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProtectedRoute(Page);
