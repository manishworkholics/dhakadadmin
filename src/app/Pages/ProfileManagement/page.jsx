"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import { Menu, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { IoIosArrowRoundBack } from "react-icons/io";

const Page = () => {
    const router = useRouter();

    const [token, setToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 10;

    // Load token only on client
    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Fetch Profiles
    const fetchProfiles = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get("http://143.110.244.163:5000/api/admin/profiles", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setProfiles(res.data.profiles);
                setFilteredProfiles(res.data.profiles);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch profiles.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Run only when token available
    useEffect(() => {
        if (token) {
            fetchProfiles();
        }
    }, [token, fetchProfiles]);

    // Handle View Profile
    const handleProfile = (profileId) => {
        router.push(`/Pages/ProfileManagement/${profileId}`);
    };

    // Handle Search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = profiles.filter((profile) =>
            profile.name?.toLowerCase().includes(query) ||
            profile.email?.toLowerCase().includes(query) ||
            profile.userId?.phone?.toLowerCase().includes(query) ||
            profile.location?.toLowerCase().includes(query)
        );

        setFilteredProfiles(filtered);
        setCurrentPage(1);
    };

    // Handle Mark / Unmark Featured
    const toggleFeatured = async (profileId, isFeatured) => {
        try {
            const url = isFeatured
                ? "http://143.110.244.163:5000/api/featured/unmark"
                : "http://143.110.244.163:5000/api/featured/mark";

            const res = await axios.post(
                url,
                { profileId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success(isFeatured ? "Unmarked from Featured" : "Marked as Featured");

                // Refetch updated profiles
                fetchProfiles();
            }
        } catch (error) {
            console.error("Featured toggle error:", error);
            toast.error("Failed to update featured status.");
        }
    };

    // Pagination Logic
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

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
                    <div className="flex-1 p-6 overflow-auto">
                        <div >
                            <div >

                                {/* Page Header */}
                                <div className="px-6 py-4 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-center gap-1">
                                        <button onClick={handleBackout} className="flex items-center text-gray-700 hover:text-black">
                                            <IoIosArrowRoundBack size={28} />
                                        </button>

                                        <h1 className="text-2xl font-semibold text-gray-800">
                                            Profile Management
                                        </h1>
                                    </div>

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
                                        <p className="ml-4 text-lg font-medium text-gray-700">Loading profiles...</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 mb-3">
                                            <thead className="bg-gray-900 text-white">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Phone</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Location</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Featured</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-gray-300">
                                                {currentProfiles && currentProfiles.length > 0 ? (
                                                    currentProfiles.map((profile) => (
                                                        <tr key={profile._id} className="hover:bg-gray-100 transition">
                                                            <td className="px-6 py-4 text-xs font-medium border">{profile.name || "N/A"}</td>
                                                            <td className="px-6 py-4 text-xs border">{profile.email || "N/A"}</td>
                                                            <td className="px-6 py-4 text-xs border">{profile.userId?.phone || "N/A"}</td>
                                                            <td className="px-6 py-4 text-xs border">{profile.location || "N/A"}</td>
                                                            <td className="px-6 py-4 border">
                                                                <button
                                                                    className={`px-3 py-1 text-xs rounded ${profile.featured
                                                                        ? "bg-red-500 text-white hover:bg-red-600"
                                                                        : "bg-green-500 text-white hover:bg-green-600"
                                                                        }`}
                                                                    onClick={() => toggleFeatured(profile._id, profile.featured)}
                                                                >
                                                                    {profile.featured ? "Unmark" : "Mark"}
                                                                </button>
                                                            </td>
                                                            <td className="px-6 py-4 border">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                                    title="View Profile"
                                                                    onClick={() => handleProfile(profile._id)}
                                                                >
                                                                    <Eye size={20} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="15" className="text-center py-6 text-gray-500">
                                                            No Profiles Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                        {filteredProfiles.length > 0 && (
                                            <div className="flex justify-center space-x-2 py-4">
                                                <button
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                                >
                                                    Prev
                                                </button>

                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-gray-900 text-white" : ""}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}

                                                <button
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
