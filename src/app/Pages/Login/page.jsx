"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

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
                localStorage.setItem("admintoken", token);

                // Save user data
                localStorage.setItem("adminData", JSON.stringify(admin));

                // Role-based routing


                router.push("/Pages/Dashboard");

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
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div
            className="
        min-h-screen 
        bg-muted
        relative flex items-center justify-center px-4 py-10
      "
        >
            {/* Card Container */}
            <Card className="relative w-full max-w-md p-6 md:p-8">
                {/* Header */}
                <h2 className="text-center text-2xl font-semibold tracking-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Welcome back. Please enter your credentials.
                </p>

                {/* Error message */}
                {errorMsg && (
                    <p className="mt-4 text-center text-danger text-sm font-medium">
                        {errorMsg}
                    </p>
                )}

                {/* Form */}
                <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email address
                        </label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="pl-9 pr-10"
                            />

                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition"
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </span>
                        </div>
                    </div>



                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-border"
                            />
                            <span className="ml-2">Remember me</span>
                        </label>

                        <a
                            href="#"
                            className="text-sm font-medium text-primary hover:brightness-95"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Page;
