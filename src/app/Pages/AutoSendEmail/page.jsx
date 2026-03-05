"use client";
import React from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import { handleApiError } from "@/utils/apiErrorHandler.js";

const AutoSendEmail = () => {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <Header />
                <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-8">

                    {/* ================= PAGE HEADER ================= */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Auto Send Email
                            </h1>
                            <p className="text-sm text-gray-500">
                                Send automated emails to users based on filters or triggers
                            </p>
                        </div>

                        <button className="bg-slate-800 hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-sm transition cursor-pointer">
                            View Email Logs
                        </button>
                    </div>

                    {/* ================= EMAIL FORM CARD ================= */}
                    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Email Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Type
                                </label>

                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none">
                                    <option>New Match Notification</option>
                                    <option>Membership Expiry Reminder</option>
                                    <option>Profile Approval</option>
                                    <option>Promotional Campaign</option>
                                </select>
                            </div>
                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter email subject"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                                />
                            </div>
                        </div>
                        {/* Target Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select className="border border-gray-300 rounded-lg px-3 py-2">
                                <option>All Members</option>
                                <option>Premium Members</option>
                                <option>Free Members</option>
                            </select>

                            <select className="border border-gray-300 rounded-lg px-3 py-2">
                                <option>All Cities</option>
                                <option>Indore</option>
                                <option>Bhopal</option>
                            </select>

                            <select className="border border-gray-300 rounded-lg px-3 py-2">
                                <option>Active Members</option>
                                <option>Inactive Members</option>
                            </select>
                        </div>

                        {/* Email Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Content
                            </label>

                            <textarea
                                rows="6"
                                placeholder="Write email content here..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                            ></textarea>
                        </div>

                        {/* Schedule Section */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4">

                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="radio" name="schedule" />
                                Send Now
                            </label>

                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="radio" name="schedule" />
                                Schedule
                            </label>

                            <input
                                type="datetime-local"
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer">
                                Save Draft
                            </button>

                            <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-800 text-white shadow-sm transition cursor-pointer">
                                Send Email
                            </button>
                        </div>
                    </div>

                    {/* ================= RECENT CAMPAIGNS ================= */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Recent Email Campaigns
                            </h2>
                            <button className="text-sm bg-slate-800 hover:bg-slate-800 text-white px-3 py-1 rounded-lg transition cursor-pointer">
                                View All →
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-gray-600 border-b">
                                    <tr>
                                        <th className="text-left py-3">Subject</th>
                                        <th className="text-left py-3">Status</th>
                                        <th className="text-left py-3">Sent To</th>
                                        <th className="text-left py-3">Date</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-700">
                                    <tr className="border-b hover:bg-gray-50 transition">
                                        <td className="py-3">Membership Expiry Reminder</td>
                                        <td>
                                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                                Sent
                                            </span>
                                        </td>
                                        <td>450 Users</td>
                                        <td>02 Mar 2026</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoSendEmail;