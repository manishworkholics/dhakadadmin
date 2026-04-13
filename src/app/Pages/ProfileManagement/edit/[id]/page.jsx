"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../Common_Method/protectedroute";
import AdminShell from "@/components/layout/AdminShell";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

const API = "http://143.110.244.163:5000";

const Page = () => {
    const { id } = useParams();
    const router = useRouter();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setToken(localStorage.getItem("admintoken"));
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
        <AdminShell>
            <Card className="p-4 md:p-6">
                <PageHeader
                    title="Edit Profile"
                    actions={
                        <Button variant="outline" leftIcon={<ArrowLeft />} onClick={handleBack}>
                            Back
                        </Button>
                    }
                />

                {loading ? (
                    <Loader label="Loading profile..." />
                ) : (
                    <div className="mt-4">
                        {/* IMAGE */}
                        <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
                            {profile.photos?.map((img, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={i}
                                    src={img}
                                    className="w-24 h-24 rounded-lg object-cover border border-border"
                                    alt=""
                                />
                            ))}
                        </div>

                        {/* FORM */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input name="name" value={profile.name || ""} onChange={handleChange} placeholder="Name" />
                            <Input name="location" value={profile.location || ""} onChange={handleChange} placeholder="Location" />
                            <Input name="height" value={profile.height || ""} onChange={handleChange} placeholder="Height" />
                            <Input name="religion" value={profile.religion || ""} onChange={handleChange} placeholder="Religion" />

                            <Input name="caste" value={profile.caste || ""} onChange={handleChange} placeholder="Caste" />
                            <Input name="subCaste" value={profile.subCaste || ""} onChange={handleChange} placeholder="Sub Caste" />
                            <Input name="gotra" value={profile.gotra || ""} onChange={handleChange} placeholder="Gotra" />

                            <Input
                                name="educationDetails"
                                value={profile.educationDetails || ""}
                                onChange={handleChange}
                                placeholder="Education"
                            />
                            <Input
                                name="occupation"
                                value={profile.occupation || ""}
                                onChange={handleChange}
                                placeholder="Occupation"
                            />
                            <Input
                                name="employmentType"
                                value={profile.employmentType || ""}
                                onChange={handleChange}
                                placeholder="Employment Type"
                            />

                            <Input
                                name="annualIncome"
                                value={profile.annualIncome || ""}
                                onChange={handleChange}
                                placeholder="Income"
                            />
                            <Input
                                name="familyStatus"
                                value={profile.familyStatus || ""}
                                onChange={handleChange}
                                placeholder="Family Status"
                            />
                            <Input name="diet" value={profile.diet || ""} onChange={handleChange} placeholder="Diet" />
                            <Input name="hobbies" value={profile.hobbies || ""} onChange={handleChange} placeholder="Hobbies" />
                        </div>

                        {/* TEXTAREA */}
                        <textarea
                            name="aboutYourself"
                            value={profile.aboutYourself || ""}
                            onChange={handleChange}
                            placeholder="About Yourself"
                            className="ui-input mt-4 h-28 resize-y py-2"
                        />

                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleUpdate}>Update Profile</Button>
                        </div>
                    </div>
                )}
            </Card>
        </AdminShell>
    );
};

export default ProtectedRoute(Page);