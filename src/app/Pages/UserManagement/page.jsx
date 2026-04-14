"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Ban, Trash2, Check, X, ArrowLeft, Edit2 } from "lucide-react";
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

const API = "http://143.110.244.163:5000";

const EditUserModal = ({ user, isOpen, onClose, onSave, token, plans }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        plan: {
            planId: "",
            startDate: "",
            status: "active",
            paymentStatus: "paid",
        },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                plan: {
                    planId: user.currentPlan?.plan?._id || "",
                    startDate: user.currentPlan?.startDate
                        ? user.currentPlan.startDate.split("T")[0]
                        : new Date().toISOString().split("T")[0],
                    status: user.currentPlan?.status || "active",
                    paymentStatus: user.currentPlan?.paymentStatus || "paid",
                },
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePlanChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            plan: {
                ...prev.plan,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                ...(formData.password && { password: formData.password }),
                plan: {
                    planId: formData.plan.planId,
                    startDate: formData.plan.startDate,
                    status: formData.plan.status,
                    paymentStatus: formData.plan.paymentStatus,
                },
            };

            const res = await axios.put(
                `${API}/api/admin/users/${user._id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                toast.success("User updated successfully!");
                onSave();
                onClose();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold">Edit User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                            User Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter user name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Phone *
                                </label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Password (Leave empty to keep current)
                                </label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Plan Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                            Plan & Payment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Select Plan
                                </label>
                                <select
                                    name="planId"
                                    value={formData.plan.planId}
                                    onChange={handlePlanChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
                                >
                                    <option value="">Choose a plan</option>
                                    <option value="">Free Plan</option>
                                    {plans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Plan Start Date
                                </label>
                                <Input
                                    name="startDate"
                                    type="date"
                                    value={formData.plan.startDate}
                                    onChange={handlePlanChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Plan Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.plan.status}
                                    onChange={handlePlanChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Payment Status
                                </label>
                                <select
                                    name="paymentStatus"
                                    value={formData.plan.paymentStatus}
                                    onChange={handlePlanChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Update User"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("admintoken"));
        }
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await axios.get(`${API}/api/plan`);
            setPlans(res.data.plans || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
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

            const res = await axios.get(`${API}/api/admin/users`, {
                params: {
                    search: debouncedSearch,
                    page: currentPage,
                    limit: itemsPerPage,
                    plan: planFilter,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setUsers(res.data.users);
                setTotalUsers(res.data.total);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    }, [token, currentPage, debouncedSearch, planFilter]);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token, fetchUsers]);

    // 🔍 Search Handler
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Open Edit Modal
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    // Close Modal and Refresh
    const handleModalClose = () => {
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleModalSave = () => {
        fetchUsers();
    };

    // Block User
    const handleBlock = async (userId) => {
        try {
            const res = await axios.put(
                `${API}/api/admin/users/${userId}/block`,
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

    // Verify User
    const handleVerify = async (userId) => {
        try {
            const res = await axios.put(
                `${API}/api/admin/users/${userId}/verify`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const message = res.data.message?.toLowerCase() || "";

                if (message.includes("unverified")) {
                    toast.success("Verification removed successfully!");
                } else if (message.includes("verified")) {
                    toast.success("User verified successfully!");
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
            const res = await axios.delete(`${API}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

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
        router.push("/Pages/Dashboard");
    };

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
                                                            {new Date(
                                                                user.currentPlan.endDate
                                                            ).toLocaleDateString("en-IN")}
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
                                                    onClick={() => handleEditClick(user)}
                                                    title="Edit user details & plan"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>

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
                                                    title={
                                                        user.isVerified
                                                            ? "Remove verification"
                                                            : "Verify user"
                                                    }
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
                                    if (start > 2)
                                        pages.push(
                                            <span
                                                key="start-dots"
                                                className="px-1 text-muted-foreground"
                                            >
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
                                            onClick={() => handlePageChange(i)}
                                        >
                                            {i}
                                        </Button>
                                    );
                                }

                                if (end < totalPages) {
                                    if (end < totalPages - 1)
                                        pages.push(
                                            <span
                                                key="end-dots"
                                                className="px-1 text-muted-foreground"
                                            >
                                                ...
                                            </span>
                                        );
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

            {/* Edit User Modal */}
            <EditUserModal
                user={selectedUser}
                isOpen={editModalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
                token={token}
                plans={plans}
            />
        </AdminShell>
    );
};

export default ProtectedRoute(Page);