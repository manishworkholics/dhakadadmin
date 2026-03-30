"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const API = "http://143.110.244.163:5000";

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);

    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const perPage = 10;

    // ================= AGE =================
    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birth = new Date(dob);
        const diff = Date.now() - birth.getTime();
        return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };

    // ================= TOKEN =================
    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // ================= FETCH =================
    const fetchProfiles = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/admin/profiles`, {
                params: {
                    page: currentPage,
                    limit: perPage,
                    search,
                    filter
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setProfiles(res.data.profiles);
                setTotalPages(res.data.totalPages);
            }

        } catch (err) {
            toast.error("Failed to load profiles");
        }

        setLoading(false);

    }, [token, currentPage, search, filter]);

    useEffect(() => {
        if (token) fetchProfiles();
    }, [fetchProfiles, token]);

    // ================= BULK =================
    const toggleSelect = (id) => {
        if (selectedProfiles.includes(id)) {
            setSelectedProfiles(selectedProfiles.filter(p => p !== id));
        } else {
            setSelectedProfiles([...selectedProfiles, id]);
        }
    };

    const bulkApprove = async () => {
        for (const id of selectedProfiles) {
            await axios.put(`${API}/api/admin/profiles/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        toast.success("Approved");
        setSelectedProfiles([]);
        fetchProfiles();
    };

    const bulkReject = async () => {
        for (const id of selectedProfiles) {
            await axios.put(`${API}/api/admin/profiles/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        toast.success("Rejected");
        setSelectedProfiles([]);
        fetchProfiles();
    };

    const toggleFeatured = async (id, isFeatured) => {
        const url = isFeatured ? "/api/featured/unmark" : "/api/featured/mark";

        await axios.post(`${API}${url}`, { profileId: id }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchProfiles();
    };

    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Header />

                <div className="p-6 space-y-6 overflow-auto">

                    {/* SEARCH + FILTER */}
                    <div className="flex justify-between">

                        <input
                            placeholder="Search profiles..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border px-4 py-2 rounded-lg"
                        />

                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border px-4 py-2 rounded-lg"
                        >
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="featured">Featured</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        {loading ? (
                            <div className="p-10 text-center">Loading...</div>
                        ) : (

                            <table className="w-full text-sm border-collapse">

                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Photo</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Age</th>
                                        <th className="px-4 py-3">Gender</th>
                                        <th className="px-4 py-3">Location</th>
                                        <th className="px-4 py-3">Score</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Featured</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {profiles.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-6">
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (

                                        profiles.map((profile, index) => (

                                            <tr key={profile._id} className="border-b hover:bg-gray-50">

                                                {/* SR NO */}
                                                <td className="px-4 py-3">
                                                    {(currentPage - 1) * perPage + index + 1}
                                                </td>

                                                {/* PHOTO */}
                                                <td className="px-4 py-3">
                                                    <img
                                                        src={profile.photos?.[0] || `https://ui-avatars.com/api/?name=${profile.name}`}
                                                        className="w-10 h-10 rounded-full object-cover border"
                                                    />
                                                </td>

                                                {/* NAME */}
                                                <td className="px-4 py-3 font-medium">
                                                    {profile.name || "N/A"}
                                                </td>

                                                {/* AGE */}
                                                <td className="px-4 py-3">
                                                    {calculateAge(profile.dob)}
                                                </td>

                                                {/* GENDER */}
                                                <td className="px-4 py-3 capitalize">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${profile.gender === "male"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-pink-100 text-pink-600"}`}>
                                                        {profile.gender}
                                                    </span>
                                                </td>

                                                {/* LOCATION */}
                                                <td className="px-4 py-3">
                                                    {profile.location}
                                                </td>

                                                {/* SCORE */}
                                                <td className="px-4 py-3">
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                        {profile.profileScore || 0}%
                                                    </span>
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-4 py-3">
                                                    {profile.isVisible ? (
                                                        <span className="text-green-600 font-medium">Approved</span>
                                                    ) : (
                                                        <span className="text-yellow-500 font-medium">Pending</span>
                                                    )}
                                                </td>

                                                {/* FEATURED */}
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => toggleFeatured(profile._id, profile.featured)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium shadow
                                ${profile.featured
                                                                ? "bg-red-500 text-white"
                                                                : "bg-green-500 text-white"}`}
                                                    >
                                                        {profile.featured ? "Unmark" : "Mark"}
                                                    </button>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">

                                                        {/* VIEW */}
                                                        <button
                                                            onClick={() => setSelectedProfile(profile)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                            title="View Profile"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        {/* APPROVE / REJECT */}
                                                        {!profile.isVisible ? (
                                                            <button
                                                                onClick={async () => {
                                                                    await axios.put(
                                                                        `${API}/api/admin/profiles/${profile._id}/approve`,
                                                                        {},
                                                                        { headers: { Authorization: `Bearer ${token}` } }
                                                                    );
                                                                    fetchProfiles();
                                                                }}
                                                                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                                            >
                                                                Approve
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    await axios.put(
                                                                        `${API}/api/admin/profiles/${profile._id}/reject`,
                                                                        {},
                                                                        { headers: { Authorization: `Bearer ${token}` } }
                                                                    );
                                                                    fetchProfiles();
                                                                }}
                                                                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                                                            >
                                                                Reject
                                                            </button>
                                                        )}


                                                        <button
                                                            onClick={() => router.push(`/Pages/ProfileManagement/edit/${profile._id}`)}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                        {/* Prev */}
                        <button
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
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

                            // First page
                            if (start > 1) {
                                pages.push(
                                    <button
                                        key={1}
                                        onClick={() => setCurrentPage(1)}
                                        className="px-3 py-1 border rounded"
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
                                        onClick={() => setCurrentPage(i)}
                                        className={`px-3 py-1 border rounded 
                        ${currentPage === i ? "bg-black text-white" : ""}`}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            // Last page
                            if (end < totalPages) {
                                if (end < totalPages - 1) {
                                    pages.push(<span key="end-dots">...</span>);
                                }

                                pages.push(
                                    <button
                                        key={totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-3 py-1 border rounded"
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }

                            return pages;
                        })()}

                        {/* Next */}
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>

            {selectedProfile && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

                    <div className="bg-white p-6 rounded-xl w-[420px]">

                        <h2 className="text-lg font-semibold mb-4">
                            Profile Details
                        </h2>

                        <img
                            src={selectedProfile.photos?.[0]}
                            className="w-24 h-24 rounded-full mx-auto"
                        />

                        <div className="mt-4 space-y-2 text-sm">

                            <p><b>Name:</b> {selectedProfile.name}</p>
                            <p><b>Location:</b> {selectedProfile.location}</p>
                            <p><b>Occupation:</b> {selectedProfile.occupation}</p>
                            <p><b>Income:</b> {selectedProfile.annualIncome}</p>

                        </div>

                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="mt-4 bg-gray-900 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}
        </div>
    );
};

export default Page;