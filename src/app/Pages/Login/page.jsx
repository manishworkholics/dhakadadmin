"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email.trim()) return setErrorMsg("Email is required");
    if (!formData.password.trim()) return setErrorMsg("Password is required");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://143.110.244.163:5000/api/admin/login",
        formData
      );

      if (res.data.success) {
        const { token, admin } = res.data;

        // Save token
        localStorage.setItem("token", token);

        // Save user data
        localStorage.setItem("adminData", JSON.stringify(admin));

        // Role-based routing
        if (admin.role === "admin") {
          toast.success("Admin Login Successful");
          router.push("/Pages/Dashboard"); // ADMIN DASHBOARD
        } else if (admin.role === "superadmin") {
          toast.success("Super Admin Login Successful");
           router.push("/Pages/Dashboard");  // SUPER ADMIN DASHBOARD
        }else if (admin.role === "viewadmin") {
          toast.success("View Admin Login Successful");
           router.push("/Pages/Dashboard");  // VIEW ADMIN DASHBOARD
        } else {
          toast.error("Unauthorized Role");
          return;
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen 
        bg-black 
        bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')] 
        bg-cover bg-center 
        relative flex items-center justify-center px-4
      "
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card Container */}
      <div className="relative bg-white/95 shadow-xl rounded-xl p-8 w-full max-w-md">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            create an account
          </a>
        </p>

        {/* Error message */}
        {errorMsg && (
          <p className="mt-4 text-center text-red-600 text-sm font-medium">
            {errorMsg}
          </p>
        )}

        {/* Form */}
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2">Remember me</span>
            </label>

            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium ${loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 transition"
              }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
