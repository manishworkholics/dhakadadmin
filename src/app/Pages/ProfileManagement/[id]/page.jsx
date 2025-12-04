// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import Header from "../../Components/Header/page.jsx";
// import Sidebar from "@/app/Components/Sidebar/page";
// import { Menu, Eye } from "lucide-react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRouter } from "next/navigation";


// const Page = () => {
//     const router = useRouter();
//     const [token, setToken] = useState(null);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [profiles, setProfiles] = useState([]);
//       const [loading, setLoading] = useState(true); 

//     // Load token from localStorage on client only
//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             setToken(localStorage.getItem("token"));
//         }
//     }, []);

//     // Fetch Profiles 
//     const fetchProfile = useCallback(async () => {
//         if (!token) return;
//         try {
//             setLoading(true);
//             const res = await axios.get("http://206.189.130.102:5000/api/admin/profiles",
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//             if (res.data.success) {
//                setProfiles(res.data.profiles);
//             }
//         } catch (error) { 
//             console.error("Error fetching users:", error);
//         } finally {
//             setLoading(false);
//          }
//     }, [token]);

//     // Run fetchProfile only after token exists 
//     useEffect(() => {
//         if (token) {
//             fetchProfile();
//         }
//     }, [token, fetchProfile]);

//     const handleProfile = (profileId) => {
//         // toast.info(`Viewing profile ID: ${profileId}`);
//       router.push(`/Pages/ProfileDetails/${profileId}`);

//     };  

//     return (
//         <>
//             <div className="flex h-screen bg-gray-100">
//                 <ToastContainer
//                     position="top-right"
//                     autoClose={3000}
//                     hideProgressBar={false}
//                     closeOnClick
//                     pauseOnHover
//                     draggable
//                 />

//                 {/* Sidebar */}
//                 <div
//                     className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 
//           lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//                         }`}
//                 >
//                     <Sidebar />
//                 </div>

//                 {isSidebarOpen && (
//                     <div
//                         onClick={() => setIsSidebarOpen(false)}
//                         className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
//                     ></div>
//                 )}

//                 <div className="flex-1 flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="items-center justify-between">
//                         <button
//                             className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
//                             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                         >
//                             <Menu size={22} />
//                         </button>
//                         <Header />
//                     </div>

//                     {/* Main Content */}
//                     <div className="flex-1 overflow-auto">
//                         <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 flex justify-center">
//                             <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl overflow-hidden">
//                                 {/* Page Title */}
//                                 <h1 className="px-6 py-4 text-2xl font-semibold text-gray-800 border-b">
//                                     Profile Management
//                                 </h1>

//                                 {/* Table */}
//                                  {loading ? (
//                                     <div className="flex justify-center items-center py-20">
//                                         <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-900 border-t-transparent"></div>
//                                         <p className="ml-4 text-lg font-medium text-gray-700">
//                                             Loading profiles...
//                                         </p>
//                                     </div>
//                                 ) : (
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-200 mb-3">
//                                         <thead className="bg-gray-900 text-white">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Name</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Email</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Phone</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Location</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">DOB</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Height</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Physical Status</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Marital Status</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Religion</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Gotra</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Employment Type</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Occupation</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Annual Income</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Family Status</th>
//                                                 <th className="px-6 py-3 text-xs font-semibold border">Action</th>
//                                             </tr>
//                                         </thead>

//                                         <tbody className="bg-white divide-y divide-gray-300">
//                                             {profiles && profiles.length > 0 ? (
//                                                 profiles.map((profile) => (
//                                                     <tr key={profile._id} className="hover:bg-gray-100 transition">
//                                                         <td className="px-6 py-4 text-xs font-medium border">{profile.name || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.email || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.phone || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.location || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.dob || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.height || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.physicalStatus || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.maritalStatus || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.religion || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.gotra || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.employmentType || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.occupation || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.annualIncome || "N/A"}</td>
//                                                         <td className="px-6 py-4 text-xs border">{profile.familyStatus || "N/A"}</td>

