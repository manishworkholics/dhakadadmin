"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Ban, Trash2, Check, X, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [planFilter, setPlanFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [plans, setPlans] = useState([]);

    const itemsPerPage = 10;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("admintoken"));
        }
    }, []);

    const fetchPlans = async () => {
        const res = await axios.get("http://143.110.244.163:5000/api/plan");
        setPlans(res.data.plans || []);
    };

    useEffect(() => {
        fetchPlans();
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
                        plan: planFilter,
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
    }, [token, currentPage, debouncedSearch, planFilter]); // ✅ ADD THIS

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
        <AdminShell>
            <Card className="p-4 md:p-6">
                <PageHeader
                    title="User Management"
                    actions={
                        <>
                            <Button
                                variant="outline"
                                leftIcon={<ArrowLeft />}
                                onClick={handleBackout}
                            >
                                Back
                            </Button>
                            <div className="w-full md:w-80">
                                <Input
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search by name, email, phone, location..."
                                />
                            </div>
                            <div className="w-full md:w-56">
                                <Select
                                    value={planFilter}
                                    onChange={(e) => {
                                        setPlanFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">All Plans</option>
                                    <option value="free">Free</option>
                                    {plans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </>
                    }
                />

                {loading ? (
                    <Loader label="Loading users..." />
                ) : (
                    <>
                        <div className="mt-4">
                            <Table
                                columns={[
                                    { key: "name", header: "Name" },
                                    { key: "email", header: "Email" },
                                    { key: "phone", header: "Phone" },
                                    {
                                        key: "plan",
                                        header: "Plan",
                                        render: (user) =>
                                            user.currentPlan ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-primary">
                                                        {user.currentPlan.plan?.name || "Plan"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.currentPlan.status === "active" ? (
                                                            <Badge variant="success" className="mr-2">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="danger" className="mr-2">
                                                                Expired
                                                            </Badge>
                                                        )}
                                                        <span>
                                                            Exp:{" "}
                                                            {new Date(user.currentPlan.endDate).toLocaleDateString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <Badge>Free Plan</Badge>
                                            ),
                                    },
                                    { key: "createdfor", header: "Create for" },
                                    {
                                        key: "isVerified",
                                        header: "Verified",
                                        render: (user) =>
                                            user.isVerified ? (
                                                <Badge variant="success">Yes</Badge>
                                            ) : (
                                                <Badge variant="danger">No</Badge>
                                            ),
                                    },
                                    {
                                        key: "isBlocked",
                                        header: "Blocked",
                                        render: (user) =>
                                            user.isBlocked ? (
                                                <Badge variant="danger">Yes</Badge>
                                            ) : (
                                                <Badge variant="success">No</Badge>
                                            ),
                                    },
                                    {
                                        key: "actions",
                                        header: "Action",
                                        render: (user) => (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 w-9 px-0"
                                                    onClick={() => handleBlock(user._id)}
                                                    title={user.isBlocked ? "Unblock user" : "Block user"}
                                                >
                                                    <Ban />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 w-9 px-0"
                                                    onClick={() => handleVerify(user._id)}
                                                    title={user.isVerified ? "Remove verification" : "Verify user"}
                                                >
                                                    {user.isVerified ? <X /> : <Check />}
                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="h-9 w-9 px-0"
                                                    onClick={() => handleDelete(user._id)}
                                                    title="Delete user"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        ),
                                    },
                                ]}
                                rows={users}
                                emptyText="No users found"
                            />
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center mt-5 gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
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
                                            onClick={() => handlePageChange(1)}
                                        >
                                            1
                                        </Button>
                                    );
                                    if (start > 2) pages.push(<span key="start-dots" className="px-1 text-muted-foreground">...</span>);
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <Button
                                            key={i}
                                            variant={currentPage === i ? "primary" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(i)}
                                        >
                                            {i}
                                        </Button>
                                    );
                                }

                                if (end < totalPages) {
                                    if (end < totalPages - 1) pages.push(<span key="end-dots" className="px-1 text-muted-foreground">...</span>);
                                    pages.push(
                                        <Button
                                            key={totalPages}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(totalPages)}
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
                                onClick={() => handlePageChange(currentPage + 1)}
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

export default ProtectedRoute(Page);
