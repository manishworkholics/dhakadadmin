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
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const API = "http://143.110.244.163:5000/api/admin";


const Page = () => {

  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleName: "Admin"
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken")
      : null;

  // ================= CREATE ROLE =================

  const createRole = async () => {

    if (!roleName.trim()) {
      toast.error("Role name required");
      return;
    }

    try {

      const res = await axios.post(
        `${API}/roles`,
        {
          name: roleName,
          permissions: selectedPermissions
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        toast.success("Role created");
        setRoleName("");
        setSelectedPermissions([]);
        fetchRoles();
      }

    } catch (err) {
      handleApiError(err);
    }
  };

  // ================= FETCH ADMINS =================

  const fetchAdmins = async () => {
    try {

      const res = await axios.get(`${API}/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setAdmins(res.data.admins);
      }

    } catch (err) {
      handleApiError(err);
    }
  };

  // ================= FETCH ROLES =================

  const fetchRoles = async () => {
    try {

      const res = await axios.get(`${API}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setRoles(res.data.roles);
      }

    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchPermissions = async () => {
    try {

      const res = await axios.get(
        `${API}/permissions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setPermissions(res.data.permissions);
      }

    } catch (err) {
      handleApiError(err);
    }
  };
  // ================= FETCH LOGS =================

  const fetchLogs = async () => {
    try {

      const res = await axios.get(`${API}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setLogs(res.data.logs);
      }

    } catch (err) {
      handleApiError(err);
    }
  };

  // ================= LOAD DATA =================

  useEffect(() => {

    if (token) {
      fetchAdmins();
      fetchRoles();
      fetchLogs();
      fetchPermissions();
    }

  }, [token]);

  // ================= HANDLE FORM =================

  const togglePermission = (id) => {

    if (selectedPermissions.includes(id)) {

      setSelectedPermissions(
        selectedPermissions.filter(p => p !== id)
      );

    } else {

      setSelectedPermissions([
        ...selectedPermissions,
        id
      ]);

    }

  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= CREATE ADMIN =================

  const createAdmin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/register`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {

        toast.success("Admin created successfully");

        setForm({
          name: "",
          email: "",
          password: "",
          roleName: "Admin"
        });

        fetchAdmins();
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating admin");
    }
  };

  // ================= DELETE ADMIN =================

  const deleteAdmin = async (id) => {

    if (!confirm("Delete this admin?")) return;

    try {

      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Admin deleted");
      fetchAdmins();

    } catch (err) {
      toast.error("Delete failed");
    }
  };


  const updateRolePermission = async (role, permId) => {

    let newPermissions = role.permissions?.map(p => p._id) || [];

    if (newPermissions.includes(permId)) {

      newPermissions = newPermissions.filter(p => p !== permId);

    } else {

      newPermissions.push(permId);

    }

    try {

      await axios.put(
        `${API}/roles/${role._id}/permissions`,
        { permissions: newPermissions },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchRoles();

    } catch (err) {
      handleApiError(err);
    }

  };

return (
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader title="Admin Management" />

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Roles</p>
          <h2 className="text-xl font-bold">{roles.length}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Admins</p>
          <h2 className="text-xl font-bold">{admins.length}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Permissions</p>
          <h2 className="text-xl font-bold">{permissions.length}</h2>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Logs</p>
          <h2 className="text-xl font-bold">{logs.length}</h2>
        </Card>

      </div>

      {/* ================= CREATE ROLE ================= */}
      <Card className="p-5 mt-6">

        <h2 className="font-semibold mb-4">Create Role</h2>

        <div className="grid md:grid-cols-3 gap-4">

          <Input
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />

          <div className="md:col-span-2 flex flex-wrap gap-3">

            {permissions.map((perm) => (
              <label key={perm._id} className="flex items-center gap-2 text-sm cursor-pointer">

                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm._id)}
                  onChange={() => togglePermission(perm._id)}
                />

                {perm.name}

              </label>
            ))}

          </div>

        </div>

        <Button className="mt-4" onClick={createRole}>
          Create Role
        </Button>

      </Card>

      {/* ================= ROLES & PERMISSIONS ================= */}
      <div className="mt-6">

        <h2 className="text-lg font-semibold mb-4">
          Roles & Permissions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          {roles.map((role) => (
            <Card key={role._id} className="p-4 space-y-3">

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{role.name}</h3>
                <Badge>{role.permissions?.length || 0}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">

                {permissions.map((perm) => {
                  const checked =
                    role.permissions?.some(p => p._id === perm._id);

                  return (
                    <label key={perm._id} className="flex items-center gap-2 text-sm cursor-pointer">

                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => updateRolePermission(role, perm._id)}
                      />

                      <span className="text-muted-foreground">
                        {perm.name}
                      </span>

                    </label>
                  );
                })}

              </div>

            </Card>
          ))}

        </div>

      </div>

      {/* ================= CREATE ADMIN ================= */}
      <Card className="p-5 mt-6">

        <h2 className="font-semibold mb-4">Create Admin</h2>

        <form className="grid md:grid-cols-5 gap-4" onSubmit={createAdmin}>

          <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <Input name="password" value={form.password} onChange={handleChange} placeholder="Password" />

          <Select name="roleName" value={form.roleName} onChange={handleChange}>
            {roles.map(role => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </Select>

          <Button type="submit">Add</Button>

        </form>

      </Card>

      {/* ================= ADMIN TABLE ================= */}
      <div className="mt-6">
        <Table
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            {
              key: "roles",
              header: "Role",
              render: (a) => (
                <Badge>
                  {a.roles?.map(r => r.name).join(", ")}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Action",
              render: (a) => (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteAdmin(a._id)}
                >
                  Delete
                </Button>
              ),
            },
          ]}
          rows={admins}
          emptyText="No Admin Found"
        />
      </div>

      {/* ================= LOGS ================= */}
      <div className="mt-6">
        <Table
          columns={[
            { key: "admin", header: "Admin", render: (l) => l.admin?.name },
            { key: "action", header: "Action" },
            { key: "targetType", header: "Target" },
            {
              key: "time",
              header: "Time",
              render: (l) => new Date(l.createdAt).toLocaleString()
            },
          ]}
          rows={logs}
          emptyText="No Logs Found"
        />
      </div>

    </Card>

  </AdminShell>
);
};

export default ProtectedRoute(Page);