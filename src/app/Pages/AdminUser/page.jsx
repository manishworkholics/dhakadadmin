"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
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
      ? localStorage.getItem("token")
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

    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <div className="p-6 overflow-y-auto">

          <h1 className="text-2xl font-bold mb-2">
            Admin Management
          </h1>
          {/* ================= TOP STATS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">

            {/* TOTAL ROLES */}

            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">Total Roles</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {roles?.length || 0}
                </h2>
              </div>

              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-xl">
                🛡️
              </div>

            </div>


            {/* TOTAL ADMINS */}

            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">Total Admins</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {admins?.length || 0}
                </h2>
              </div>

              <div className="bg-green-100 text-green-600 p-3 rounded-lg text-xl">
                👤
              </div>

            </div>


            {/* TOTAL PERMISSIONS */}

            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">Permissions</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {permissions?.length || 0}
                </h2>
              </div>

              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg text-xl">
                🔐
              </div>

            </div>


            {/* TOTAL LOGS */}

            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">Activity Logs</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {logs?.length || 0}
                </h2>
              </div>

              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg text-xl">
                📊
              </div>

            </div>

          </div>
          {/* ================= CREATE ROLE ================= */}
          <h2 className="text-lg font-bold mb-3">
            Create Role
          </h2>
          <div className="flex items-center justify-between gap-6 bg-white p-3 rounded-md shadow mb-4">
            <input
              type="text"
              placeholder="Role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border p-2 rounded w-150"
            />

            <div className="flex items-center justify-between gap-6 flex-wrap  w-160 border p-2 rounded">

              {/* FIRST 2 PERMISSIONS */}

              {permissions.slice(0, 2).map((perm) => (

                <label key={perm._id} className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm._id)}
                    onChange={() => togglePermission(perm._id)}
                    className="cursor-pointer"
                  />

                  {perm.name}

                </label>

              ))}

              {/* SIMPLE DROPDOWN */}

              <div className="relative">

                <select
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="outline-none bg-white cursor-pointer"
                >
                  <option>More Permissions</option>
                </select>

                {showDropdown && (

                  <div className="absolute bg-white border rounded shadow p-3 space-y-2 z-50 min-w-[200px]">

                    {permissions.slice(2).map((perm) => (

                      <label key={perm._id} className="flex items-center gap-2">

                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm._id)}
                          onChange={() => togglePermission(perm._id)}
                        />

                        {perm.name}

                      </label>

                    ))}

                  </div>

                )}

              </div>

            </div>

            <button
              onClick={createRole}
              className="bg-slate-800 text-white p-2 rounded w-80 cursor-pointer"
            >
              Create Role
            </button>

          </div>
          <h2 className="text-lg font-bold mb-4">
            Roles & Permissions
          </h2>
          <div className=" bg-white p-6 rounded shadow mb-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map(role => (

                <div key={role._id} className="border p-4 mb-3 rounded">

                  <h3 className="font-bold mb-2">
                    {role.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">

                    {permissions.map(perm => {

                      const checked =
                        role.permissions?.some(p => p._id === perm._id);

                      return (

                        <label key={perm._id} className="flex items-center gap-2">

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => updateRolePermission(role, perm._id)}
                          />

                          {perm.name}

                        </label>

                      );
                    })}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CREATE ADMIN ================= */}
          <h2 className="text-lg font-bold mb-4">
            Create Admin
          </h2>
          <form
            onSubmit={createAdmin}
            className="grid md:grid-cols-5 gap-4 mb-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />

            <select
              name="roleName"
              value={form.roleName}
              onChange={handleChange}
              className="border p-2 rounded"
            >

              {roles.length === 0 && (
                <option>No Roles Found</option>
              )}

              {roles.map(role => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}

            </select>

            <button
              type="submit"
              className="bg-slate-800 text-white rounded px-4 cursor-pointer"
            >
              Add Admin
            </button>

          </form>

          {/* ================= ADMIN TABLE ================= */}

          <div className="bg-white rounded shadow mb-4">

            <table className="min-w-full">

              <thead className="bg-slate-800 text-white">

                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Action</th>
                </tr>

              </thead>

              <tbody>

                {admins.length > 0 ? (

                  admins.map(admin => (

                    <tr key={admin._id} className="border-b">

                      <td className="px-6 py-4">{admin.name}</td>

                      <td className="px-6 py-4">{admin.email}</td>

                      <td className="px-6 py-4">

                        <span className="px-2 py-1 bg-gray-200 rounded text-xs">

                          {admin.roles?.map(r => r.name).join(", ")}

                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() => deleteAdmin(admin._id)}
                          className="bg-rose-400 hover:bg-rose-600 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No Admin Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>
          </div>

          {/* ================= ADMIN LOGS ================= */}

          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-semibold mb-4">
              Admin Activity Logs
            </h2>

            <table className="min-w-full border">

              <thead className="bg-slate-800 text-white">

                <tr>
                  <th className="px-4 py-2 text-left">Admin</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Time</th>
                </tr>

              </thead>

              <tbody>

                {logs.length > 0 ? (

                  logs.map(log => (

                    <tr key={log._id} className="border-t">

                      <td className="px-4 py-2">
                        {log.admin?.name}
                      </td>

                      <td className="px-4 py-2">
                        {log.action}
                      </td>

                      <td className="px-4 py-2">
                        {log.targetType}
                      </td>

                      <td className="px-4 py-2">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No Logs Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );
};

export default ProtectedRoute(Page);