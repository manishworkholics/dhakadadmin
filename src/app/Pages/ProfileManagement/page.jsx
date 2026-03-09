"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header/page.jsx";
import Sidebar from "@/app/Components/Sidebar/page";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

const API = "http://143.110.244.163:5000";

const Page = () => {

    const [token, setToken] = useState(null)

    const [profiles, setProfiles] = useState([])
    const [filteredProfiles, setFilteredProfiles] = useState([])

    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")

    const [selectedProfiles, setSelectedProfiles] = useState([])
    const [selectedProfile, setSelectedProfile] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 10



    // ================= AGE CALCULATOR =================

    const calculateAge = (dob) => {

        if (!dob) return "N/A"

        const birth = new Date(dob)
        const diff = Date.now() - birth.getTime()
        const ageDate = new Date(diff)

        return Math.abs(ageDate.getUTCFullYear() - 1970)

    }



    // ================= TOKEN =================

    useEffect(() => {

        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"))
        }

    }, [])



    // ================= FETCH PROFILES =================

    const fetchProfiles = useCallback(async () => {

        if (!token) return

        try {

            setLoading(true)

            const res = await axios.get(
                `${API}/api/admin/profiles`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res.data.success) {

                setProfiles(res.data.profiles)
                setFilteredProfiles(res.data.profiles)

            }

        } catch (err) {

            toast.error("Failed to load profiles")

        }

        setLoading(false)

    }, [token])



    useEffect(() => {

        if (token) fetchProfiles()

    }, [token, fetchProfiles])



    // ================= SEARCH + FILTER =================

    useEffect(() => {

        let data = [...profiles]

        if (search) {

            data = data.filter(p =>
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.location?.toLowerCase().includes(search.toLowerCase())
            )

        }

        if (filter === "approved") data = data.filter(p => p.isVisible)
        if (filter === "pending") data = data.filter(p => !p.isVisible)
        if (filter === "featured") data = data.filter(p => p.featured)
        if (filter === "male") data = data.filter(p => p.gender === "male")
        if (filter === "female") data = data.filter(p => p.gender === "female")

        setFilteredProfiles(data)

    }, [search, filter, profiles])



    // ================= BULK SELECT =================

    const toggleSelect = (id) => {

        if (selectedProfiles.includes(id)) {

            setSelectedProfiles(selectedProfiles.filter(p => p !== id))

        } else {

            setSelectedProfiles([...selectedProfiles, id])

        }

    }



    // ================= BULK APPROVE =================

    const bulkApprove = async () => {

        for (const id of selectedProfiles) {

            await axios.put(
                `${API}/api/admin/profiles/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )

        }

        toast.success("Profiles approved")

        setSelectedProfiles([])

        fetchProfiles()

    }



    // ================= BULK REJECT =================

    const bulkReject = async () => {

        for (const id of selectedProfiles) {

            await axios.put(
                `${API}/api/admin/profiles/${id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )

        }

        toast.success("Profiles rejected")

        setSelectedProfiles([])

        fetchProfiles()

    }



    // ================= FEATURED =================

    const toggleFeatured = async (id, isFeatured) => {

        const url = isFeatured
            ? "/api/featured/unmark"
            : "/api/featured/mark"

        await axios.post(
            `${API}${url}`,
            { profileId: id },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        fetchProfiles()

    }



    // ================= PAGINATION =================

    const last = currentPage * perPage
    const first = last - perPage

    const current = filteredProfiles.slice(first, last)

    const totalPages = Math.ceil(filteredProfiles.length / perPage)



    return (

        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Header />


                <div className="p-6 space-y-6 overflow-auto">


                    {/* ================= STATS ================= */}

                    <div className="grid grid-cols-4 gap-6">

                        <div className="bg-white p-5 rounded-2xl shadow border">
                            <p className="text-gray-500 text-sm">Total Profiles</p>
                            <h2 className="text-2xl font-bold mt-1">{profiles.length}</h2>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow border">
                            <p className="text-gray-500 text-sm">Approved</p>
                            <h2 className="text-2xl font-bold text-green-600">
                                {profiles.filter(p => p.isVisible).length}
                            </h2>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow border">
                            <p className="text-gray-500 text-sm">Pending</p>
                            <h2 className="text-2xl font-bold text-yellow-600">
                                {profiles.filter(p => !p.isVisible).length}
                            </h2>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow border">
                            <p className="text-gray-500 text-sm">Featured</p>
                            <h2 className="text-2xl font-bold text-blue-600">
                                {profiles.filter(p => p.featured).length}
                            </h2>
                        </div>

                    </div>



                    {/* ================= SEARCH + FILTER ================= */}

                    <div className="flex justify-between items-center">

                        <input
                            placeholder="Search profiles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
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



                    {/* ================= BULK ACTIONS ================= */}

                    {selectedProfiles.length > 0 && (

                        <div className="space-x-3">

                            <button
                                onClick={bulkApprove}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                                Approve Selected
                            </button>

                            <button
                                onClick={bulkReject}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Reject Selected
                            </button>

                        </div>

                    )}



                    {/* ================= TABLE ================= */}

                    <div className="bg-white rounded-2xl shadow border overflow-hidden">

                        {loading ? (

                            <div className="p-10 text-center">Loading profiles...</div>

                        ) : (


                            <table className="w-full text-sm">

                                <thead className="bg-slate-900 text-white">

                                    <tr>

                                        <th className="px-6 py-4"></th>
                                        <th className="px-6 py-4 text-left">Photo</th>
                                        <th className="px-6 py-4 text-left">Name</th>
                                        <th className="px-6 py-4 text-left">Age</th>
                                        <th className="px-6 py-4 text-left">Gender</th>
                                        <th className="px-6 py-4 text-left">Location</th>
                                        <th className="px-6 py-4 text-left">Score</th>
                                        <th className="px-6 py-4 text-left">Featured</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-left">Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {current.map(profile => (

                                        <tr
                                            key={profile._id}
                                            className="border-b hover:bg-blue-50 transition"
                                        >

                                            <td className="px-6 py-4">

                                                <input
                                                    type="checkbox"
                                                    checked={selectedProfiles.includes(profile._id)}
                                                    onChange={() => toggleSelect(profile._id)}
                                                />

                                            </td>


                                            <td className="px-6 py-4">

                                                <img
                                                    src={profile.photos?.[0] || `https://ui-avatars.com/api/?name=${profile.name}`}
                                                    className="w-11 h-11 rounded-full object-cover border"
                                                />

                                            </td>


                                            <td className="px-6 py-4 font-medium">
                                                {profile.name}
                                            </td>


                                            <td className="px-6 py-4">
                                                {calculateAge(profile.dob)}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className={`px-3 py-1 text-xs rounded-full font-medium
${profile.gender === "male"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-pink-100 text-pink-600"
                                                    }`}>

                                                    {profile.gender}

                                                </span>

                                            </td>


                                            <td className="px-6 py-4">
                                                {profile.location}
                                            </td>


                                            <td className="px-6 py-4">

                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">

                                                    {profile.profileScore || 0}%

                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() => toggleFeatured(profile._id, profile.featured)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium
${profile.featured
                                                            ? "bg-red-500 text-white"
                                                            : "bg-green-500 text-white"
                                                        }`}
                                                >

                                                    {profile.featured ? "Unmark" : "Mark"}

                                                </button>

                                            </td>


                                            <td className="px-6 py-4">

                                                {profile.isVisible
                                                    ? <span className="text-green-600 font-medium">Approved</span>
                                                    : <span className="text-yellow-500 font-medium">Pending</span>
                                                }

                                            </td>


                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() => setSelectedProfile(profile)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >

                                                    <Eye size={18} />

                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}


                    </div>



                    {/* ================= PAGINATION ================= */}

                    <div className="flex justify-center gap-2">

                        <button
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                            className="border px-3 py-1 rounded"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded
${currentPage === i + 1 ? "bg-black text-white" : ""}
`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages}
                            className="border px-3 py-1 rounded"
                        >
                            Next
                        </button>

                    </div>



                    {/* ================= PROFILE MODAL ================= */}

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

            </div>

        </div>

    )

}

export default Page