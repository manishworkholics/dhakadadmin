"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../Common_Method/protectedroute";
import AdminShell from "@/components/layout/AdminShell";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

const API = "http://143.110.244.163:5000";

const educationOptions = [
    "10th",
    "12th",
    "diploma",
    "bachelors",
    "masters",
    "phd",
    "ca",
    "cs",
    "icwa",
    "mbbs",
    "md",
    "law",
    "others",
];

const FormSelect = ({ label, name, value, onChange, options, placeholder = "Select" }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                </option>
            ))}
        </select>
    </div>
);

const FormInput = ({ label, name, type = "text", value, onChange, placeholder = "" }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
        <Input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full"
        />
    </div>
);

const FormTextarea = ({ label, name, value, onChange, placeholder = "", rows = 4 }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 resize-vertical"
        />
    </div>
);

const SectionTitle = ({ title }) => (
    <div className="mb-6 pb-3 border-b-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
);

const Page = () => {
    const { id } = useParams();
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dob: "",
        motherTongue: "",
        email: "",
        location: "",
        state: "",
        city: "",
        height: "",
        physicalStatus: "Normal",
        maritalStatus: "Never married",
        religion: "Hinduism",
        caste: "",
        subCaste: "",
        gotra: "",
        skinTone: "",
        birthPlace: "",
        birthTime: "",
        educationDetails: "",
        educationOther: "",
        employmentType: "",
        occupation: "",
        annualIncome: "",
        familyStatus: "Middle class",
        diet: "Veg",
        aboutYourself: "",
        hobbies: "",
        photos: [],
    });

    useEffect(() => {
        const adminToken = localStorage.getItem("admintoken");
        setToken(adminToken);
    }, []);

    useEffect(() => {
        fetch(`${API}/api/location/states`)
            .then((res) => res.json())
            .then((data) => setStates(data))
            .catch((err) => console.error("Error fetching states:", err));
    }, []);

    useEffect(() => {
        if (!formData.state) {
            setCities([]);
            return;
        }

        fetch(`${API}/api/location/cities/${formData.state}`)
            .then((res) => res.json())
            .then((data) => setCities(data.cities || []))
            .catch((err) => console.error("Error fetching cities:", err));
    }, [formData.state]);

    useEffect(() => {
        if (!token || !id) return;

        axios
            .get(`${API}/api/admin/profiles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const profile = res.data.profile;

                let education = "";
                let educationOther = "";
                if (profile.educationDetails) {
                    if (educationOptions.includes(profile.educationDetails)) {
                        education = profile.educationDetails;
                    } else {
                        education = "others";
                        educationOther = profile.educationDetails;
                    }
                }

                setFormData((prev) => ({
                    ...prev,
                    name: profile.name || "",
                    gender: profile.gender || "",
                    dob: profile.dob ? profile.dob.split("T")[0] : "",
                    motherTongue: profile.motherTongue || "",
                    email: profile.email || "",
                    location: profile.location || "",
                    state: profile.state || "",
                    city: profile.city || "",
                    height: profile.height || "",
                    physicalStatus: profile.physicalStatus || "Normal",
                    maritalStatus: profile.maritalStatus || "Never married",
                    religion: profile.religion || "Hinduism",
                    caste: profile.caste || "",
                    subCaste: profile.subCaste || "",
                    gotra: profile.gotra || "",
                    skinTone: profile.skinTone || "",
                    birthPlace: profile.birthPlace || "",
                    birthTime: profile.birthTime || "",
                    educationDetails: education,
                    educationOther: educationOther,
                    employmentType: profile.employmentType || "",
                    occupation: profile.occupation || "",
                    annualIncome: profile.annualIncome || "",
                    familyStatus: profile.familyStatus || "Middle class",
                    diet: profile.diet || "Veg",
                    aboutYourself: profile.aboutYourself || "",
                    hobbies: profile.hobbies || "",
                    photos: profile.photos || [],
                }));

                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load profile");
                setLoading(false);
            });
    }, [token, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "educationDetails" && value !== "others") {
                updated.educationOther = "";
            }

            if (name === "state") {
                updated.city = "";
                updated.location = "";
            }

            return updated;
        });
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            city: value,
            location: value,
        }));
    };

    const handlePhotoUpload = async (file) => {
        if (!file) return;

        try {
            setUploading(true);
            const fd = new FormData();
            fd.append("image", file);

            const res = await axios.post(`${API}/api/upload-image`, fd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const newPhoto = res.data.url;
            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, newPhoto],
            }));

            toast.success("Photo uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Photo upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = (index) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
        toast.info("Photo removed");
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);

            const payload = {
                ...formData,
                educationDetails:
                    formData.educationDetails === "others"
                        ? formData.educationOther
                        : formData.educationDetails,
            };

            delete payload.educationOther;

            await axios.put(`${API}/api/admin/profile-update-user/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Profile updated successfully 🔥");
            router.push("/Pages/ProfileManagement");
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        router.push("/Pages/ProfileManagement");
    };

    if (loading) {
        return (
            <AdminShell>
                <Loader label="Loading profile..." />
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <Card className="p-6 md:p-8">
                <PageHeader
                    title="Edit User Profile"
                    actions={
                        <Button
                            variant="outline"
                            leftIcon={<ArrowLeft size={18} />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    }
                />

                <div className="mt-8 space-y-10">
                    {/* PHOTOS SECTION */}
                    <section>
                        <SectionTitle title="Profile Photos" />
                        <div className="mt-4">
                            {formData.photos?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Current Photos ({formData.photos.length})
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.photos.map((photo, index) => (
                                            <div key={index} className="relative group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={photo}
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-full h-40 rounded-lg object-cover border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex flex-col items-center justify-center py-6">
                                    <Upload size={32} className="text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload photo
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PNG or JPG only</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png"
                                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </section>

                    {/* BASIC DETAILS */}
                    <section>
                        <SectionTitle title="Basic Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                            <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                            <FormSelect
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                ]}
                            />
                            <FormInput
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                            <FormSelect
                                label="Mother Tongue"
                                name="motherTongue"
                                value={formData.motherTongue}
                                onChange={handleChange}
                                options={[
                                    { label: "Hindi", value: "Hindi" },
                                    { label: "English", value: "English" },
                                    { label: "Gujarati", value: "Gujarati" },
                                    { label: "Marathi", value: "Marathi" },
                                    { label: "Bengali", value: "Bengali" },
                                    { label: "Tamil", value: "Tamil" },
                                    { label: "Telugu", value: "Telugu" },
                                    { label: "Kannada", value: "Kannada" },
                                    { label: "Malayalam", value: "Malayalam" },
                                ]}
                            />
                            <FormSelect
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                options={states
                                    .slice()
                                    .sort((a, b) => a.state.localeCompare(b.state))
                                    .map((s) => ({
                                        label: s.state,
                                        value: s.state,
                                    }))}
                                placeholder="Select state"
                            />
                            <FormSelect
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleCityChange}
                                options={cities
                                    .slice()
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((city) => ({
                                        label: city,
                                        value: city,
                                    }))}
                                placeholder="Select city"
                            />
                        </div>
                    </section>

                    {/* PERSONAL & RELIGIOUS DETAILS */}
                    <section>
                        <SectionTitle title="Personal & Religious Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="e.g., 5ft 6in"
                            />
                            <FormSelect
                                label="Physical Status"
                                name="physicalStatus"
                                value={formData.physicalStatus}
                                onChange={handleChange}
                                options={[
                                    { label: "Normal", value: "Normal" },
                                    { label: "Physically Challenged", value: "Physically challenged" },
                                ]}
                            />
                            <FormSelect
                                label="Marital Status"
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                options={[
                                    { label: "Never Married", value: "Never married" },
                                    { label: "Married", value: "Married" },
                                    { label: "Previously Married (Divorced)", value: "Divorced" },
                                    { label: "Previously Married (Widowed)", value: "Widower" },
                                    { label: "Legally Separated / Awaiting Divorce", value: "Awaiting divorce" },
                                ]}
                            />
                            <FormSelect
                                label="Religion"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                options={[
                                    { label: "Hinduism", value: "Hinduism" },
                                    { label: "Islam", value: "Islam" },
                                    { label: "Christianity", value: "Christianity" },
                                    { label: "Sikhism", value: "Sikhism" },
                                    { label: "Buddhism", value: "Buddhism" },
                                    { label: "Jainism", value: "Jainism" },
                                ]}
                            />
                            <FormInput
                                label="Caste"
                                name="caste"
                                value={formData.caste}
                                onChange={handleChange}
                                placeholder="Enter caste"
                            />
                            <FormInput
                                label="Sub Caste"
                                name="subCaste"
                                value={formData.subCaste}
                                onChange={handleChange}
                                placeholder="Enter sub caste"
                            />
                            <FormInput
                                label="Gotra"
                                name="gotra"
                                value={formData.gotra}
                                onChange={handleChange}
                                placeholder="Enter gotra"
                            />
                            <FormSelect
                                label="Skin Tone"
                                name="skinTone"
                                value={formData.skinTone}
                                onChange={handleChange}
                                options={[
                                    { label: "Fair", value: "Fair" },
                                    { label: "Wheatish", value: "Wheatish" },
                                    { label: "Medium", value: "Medium" },
                                    { label: "Dark", value: "Dark" },
                                    { label: "Very Dark", value: "Very Dark" },
                                ]}
                                placeholder="Select skin tone"
                            />
                            <FormInput
                                label="Birth Place"
                                name="birthPlace"
                                value={formData.birthPlace}
                                onChange={handleChange}
                                placeholder="Enter birth place"
                            />
                            <FormInput
                                label="Birth Time"
                                name="birthTime"
                                type="time"
                                value={formData.birthTime}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/* PROFESSIONAL DETAILS */}
                    <section>
                        <SectionTitle title="Professional Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect
                                label="Education"
                                name="educationDetails"
                                value={formData.educationDetails}
                                onChange={handleChange}
                                options={[
                                    { label: "10th / Secondary School", value: "10th" },
                                    { label: "12th / Higher Secondary", value: "12th" },
                                    { label: "Diploma", value: "diploma" },
                                    { label: "Bachelor's Degree", value: "bachelors" },
                                    { label: "Master's Degree", value: "masters" },
                                    { label: "PhD / Doctorate", value: "phd" },
                                    { label: "CA (Chartered Accountant)", value: "ca" },
                                    { label: "CS (Company Secretary)", value: "cs" },
                                    { label: "ICWA / CMA", value: "icwa" },
                                    { label: "MBBS", value: "mbbs" },
                                    { label: "MD / MS", value: "md" },
                                    { label: "LLB / LLM", value: "law" },
                                    { label: "Others", value: "others" },
                                ]}
                                placeholder="Select education"
                            />
                            {formData.educationDetails === "others" && (
                                <FormInput
                                    label="Specify Education"
                                    name="educationOther"
                                    value={formData.educationOther}
                                    onChange={handleChange}
                                    placeholder="Enter your education details"
                                />
                            )}
                            <FormSelect
                                label="Employment Type"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                options={[
                                    { label: "Government Job", value: "government" },
                                    { label: "Private Job", value: "private" },
                                    { label: "Business / Entrepreneur", value: "business" },
                                    { label: "Self Employed", value: "self_employed" },
                                    { label: "Freelancer / Consultant", value: "freelancer" },
                                    { label: "Defence / Armed Forces", value: "defense" },
                                    { label: "PSU / Public Sector", value: "psu" },
                                    { label: "Startup", value: "startup" },
                                    { label: "NGO / Social Work", value: "ngo" },
                                    { label: "Student", value: "student" },
                                    { label: "Not Working", value: "not_working" },
                                    { label: "Homemaker", value: "homemaker" },
                                    { label: "Retired", value: "retired" },
                                ]}
                                placeholder="Select employment type"
                            />
                            <FormSelect
                                label="Occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                options={[
                                    { label: "Software Engineer", value: "software_engineer" },
                                    { label: "Web Developer", value: "web_developer" },
                                    { label: "Data Analyst", value: "data_analyst" },
                                    { label: "Manager", value: "manager" },
                                    { label: "HR Professional", value: "hr" },
                                    { label: "Accountant", value: "accountant" },
                                    { label: "Marketing Professional", value: "marketing" },
                                    { label: "Sales Executive", value: "sales" },
                                    { label: "Doctor", value: "doctor" },
                                    { label: "Nurse", value: "nurse" },
                                    { label: "Teacher", value: "teacher" },
                                    { label: "Professor / Lecturer", value: "professor" },
                                    { label: "Government Officer", value: "govt_officer" },
                                    { label: "Business Owner", value: "business_owner" },
                                    { label: "Entrepreneur", value: "entrepreneur" },
                                    { label: "Farmer", value: "farmer" },
                                    { label: "Student", value: "student" },
                                    { label: "Others", value: "others" },
                                ]}
                                placeholder="Select occupation"
                            />
                            <FormSelect
                                label="Annual Income"
                                name="annualIncome"
                                value={formData.annualIncome}
                                onChange={handleChange}
                                options={[
                                    { label: "Below ₹1 Lakh", value: "below_1_lakh" },
                                    { label: "₹1 – 3 Lakh", value: "1_3_lakh" },
                                    { label: "₹3 – 5 Lakh", value: "3_5_lakh" },
                                    { label: "₹5 – 8 Lakh", value: "5_8_lakh" },
                                    { label: "₹8 – 12 Lakh", value: "8_12_lakh" },
                                    { label: "₹12 – 20 Lakh", value: "12_20_lakh" },
                                    { label: "₹20 – 35 Lakh", value: "20_35_lakh" },
                                    { label: "₹35 – 50 Lakh", value: "35_50_lakh" },
                                    { label: "₹50 Lakh – 1 Crore", value: "50_lakh_1_cr" },
                                    { label: "Above ₹1 Crore", value: "above_1_cr" },
                                    { label: "Prefer not to say", value: "not_disclosed" },
                                ]}
                                placeholder="Select annual income"
                            />
                        </div>
                    </section>

                    {/* ADDITIONAL DETAILS */}
                    <section>
                        <SectionTitle title="Additional Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect
                                label="Family Status"
                                name="familyStatus"
                                value={formData.familyStatus}
                                onChange={handleChange}
                                options={[
                                    { label: "Middle class", value: "Middle class" },
                                    { label: "Upper middle class", value: "Upper middle class" },
                                    { label: "Rich / Affluent (Elite)", value: "Rich / Affluent (Elite)" },
                                ]}
                            />
                            <FormSelect
                                label="Diet"
                                name="diet"
                                value={formData.diet}
                                onChange={handleChange}
                                options={[
                                    { label: "Veg", value: "Veg" },
                                    { label: "Non Veg", value: "Nonveg" },
                                    { label: "Vegan", value: "Vegan" },
                                    { label: "Occasionally Non-Veg", value: "Occasionally Non-Veg" },
                                ]}
                            />
                        </div>
                        <div className="mt-6">
                            <FormTextarea
                                label="About Yourself"
                                name="aboutYourself"
                                value={formData.aboutYourself}
                                onChange={handleChange}
                                placeholder="Write a brief introduction about yourself..."
                                rows={4}
                            />
                        </div>
                        <div className="mt-6">
                            <FormTextarea
                                label="Hobbies & Interests"
                                name="hobbies"
                                value={formData.hobbies}
                                onChange={handleChange}
                                placeholder="Share your hobbies and interests..."
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 mt-10">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={saving || uploading}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={saving || uploading}
                            className="px-6"
                        >
                            {saving ? "Saving..." : "Update Profile"}
                        </Button>
                    </div>
                </div>
            </Card>
        </AdminShell>
    );
};

export default ProtectedRoute(Page);