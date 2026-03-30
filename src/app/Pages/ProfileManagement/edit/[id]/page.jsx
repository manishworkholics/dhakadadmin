"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/Components/Header/page";
import Sidebar from "@/app/Components/Sidebar/page";
import ProtectedRoute from "../../../Common_Method/protectedroute";
import { IoIosArrowRoundBack } from "react-icons/io";

const API = "http://143.110.244.163:5000";

const Page = () => {
    const { id } = useParams();
    const router = useRouter();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    // ================= FETCH =================
    useEffect(() => {
        if (!token || !id) return;

        axios
            .get(`${API}/api/admin/profiles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setProfile(res.data.profile);
            })
            .catch(() => toast.error("Failed to load"))
            .finally(() => setLoading(false));
    }, [token, id]);

    // ================= CHANGE =================
    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    // ================= UPDATE =================
    const handleUpdate = async () => {
        try {
            await axios.put(
                `${API}/api/admin/profile-update-user/${id}`,
                profile,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Profile updated successfully 🔥");
            router.push("/Pages/ProfileManagement");

        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleBack = () => {
        router.push("/Pages/ProfileManagement");
    };

    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Header />

                <div className="p-6 overflow-auto">

                    {/* HEADER */}
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={handleBack}>
                            <IoIosArrowRoundBack size={28} />
                        </button>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (

                        <div className="bg-white p-6 rounded-xl shadow">

                            {/* IMAGE */}
                            <div className="flex gap-4 mb-6">
                                {profile.photos?.map((img, i) => (
                                    <img key={i} src={img} className="w-24 h-24 rounded object-cover" />
                                ))}
                            </div>

                            {/* FORM */}
                            <div className="grid md:grid-cols-2 gap-4">

                                <input name="name" value={profile.name || ""} onChange={handleChange} placeholder="Name" className="input" />
                                <input name="location" value={profile.location || ""} onChange={handleChange} placeholder="Location" className="input" />
                                <input name="height" value={profile.height || ""} onChange={handleChange} placeholder="Height" className="input" />
                                <input name="religion" value={profile.religion || ""} onChange={handleChange} placeholder="Religion" className="input" />

                                <input name="caste" value={profile.caste || ""} onChange={handleChange} placeholder="Caste" className="input" />
                                <input name="subCaste" value={profile.subCaste || ""} onChange={handleChange} placeholder="Sub Caste" className="input" />
                                <input name="gotra" value={profile.gotra || ""} onChange={handleChange} placeholder="Gotra" className="input" />

                                <input name="educationDetails" value={profile.educationDetails || ""} onChange={handleChange} placeholder="Education" className="input" />
                                <input name="occupation" value={profile.occupation || ""} onChange={handleChange} placeholder="Occupation" className="input" />
                                <input name="employmentType" value={profile.employmentType || ""} onChange={handleChange} placeholder="Employment Type" className="input" />

                                <input name="annualIncome" value={profile.annualIncome || ""} onChange={handleChange} placeholder="Income" className="input" />
                                <input name="familyStatus" value={profile.familyStatus || ""} onChange={handleChange} placeholder="Family Status" className="input" />
                                <input name="diet" value={profile.diet || ""} onChange={handleChange} placeholder="Diet" className="input" />

                                <input name="hobbies" value={profile.hobbies || ""} onChange={handleChange} placeholder="Hobbies" className="input" />

                            </div>

                            {/* TEXTAREA */}
                            <textarea
                                name="aboutYourself"
                                value={profile.aboutYourself || ""}
                                onChange={handleChange}
                                placeholder="About Yourself"
                                className="w-full border p-3 rounded mt-4"
                            />

                            {/* BUTTON */}
                            <button
                                onClick={handleUpdate}
                                className="mt-4 bg-black text-white px-6 py-2 rounded"
                            >
                                Update Profile
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default ProtectedRoute(Page);