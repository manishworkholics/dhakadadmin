"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";

const API = "http://143.110.244.163:5000";

const ViewProfileModal = ({ profile, isOpen, onClose }) => {
    if (!isOpen || !profile) return null;

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birth = new Date(dob);
        const diff = Date.now() - birth.getTime();
        return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Photos Section */}
                    {profile.photos && profile.photos.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Photos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {profile.photos.map((photo, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={photo}
                                            alt={`Photo ${idx + 1}`}
                                            className="w-full h-40 object-cover hover:scale-110 transition-transform"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-semibold">{profile.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold">{profile.userId?.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date of Birth</p>
                                <p className="font-semibold">{new Date(profile.dob).toLocaleDateString("en-IN")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="font-semibold">{calculateAge(profile.dob)} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-semibold capitalize">{profile.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Personal Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Height</p>
                                <p className="font-semibold">{profile.height || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Physical Status</p>
                                <p className="font-semibold">{profile.physicalStatus || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Marital Status</p>
                                <p className="font-semibold">{profile.maritalStatus || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Skin Tone</p>
                                <p className="font-semibold">{profile.skinTone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-semibold">{profile.location || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Mother Tongue</p>
                                <p className="font-semibold">{profile.motherTongue || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Religious Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Religious Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Religion</p>
                                <p className="font-semibold">{profile.religion || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Caste</p>
                                <p className="font-semibold">{profile.caste || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Sub Caste</p>
                                <p className="font-semibold">{profile.subCaste || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Gotra</p>
                                <p className="font-semibold">{profile.gotra || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Birth Place</p>
                                <p className="font-semibold">{profile.birthPlace || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Birth Time</p>
                                <p className="font-semibold">{profile.birthTime || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Professional Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Education</p>
                                <p className="font-semibold">{profile.educationDetails || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Employment Type</p>
                                <p className="font-semibold capitalize">{profile.employmentType || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Occupation</p>
                                <p className="font-semibold capitalize">{profile.occupation || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Annual Income</p>
                                <p className="font-semibold">{profile.annualIncome?.replace(/_/g, " - ") || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Family Status</p>
                                <p className="font-semibold">{profile.familyStatus || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Diet</p>
                                <p className="font-semibold">{profile.diet || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* About & Hobbies */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">About & Interests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">About Yourself</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{profile.aboutYourself || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Hobbies</p>
                                <p className="text-gray-800 whitespace-pre-wrap">{profile.hobbies || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Meta Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Profile Score</p>
                                <p className="font-semibold">{profile.profileScore || 0}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <Badge variant={profile.isVisible ? "success" : "warning"}>
                                    {profile.isVisible ? "Approved" : "Pending"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Featured</p>
                                <Badge variant={profile.featured ? "success" : "secondary"}>
                                    {profile.featured ? "Yes" : "No"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Views</p>
                                <p className="font-semibold">{profile.viewedBy?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Created & Updated */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <p className="text-sm text-gray-600">Created On</p>
                            <p className="text-sm font-semibold">
                                {new Date(profile.createdAt).toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Last Updated</p>
                            <p className="text-sm font-semibold">
                                {new Date(profile.updatedAt).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-6 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const Page = () => {
    const router = useRouter();

    const [token, setToken] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filterMaritalStatus, setFilterMaritalStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const perPage = 10;

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birth = new Date(dob);
        const diff = Date.now() - birth.getTime();
        return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("admintoken"));
        }
    }, []);

    const fetchProfiles = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);

            const params = {
                page: currentPage,
                limit: perPage,
                search,
            };

            if (filterMaritalStatus) {
                params.maritalStatus = filterMaritalStatus;
            }

            const res = await axios.get(`${API}/api/admin/profiles`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setProfiles(res.data.profiles);
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            toast.error("Failed to load profiles");
        }

        setLoading(false);
    }, [token, currentPage, search, filterMaritalStatus]);

    useEffect(() => {
        if (token) fetchProfiles();
    }, [fetchProfiles, token]);

    const handleViewProfile = (profile) => {
        setSelectedProfile(profile);
        setViewModalOpen(true);
    };

    return (
        <AdminShell>
            <Card className="p-4 md:p-6">

                <PageHeader
                    title="Profile Management"
                    actions={
                        <>
                            <div className="w-full md:w-80">
                                <Input
                                    placeholder="Search profiles..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <div className="w-full md:w-56">
                                <Select
                                    value={filterMaritalStatus}
                                    onChange={(e) => {
                                        setFilterMaritalStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="Married">Married</option>
                                    <option value="Never married">Never Married</option>
                                    <option value="Divorced">Previously Married (Divorced)</option>
                                    <option value="Widower">Previously Married (Widowed)</option>
                                    <option value="Awaiting divorce">Legally Separated / Awaiting Divorce</option>
                                </Select>
                            </div>
                        </>
                    }
                />

                {loading ? (
                    <Loader label="Loading profiles..." />
                ) : (
                    <>
                        <div className="mt-4">
                            <Table
                                columns={[
                                    { key: "name", header: "Name" },
                                    {
                                        key: "age",
                                        header: "Age",
                                        render: (p) => calculateAge(p.dob),
                                    },
                                    {
                                        key: "gender",
                                        header: "Gender",
                                        render: (p) => (
                                            <Badge variant={p.gender === "male" ? "info" : "secondary"}>
                                                {p.gender}
                                            </Badge>
                                        ),
                                    },
                                    {
                                        key: "maritalStatus",
                                        header: "Marital Status",
                                        render: (p) => (
                                            <Badge variant="secondary">{p.maritalStatus}</Badge>
                                        ),
                                    },
                                    { key: "location", header: "Location" },
                                    {
                                        key: "score",
                                        header: "Score",
                                        render: (p) => (
                                            <Badge variant="success">
                                                {p.profileScore || 0}%
                                            </Badge>
                                        ),
                                    },
                                    {
                                        key: "status",
                                        header: "Status",
                                        render: (p) =>
                                            p.isVisible ? (
                                                <Badge variant="success">Approved</Badge>
                                            ) : (
                                                <Badge variant="warning">Pending</Badge>
                                            ),
                                    },
                                    {
                                        key: "featured",
                                        header: "Featured",
                                        render: (p) => (
                                            <Button
                                                size="sm"
                                                variant={p.featured ? "danger" : "primary"}
                                                onClick={async () => {
                                                    try {
                                                        const url = p.featured
                                                            ? "/api/featured/unmark"
                                                            : "/api/featured/mark";

                                                        await axios.post(`${API}${url}`, {
                                                            profileId: p._id,
                                                        }, {
                                                            headers: { Authorization: `Bearer ${token}` },
                                                        });

                                                        fetchProfiles();
                                                        toast.success(p.featured ? "Profile unmarked" : "Profile marked as featured");
                                                    } catch (err) {
                                                        toast.error("Failed to update featured status");
                                                    }
                                                }}
                                            >
                                                {p.featured ? "Unmark" : "Mark"}
                                            </Button>
                                        ),
                                    },
                                    {
                                        key: "actions",
                                        header: "Action",
                                        render: (p) => (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.push(`/Pages/ProfileManagement/edit/${p._id}`)
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewProfile(p)}
                                                    title="View full profile"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            </div>
                                        ),
                                    },
                                ]}
                                rows={profiles}
                                emptyText="No profiles found"
                            />
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center mt-5 gap-2 flex-wrap">

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </Button>

                            {(() => {
                                const pages = [];
                                const maxVisible = 5;

                                let start = Math.max(currentPage - 2, 1);
                                let end = Math.min(start + maxVisible - 1, totalPages);

                                if (end - start < maxVisible - 1) {
                                    start = Math.max(end - maxVisible + 1, 1);
                                }

                                if (start > 1) {
                                    pages.push(
                                        <Button
                                            key={1}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(1)}
                                        >
                                            1
                                        </Button>
                                    );

                                    if (start > 2)
                                        pages.push(
                                            <span key="start-dots" className="px-1 text-muted-foreground">
                                                ...
                                            </span>
                                        );
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <Button
                                            key={i}
                                            variant={currentPage === i ? "primary" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(i)}
                                        >
                                            {i}
                                        </Button>
                                    );
                                }

                                if (end < totalPages) {
                                    if (end < totalPages - 1)
                                        pages.push(
                                            <span key="end-dots" className="px-1 text-muted-foreground">
                                                ...
                                            </span>
                                        );

                                    pages.push(
                                        <Button
                                            key={totalPages}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(totalPages)}
                                        >
                                            {totalPages}
                                        </Button>
                                    );
                                }

                                return pages;
                            })()}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>

                        </div>
                    </>
                )}
            </Card>

            {/* View Profile Modal */}
            <ViewProfileModal
                profile={selectedProfile}
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
            />
        </AdminShell>
    );
};

export default Page;