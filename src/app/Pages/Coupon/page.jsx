"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { Trash2 } from "lucide-react";

import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";

const API_BASE = "http://143.110.244.163:5000";
const ADMIN_COUPON_API = `${API_BASE}/api/admin/coupon`;

const initialForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  maxDiscount: "",
  minAmount: "",
  usageLimit: "",
  expiryDate: "",
};

const CouponPage = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admintoken"));
    }
  }, []);

  const resolveList = (res) => res?.data?.coupons || [];

  const fetchCoupons = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const query = search.trim();

      const res = await axios.get(ADMIN_COUPON_API, {
        headers,
        params: { search: query || undefined },
      });
      setCoupons(resolveList(res));
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 350);
    return () => clearTimeout(timer);
  }, [search, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (!form.code.trim() || !form.discountValue) {
      toast.error("Coupon code and discount value are required");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : 0,
      minAmount: form.minAmount ? Number(form.minAmount) : 0,
      users: [],
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      expiryDate: form.expiryDate
        ? new Date(form.expiryDate).toISOString()
        : null,
      isActive: true,
    };

    try {
      setSaving(true);
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(ADMIN_COUPON_API, payload, { headers });

      setForm(initialForm);
      toast.success("Coupon created");
      fetchCoupons();
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const nextStatus = !coupon.isActive;
      const headers = { Authorization: `Bearer ${token}` };
      const id = coupon._id;

      await axios.put(
        `${ADMIN_COUPON_API}/${id}`,
        {
          discountValue: coupon.discountValue,
          maxDiscount: coupon.maxDiscount,
          usageLimit: coupon.usageLimit,
          isActive: nextStatus,
        },
        { headers }
      );

      toast.success(`Coupon ${nextStatus ? "activated" : "deactivated"}`);
      fetchCoupons();
    } catch {
      toast.error("Failed to update coupon status");
    }
  };

  const handleDelete = async (couponId) => {
    const confirmed = window.confirm("Delete this coupon?");
    if (!confirmed) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${ADMIN_COUPON_API}/${couponId}`, { headers });

      toast.success("Coupon deleted");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return coupons;

    return coupons.filter((coupon) =>
      String(coupon.code || "").toLowerCase().includes(query)
    );
  }, [coupons, search]);

  return (
    <AdminShell>
      <Card className="p-4 md:p-6">
        <PageHeader title="Coupon Management" />

        <Card className="p-5 mt-4">
          <form onSubmit={handleCreateCoupon}>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Coupon code (e.g. SAVE20)"
              />

              <Select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (Rs)</option>
              </Select>

              <Input
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
                placeholder="Discount value"
              />

              <Input
                name="maxDiscount"
                type="number"
                value={form.maxDiscount}
                onChange={handleChange}
                placeholder="Max discount"
              />

              <Input
                name="minAmount"
                type="number"
                value={form.minAmount}
                onChange={handleChange}
                placeholder="Min amount"
              />

              <Input
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="Usage limit"
              />

              <Input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
              />
            </div>

            <Button className="mt-4" type="submit">
              {saving ? "Saving..." : "Create Coupon"}
            </Button>
          </form>
        </Card>

        <div className="mt-6">
          <div className="w-full md:w-80 mb-4">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search by coupon code..."
            />
          </div>

          {loading ? (
            <Loader label="Loading coupons..." />
          ) : (
            <Table
              columns={[
                { key: "code", header: "Code" },
                {
                  key: "discount",
                  header: "Discount",
                  render: (c) =>
                    c.discountType === "percent"
                      ? `${c.discountValue}%`
                      : `Rs ${c.discountValue}`,
                },
                {
                  key: "maxDiscount",
                  header: "Max Discount",
                  render: (c) => `Rs ${c.maxDiscount || 0}`,
                },
                {
                  key: "minAmount",
                  header: "Min Amount",
                  render: (c) => `Rs ${c.minAmount || 0}`,
                },
                {
                  key: "usageLimit",
                  header: "Usage Limit",
                  render: (c) => c.usageLimit ?? "Unlimited",
                },
                {
                  key: "expiryDate",
                  header: "Expires",
                  render: (c) =>
                    c.expiryDate
                      ? new Date(c.expiryDate).toLocaleDateString("en-IN")
                      : "No Expiry",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (c) =>
                    c.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="warning">Inactive</Badge>
                    ),
                },
                {
                  key: "actions",
                  header: "Action",
                  render: (c) => (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={c.isActive ? "outline" : "primary"}
                        onClick={() => handleToggleStatus(c)}
                      >
                        {c.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="h-9 w-9 px-0"
                        onClick={() => handleDelete(c._id)}
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={filteredCoupons}
              emptyText="No coupons yet"
            />
          )}
        </div>
      </Card>
    </AdminShell>
  );
};

export default ProtectedRoute(CouponPage);

