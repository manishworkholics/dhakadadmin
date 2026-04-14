// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProtectedRoute from "../Common_Method/protectedroute.js";

// import AdminShell from "@/components/layout/AdminShell";
// import PageHeader from "@/components/ui/PageHeader";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

// const API = "http://143.110.244.163:5000/api/review";

// const Page = () => {
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const [approved, setApproved] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);

//       const [approvedRes, pendingRes] = await Promise.all([
//         axios.get(`${API}/testimonials`),
//         axios.get(`${API}/admin/pending`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setApproved(approvedRes.data.data || []);
//       setPending(pendingRes.data.data || []);

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const approveReview = async (id) => {
//     await axios.patch(
//       `${API}/admin/status/${id}`,
//       { isApproved: true },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     fetchReviews();
//   };

//   const rejectReview = async (id) => {
//     await axios.patch(
//       `${API}/admin/status/${id}`,
//       { isApproved: false },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     fetchReviews();
//   };

//   const deleteReview = async (id) => {
//     if (!confirm("Delete this review?")) return;
//     await axios.delete(`${API}/admin/delete-review/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchReviews();
//   };

//   return (
//     <AdminShell>
//       <div className="space-y-6">

//         <PageHeader title="⭐ Review Management" subtitle="Manage all user reviews easily" />

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-sm text-gray-500">Pending</p>
//             <h2 className="text-2xl font-bold">{pending.length}</h2>
//           </Card>

//           <Card className="p-4 text-center">
//             <p className="text-sm text-gray-500">Approved</p>
//             <h2 className="text-2xl font-bold">{approved.length}</h2>
//           </Card>

//           <Card className="p-4 text-center">
//             <p className="text-sm text-gray-500">Total</p>
//             <h2 className="text-2xl font-bold">{pending.length + approved.length}</h2>
//           </Card>

//           <Card className="p-4 text-center">
//             <p className="text-sm text-gray-500">Rating Avg</p>
//             <h2 className="text-2xl font-bold">
//               {approved.length
//                 ? (approved.reduce((a, b) => a + b.rating, 0) / approved.length).toFixed(1)
//                 : "0"}
//             </h2>
//           </Card>
//         </div>

//         {/* Pending Section */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">🕒 Pending Reviews</h2>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <div className="grid md:grid-cols-3 gap-6">
//               {pending.map((r) => (
//                 <Card key={r._id} className="p-5 rounded-2xl shadow-md hover:shadow-xl transition">

//                   <h3 className="font-semibold text-lg">{r.title}</h3>

//                   <div className="text-yellow-400 text-lg">
//                     {"★".repeat(r.rating)}
//                   </div>

//                   <p className="text-sm text-gray-600">{r.comment}</p>

//                   <p className="text-xs text-gray-400">
//                     {r.reviewerName || "Anonymous"}
//                   </p>

//                   <div className="flex gap-2 pt-3">

//                     <Button size="sm" variant="success" onClick={() => approveReview(r._id)}>
//                       Approve
//                     </Button>

//                     <Button size="sm" variant="outline" onClick={() => rejectReview(r._id)}>
//                       Reject
//                     </Button>

//                     <Button size="sm" variant="danger" onClick={() => deleteReview(r._id)}>
//                       Delete
//                     </Button>

//                   </div>

//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Approved Section */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">✅ Approved Reviews</h2>

//           <div className="grid md:grid-cols-3 gap-6">
//             {approved.map((r) => (
//               <Card key={r._id} className="p-5 rounded-2xl shadow-sm hover:shadow-lg transition">

//                 <h3 className="font-semibold text-lg">{r.title}</h3>

//                 <div className="text-yellow-400 text-lg">
//                   {"★".repeat(r.rating)}
//                 </div>

//                 <p className="text-sm text-gray-600">{r.comment}</p>

//                 <p className="text-xs text-gray-400">
//                   {r.reviewerName || "Anonymous"}
//                 </p>

//                 <div className="flex gap-2 pt-3">
//                   <Button size="sm" variant="danger" onClick={() => deleteReview(r._id)}>
//                     Delete
//                   </Button>
//                 </div>

//               </Card>
//             ))}
//           </div>
//         </div>

//       </div>
//     </AdminShell>
//   );
// };

// export default ProtectedRoute(Page);





"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "../Common_Method/protectedroute.js";

import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const API = "http://143.110.244.163:5000/api/review";

const Page = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    rating: 5,
    comment: "",
    reviewerName: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const [approvedRes, pendingRes] = await Promise.all([
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/admin/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setApproved(approvedRes.data.data || []);
      setPending(pendingRes.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id) => {
    await axios.patch(`${API}/admin/status/${id}`, { isApproved: true }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const rejectReview = async (id) => {
    await axios.patch(`${API}/admin/status/${id}`, { isApproved: false }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    await axios.delete(`${API}/admin/delete-review/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API}/admin/update-review/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/admin/add-review`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ title: "", rating: 5, comment: "", reviewerName: "" });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (r) => {
    setForm({
      title: r.title,
      rating: r.rating,
      comment: r.comment,
      reviewerName: r.reviewerName || "",
    });
    setEditingId(r._id);
  };

  return (
    <AdminShell>
      <div className="space-y-6">

        <PageHeader title="⭐ Review Management" subtitle="Admin can manage all reviews" />

        {/* Add / Edit Form */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold text-lg">
            {editingId ? "✏️ Edit Review" : "➕ Add Review"}
          </h2>

          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <Input type="number" placeholder="Rating (1-5)" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />

          <Input placeholder="Reviewer Name" value={form.reviewerName} onChange={(e) => setForm({ ...form, reviewerName: e.target.value })} />

          <textarea
            className="border rounded p-2 w-full"
            placeholder="Comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />

          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>

            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setForm({ title: "", rating: 5, comment: "", reviewerName: "" });
              }}>
                Cancel
              </Button>
            )}
          </div>
        </Card>

        {/* Pending Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🕒 Pending Reviews</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {pending.map((r) => (
              <Card key={r._id} className="p-5 space-y-2">
                <h3 className="font-semibold">{r.title}</h3>
                <div className="text-yellow-400">{"★".repeat(r.rating)}</div>
                <p>{r.comment}</p>
                <p className="text-xs">{r.reviewerName || "Anonymous"}</p>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveReview(r._id)}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => rejectReview(r._id)}>Reject</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteReview(r._id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Approved Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-4">✅ Approved Reviews</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {approved.map((r) => (
              <Card key={r._id} className="p-5 space-y-2">
                <h3 className="font-semibold">{r.title}</h3>
                <div className="text-yellow-400">{"★".repeat(r.rating)}</div>
                <p>{r.comment}</p>
                <p className="text-xs">{r.reviewerName || "Anonymous"}</p>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(r)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteReview(r._id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </AdminShell>
  );
};

export default ProtectedRoute(Page);