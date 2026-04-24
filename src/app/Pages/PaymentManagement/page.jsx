"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { Menu, Eye, Download } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import axios from "axios";

const API_URL =
  "https://dhakadmatrimony.com/api/plan/get-all-payment-history";

const PaymentManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admintoken") : null;

  // ================= LOAD PAYMENTS =================

  const loadPayments = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPayments(res.data.payments);
        setFiltered(res.data.payments);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // ================= SEARCH + FILTER =================

  useEffect(() => {
    let data = [...payments];

    if (search) {
      data = data.filter((p) => {
        const user = p.user || {};
        const plan = p.plan || {};

        return (
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          plan.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [search, statusFilter, payments]);

  // ================= ANALYTICS =================

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const success = payments.filter((p) => p.status === "paid").length;
  const failed = payments.filter((p) => p.status === "failed").length;

  // ================= PAGINATION =================

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  // ================= EXPORT CSV =================

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Plan", "Amount", "PaymentId", "Status"],
      ...payments.map((p) => [
        p?.user?.name,
        p?.user?.email,
        p?.plan?.name,
        p.amount,
        p.razorpayPaymentId,
        p.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "payments.csv";
    link.click();
  };

 return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader
        title="Payment Management"
        actions={
          <Button onClick={exportCSV} className="flex gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        }
      />

      {/* ================= ANALYTICS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <h2 className="text-xl font-bold text-green-600">
            ₹{Math.round(totalRevenue)}
          </h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Payments</p>
          <h2 className="text-xl font-bold">{payments.length}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Success</p>
          <h2 className="text-xl font-bold text-green-600">{success}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Failed</p>
          <h2 className="text-xl font-bold text-red-600">{failed}</h2>
        </Card>

      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">

        <div className="w-full md:w-80">
          <Input
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </Select>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="mt-6">
        <Table
          columns={[
            { key: "user", header: "User", render: (p) => p?.user?.name },
            { key: "email", header: "Email", render: (p) => p?.user?.email },
            { key: "plan", header: "Plan", render: (p) => p?.plan?.name },
            {
              key: "amount",
              header: "Amount",
              render: (p) => (
                <span className="font-semibold text-green-600">
                  ₹{p.amount}
                </span>
              ),
            },
            { key: "paymentId", header: "Payment ID", render: (p) => p.razorpayPaymentId },
            {
              key: "status",
              header: "Status",
              render: (p) => (
                <Badge
                  variant={
                    p.status === "paid"
                      ? "success"
                      : p.status === "failed"
                      ? "danger"
                      : "warning"
                  }
                >
                  {p.status}
                </Badge>
              ),
            },
            {
              key: "date",
              header: "Date",
              render: (p) =>
                new Date(p.createdAt).toLocaleDateString(),
            },
            {
              key: "action",
              header: "Action",
              render: (p) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(p)}
                >
                  <Eye size={16} />
                </Button>
              ),
            },
          ]}
          rows={paginated}
          emptyText="No payments found"
        />
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-3 mt-5">

        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages || 1}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>

      </div>

    </Card>

    {/* ================= MODAL ================= */}
    {selected && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <Card className="p-6 w-[400px]">

          <h2 className="text-lg font-semibold mb-4">
            Payment Details
          </h2>

          <div className="space-y-2 text-sm">
            <p><b>Name:</b> {selected?.user?.name}</p>
            <p><b>Email:</b> {selected?.user?.email}</p>
            <p><b>Plan:</b> {selected?.plan?.name}</p>
            <p><b>Amount:</b> ₹{selected.amount}</p>
            <p><b>Payment ID:</b> {selected.razorpayPaymentId}</p>
            <p><b>Status:</b> {selected.status}</p>
          </div>

          <Button
            className="mt-4 w-full"
            onClick={() => setSelected(null)}
          >
            Close
          </Button>

        </Card>

      </div>
    )}

  </AdminShell>
);
};

export default ProtectedRoute(PaymentManagement);