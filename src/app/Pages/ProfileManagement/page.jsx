"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
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

const Page = () => {
    const router = useRouter();

    const [token, setToken] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

            const res = await axios.get(`${API}/api/admin/profiles`, {
                params: {
                    page: currentPage,
                    limit: perPage,
                    search,
                    filter,
                },
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
    }, [token, currentPage, search, filter]);

    useEffect(() => {
        if (token) fetchProfiles();
    }, [fetchProfiles, token]);

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
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">All</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="featured">Featured</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
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
                                                    const url = p.featured
                                                        ? "/api/featured/unmark"
                                                        : "/api/featured/mark";

                                                    await axios.post(`${API}${url}`, {
                                                        profileId: p._id,
                                                    }, {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    });

                                                    fetchProfiles();
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
                                                    onClick={() => alert("View modal later")}
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
        </AdminShell>
    );
};

export default Page;