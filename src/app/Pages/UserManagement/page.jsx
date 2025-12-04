"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Ban, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    // 🔥 Search
    const [searchQuery, setSearchQuery] = useState("");

    // 🔥 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Load token
    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Fetch Users
    const fetchUsers = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(
                "http://206.189.130.102:5000/api/admin/users",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setUsers(res.data.users);
                setFilteredUsers(res.data.users); // default
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token, fetchUsers]);

    // 🔍 Search Handler
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter((u) => 
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.phone?.toLowerCase().includes(query)      
        );

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // Block User
    const handleBlock = async (userId) => {
        try {
            const res = await axios.put(
                `http://206.189.130.102:5000/api/admin/users/${userId}/block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("User blocked successfully!");
                fetchUsers();
            }
        } catch (error) {
            toast.error("Error blocking user!");
        }
    };

    // Delete User
    const handleDelete = async (userId) => {
        try {
            const res = await axios.delete(
                `http://206.189.130.102:5000/api/admin/users/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("User deleted successfully!");
                fetchUsers();
            }
        } catch (error) {
            toast.error("Error deleting user!");
        }
    };

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
                    <div className="flex-1 overflow-auto">
                        <div className="p-6 flex justify-center">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl overflow-hidden">
                                <div className="px-6 py-4 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        Profile Management
                                    </h1>

                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search by name, email, phone, location..."
                                        className="w-full lg:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
                                            <table className="min-w-full divide-y divide-gray-200 mb-3">
                                                <thead className="bg-gray-900 text-white">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Email
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Phone
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Create for
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Verified
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Blocked
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white divide-y divide-gray-300">
                                                    {currentUsers.length > 0 ? (
                                                        currentUsers.map((user) => (
                                                            <tr key={user._id} className="hover:bg-gray-100 transition">
                                                                <td className="px-6 py-4 text-xs font-medium border whitespace-nowrap">
                                                                    {user.name || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border whitespace-nowrap">
                                                                    {user.email || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border whitespace-nowrap">
                                                                    {user.phone || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-medium border whitespace-nowrap">
                                                                    {user.createdfor || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 border whitespace-nowrap">
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium 
                                                                            ${user.isVerified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                                                                    >
                                                                        {user.isVerified ? "Yes" : "No"}
                                                                    </span>
                                                                </td>

                                                                <td className="px-6 py-4 border whitespace-nowrap">
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs 
                                                                        ${user.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                                                                    >
                                                                        {user.isBlocked ? "Yes" : "No"}
                                                                    </span>
                                                                </td>

                                                                <td className="px-6 py-4  border whitespace-nowrap">
                                                                    <button
                                                                        className=" me-3  text-yellow-600 hover:text-yellow-800"
                                                                        onClick={() => handleBlock(user._id)}
                                                                    >
                                                                        <Ban size={20} />
                                                                    </button>

                                                                    <button
                                                                        className="text-red-600 hover:text-red-800"
                                                                        onClick={() => handleDelete(user._id)}
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
                                        <div className="flex justify-center my-6 gap-2">
                                            <button
                                                className="px-4 py-2 bg-gray-200 rounded-md"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Prev
                                            </button>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`px-4 py-2 rounded-md 
                                                        ${currentPage === index + 1 ? "bg-black text-white" : "bg-gray-200"}`}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button
                                                className="px-4 py-2 bg-gray-200 rounded-md"
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