//                                                         <td className="px-6 py-4 border">
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800 transition"
//                                                                 title="View Profile"
//                                                                 onClick={() => handleProfile(profile._id)}
//                                                             >
//                                                                 <Eye size={20} />
//                                                             </button>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="15" className="text-center py-6 text-gray-500 border">
//                                                         No Profiles Found
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>

//                                     </table>
//                                 </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </>
//     );
// };

// export default Page;

"use client";

import React, { useState, useEffect } from "react";
import { Menu, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/Components/Header/page";
import Sidebar from "@/app/Components/Sidebar/page";
import ProtectedRoute from "../../Common_Method/protectedroute";
import { IoIosArrowRoundBack } from "react-icons/io";

const Page = () => {
    const { id } = useParams();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(null);

    const params = useParams(); // 🔥 GET DYNAMIC ID
    const profileId = params?.id;

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    // ---------------- FETCH PROFILE ----------------
    const fetchProfileDetail = async () => {
        try {
            const res = await axios.get(
                `http://206.189.130.102:5000/api/admin/profiles/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
            if (res?.data?.success) {
                setProfile(res.data.profile);
            } else {
                toast.error("Failed to load profile");
            }
        } catch (error) {
            toast.error("Error loading profile");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!token || !id) return;
        fetchProfileDetail();
    }, [token, id]);

    const handleBackout = () => {
        router.push('/Pages/ProfileManagement');
    }
    return (
        <>
            <div className="flex h-screen bg-gray-100">

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 
                        lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <Sidebar />
                </div>

                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
                    />
                )}

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="items-center justify-between">
                        <button
                            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu size={22} />
                        </button>
                        <Header />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 flex justify-center">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6">

                                {/* PROFILE CARD */}
                                <div className="flex items-center gap-1 py-2 mb-3">
                                    <button onClick={handleBackout} className="flex items-center text-gray-700 hover:text-black">
                                        <IoIosArrowRoundBack size={28} />
                                    </button>

                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        Profile Details
                                    </h1>
                                </div>

                                {/* LOADING */}
                                {loading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-900 border-t-transparent"></div>
                                        <p className="ml-4 text-lg font-medium text-gray-700">
                                            Loading profile...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* PROFILE CARD */}
                                        <div className="flex gap-8">
                                            {/* Left Photo Section */}
                                            <div className="w-1/3">
                                                <img
                                                    src={profile?.photos?.[0]}
                                                    alt="Profile Photo"
                                                    className="w-full h-80 object-cover rounded-xl shadow-md"
                                                />

                                                <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow">
                                                    <p><strong>Profile Score:</strong> {profile?.profileScore}</p>
                                                    <p><strong>Featured:</strong> {profile?.featured ? "Yes" : "No"}</p>
                                                    <p><strong>Visible:</strong> {profile?.isVisible ? "Yes" : "No"}</p>
                                                </div>
                                            </div>

                                            {/* Right Info Section */}
                                            <div className="w-2/3 space-y-4">
                                                <h2 className="text-3xl font-bold text-gray-900 capitalize">
                                                    {profile?.name}
                                                </h2>

                                                <div className="grid grid-cols-2 gap-4 text-gray-700">
                                                    <p><strong>Phone:</strong> {profile?.userId?.phone}</p>
                                                    <p><strong>Email:</strong> {profile?.email}</p>
                                                    <p><strong>DOB:</strong> {new Date(profile?.dob).toLocaleDateString()}</p>
                                                    <p><strong>Mother Tongue:</strong> {profile?.motherTongue}</p>
                                                    <p><strong>Height:</strong> {profile?.height}</p>
                                                    <p><strong>Location:</strong> {profile?.location}</p>
                                                    <p><strong>Religion:</strong> {profile?.religion}</p>
                                                    <p><strong>Gotra:</strong> {profile?.gotra}</p>
                                                    <p><strong>Occupation:</strong> {profile?.occupation}</p>
                                                    <p><strong>Employment:</strong> {profile?.employmentType}</p>
                                                    <p><strong>Annual Income:</strong> {profile?.annualIncome}</p>
                                                    <p><strong>Marital Status:</strong> {profile?.maritalStatus}</p>
                                                    <p><strong>Family Status:</strong> {profile?.familyStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProtectedRoute(Page);
