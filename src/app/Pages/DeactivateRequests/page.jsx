"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import ProtectedRoute from "../Common_Method/protectedroute.js";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import api from "@/services/api";
import { handleApiError } from "@/utils/apiErrorHandler";

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusVariant = (status) => {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
};

function RequestReviewModal({
  open,
  request,
  remark,
  saving,
  onRemarkChange,
  onClose,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  const user = request.user || {};
  const isPending = request.status === "pending";

  return (
    <Modal
      open={open}
      title="Review Deactivation Request"
      onClose={onClose}
      size="md"
      footer={
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={onReject}
            disabled={saving || !isPending}
            leftIcon={<XCircle />}
          >
            {saving ? "Saving..." : "Reject"}
          </Button>
          <Button
            variant="success"
            onClick={onApprove}
            disabled={saving || !isPending}
            leftIcon={<CheckCircle2 />}
          >
            {saving ? "Saving..." : "Approve"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              User Name
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {user.name || "-"}
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <div className="mt-1">
              <Badge variant={getStatusVariant(request.status)}>
                {request.status || "-"}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </p>
            <p className="mt-1 text-sm text-foreground">{user.email || "-"}</p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Phone
            </p>
            <p className="mt-1 text-sm text-foreground">{user.phone || "-"}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Request Reason
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {request.reason || "No reason provided"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Requested At
            </p>
            <p className="mt-1 text-sm text-foreground">
              {formatDateTime(request.requestedAt)}
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Updated At
            </p>
            <p className="mt-1 text-sm text-foreground">
              {formatDateTime(request.updatedAt)}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Admin Remark
          </label>
          <textarea
            value={remark}
            onChange={(e) => onRemarkChange(e.target.value)}
            rows={4}
            placeholder="Add a note before approving or rejecting..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-soft-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
            disabled={saving}
          />
          {!isPending ? (
            <p className="mt-2 text-xs text-muted-foreground">
              This request has already been processed.
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

function DeactivateRequestsPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminRemark, setAdminRemark] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admintoken"));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRequests = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await api.get("/api/admin/deactivate-requests", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data || {};
      setRequests(data.requests || []);
      setTotal(data.total || 0);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    [total]
  );

  const handleBack = () => {
    router.push("/Pages/Dashboard");
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setAdminRemark(request.adminRemark || "");
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setAdminRemark("");
  };

  const updateRequestStatus = async (status) => {
    if (!selectedRequest?._id) return;

    try {
      setSaving(true);

      await api.put(
        `/api/admin/deactivate-requests/${selectedRequest._id}`,
        {
          status,
          adminRemark: adminRemark.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Request ${status === "approved" ? "approved" : "rejected"} successfully`
      );

      handleCloseModal();
      fetchRequests();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminShell>
      <Card className="p-4 md:p-6">
        <PageHeader
          title="Account Deactivation Requests"
          description="Review pending user requests and approve or reject them with an admin remark."
          actions={
            <>
              <Button
                variant="outline"
                leftIcon={<ArrowLeft />}
                onClick={handleBack}
              >
                Back
              </Button>
              <div className="w-full md:w-64">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone..."
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          }
        />

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Current Filter</p>
            <p className="mt-1 text-2xl font-semibold capitalize text-foreground">
              {statusFilter}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Current Page</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {currentPage} / {totalPages}
            </p>
          </Card>
        </div>

        <div className="mt-6">
          {loading ? (
            <Loader label="Loading deactivation requests..." />
          ) : (
            <Table
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (row) => (
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {row.user?.name || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.user?.email || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.user?.phone || "-"}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "reason",
                  header: "Reason",
                  render: (row) => (
                    <p className="max-w-md whitespace-normal text-sm leading-6 text-foreground">
                      {row.reason || "-"}
                    </p>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <Badge variant={getStatusVariant(row.status)}>
                      {row.status || "-"}
                    </Badge>
                  ),
                },
                {
                  key: "requestedAt",
                  header: "Requested At",
                  render: (row) => formatDateTime(row.requestedAt),
                },
                {
                  key: "actions",
                  header: "Action",
                  render: (row) => (
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Eye />}
                      onClick={() => handleOpenModal(row)}
                    >
                      Review
                    </Button>
                  ),
                },
              ]}
              rows={requests}
              emptyText="No deactivation requests found"
            />
          )}
        </div>

        {!loading ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        ) : null}
      </Card>

      <RequestReviewModal
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        remark={adminRemark}
        saving={saving}
        onRemarkChange={setAdminRemark}
        onClose={handleCloseModal}
        onApprove={() => updateRequestStatus("approved")}
        onReject={() => updateRequestStatus("rejected")}
      />
    </AdminShell>
  );
}

export default ProtectedRoute(DeactivateRequestsPage);
