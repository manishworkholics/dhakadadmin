"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
LineChart,
Line,
CartesianGrid
} from "recharts";

import {
Users,
DollarSign,
Activity,
Heart,
MapPin,
Crown,
UserCheck,
Clock
} from "lucide-react";
import { adminMenuItems } from "../Sidebar/menuItems";

const API = "http://143.110.244.163:5000/api/admin/dashboard";

const monthNames = [
"", "Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function Dashboard(){
const router = useRouter()

const [dashboard,setDashboard] = useState(null)

const menuPathByName = adminMenuItems.reduce((acc, item) => {
acc[item.name] = item.path
return acc
}, {})

const resolveMenuPath = (name, fallback = "/Pages/Dashboard") =>
menuPathByName[name] || fallback

useEffect(()=>{

const load = async()=>{

const res = await fetch(API)
const data = await res.json()

setDashboard(data)

}

load()

},[])

if(!dashboard){
return <div className="p-6">Loading Dashboard...</div>
}

const {
stats,
userGrowth,
revenueOverview,
topCities,
topPlans,
recentActivities
} = dashboard

const userChart = userGrowth.map(d=>({
name:monthNames[d.month],
users:d.count
}))

const revenueChart = revenueOverview.map(d=>({
name:monthNames[d.month],
revenue:d.amount
}))

return(

<div className="p-6 space-y-8 bg-[#F6FAFF] min-h-screen">


{/* ================= METRIC CARDS ================= */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

<Card title="Total Users" value={stats.totalUsers} icon={<Users/>} color="blue" onClick={()=>router.push(resolveMenuPath("Users Management"))}/>

<Card title="Verified Profiles" value={stats.verifiedProfiles} icon={<UserCheck/>} color="green" onClick={()=>router.push(resolveMenuPath("Profile Management"))}/>

<Card title="Premium Users" value={stats.premiumUsers} icon={<Crown/>} color="purple" onClick={()=>router.push(resolveMenuPath("Membership Plans"))}/>

<Card title="Active Matches" value={stats.activeMatches} icon={<Heart/>} color="pink" onClick={()=>router.push(resolveMenuPath("Profile Management"))}/>

<Card title="Total Revenue" value={`₹${Math.round(stats.totalRevenue)}`} icon={<DollarSign/>} color="green" onClick={()=>router.push(resolveMenuPath("Payment Management"))}/>

<Card title="Today Revenue" value={`₹${Math.round(stats.todayRevenue)}`} icon={<DollarSign/>} color="yellow" onClick={()=>router.push(resolveMenuPath("Payment Management"))}/>

<Card title="Pending Profiles" value={stats.pendingProfiles} icon={<Clock/>} color="red" onClick={()=>router.push(resolveMenuPath("Profile Management"))}/>

<Card title="Active Today" value={stats.activeToday} icon={<Activity/>} color="blue" onClick={()=>router.push(resolveMenuPath("Users Management"))}/>

</div>



{/* ================= CHART SECTION ================= */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<Chart title="User Growth" onClick={()=>router.push(resolveMenuPath("Users Management"))}>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={userChart}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="users" fill="#3B82F6" radius={[10,10,0,0]}/>
</BarChart>
</ResponsiveContainer>

</Chart>


<Chart title="Revenue Overview" onClick={()=>router.push(resolveMenuPath("Payment Management"))}>

<ResponsiveContainer width="100%" height={300}>
<LineChart data={revenueChart}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3}/>
</LineChart>
</ResponsiveContainer>

</Chart>

</div>



{/* ================= ANALYTICS WIDGETS ================= */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


{/* TOP CITIES */}

<Widget title="Top Cities" icon={<MapPin size={18}/>} onClick={()=>router.push(resolveMenuPath("Cities"))}>
{topCities.map((city,i)=>(
<div key={i} className="flex justify-between border-b py-2">
<span>{city.city}</span>
<span className="font-semibold">{city.count}</span>
</div>
))}
</Widget>



{/* TOP PLANS */}

<Widget title="Top Plans" icon={<Crown size={18}/>} onClick={()=>router.push(resolveMenuPath("Membership Plans"))}>
{topPlans.map((plan,i)=>(
<div key={i} className="flex justify-between border-b py-2">
<span>{plan.plan}</span>
<span className="font-semibold">{plan.total}</span>
</div>
))}
</Widget>



{/* RECENT ACTIVITIES */}

<Widget title="Recent Activities" onClick={()=>router.push(resolveMenuPath("Users Management"))}>

{recentActivities.map((a,i)=>{

const name = a.message.split(" ")[0]

return(

<div key={i} className="flex justify-between border-b py-2">

<span>{name} registered</span>

<span className="text-sm text-gray-500">
{timeAgo(a.time)}
</span>

</div>

)

})}

</Widget>

</div>



{/* ================= QUICK ADMIN ACTIONS ================= */}

<div className="bg-white rounded-xl shadow p-6">

<h3 className="text-lg font-semibold mb-4">
Quick Admin Actions
</h3>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

<ActionBtn title="Approve Profiles" onClick={()=>router.push(resolveMenuPath("Profile Management"))}/>

<ActionBtn title="View Payments" onClick={()=>router.push(resolveMenuPath("Payment Management"))}/>

<ActionBtn title="Manage Plans" onClick={()=>router.push(resolveMenuPath("Membership Plans"))}/>

<ActionBtn
title="Send Notification"
onClick={()=>{
// Closest match found in project pages: AutoSendEmail route.
router.push("/Pages/AutoSendEmail")
}}
/>

</div>

</div>


</div>

)

}



function Card({title,value,icon,color,onClick}){

const colors={
blue:"bg-blue-100 text-blue-700",
green:"bg-green-100 text-green-700",
pink:"bg-pink-100 text-pink-700",
purple:"bg-purple-100 text-purple-700",
yellow:"bg-yellow-100 text-yellow-700",
red:"bg-red-100 text-red-700"
}

return(

<div
onClick={onClick}
className="bg-white p-5 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-md transition"
>

<div>

<p className="text-gray-500 text-sm">
{title}
</p>

<h2 className="text-2xl font-bold">
{value}
</h2>

</div>

<div className={`p-3 rounded-xl ${colors[color]}`}>
{icon}
</div>

</div>

)

}



function Chart({title,children,onClick}){

return(

<div
onClick={onClick}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition"
>

<h3 className="text-lg font-semibold mb-4">
{title}
</h3>

{children}

</div>

)

}



function Widget({title,icon,children,onClick}){

return(

<div
onClick={onClick}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition"
>

<div className="flex items-center gap-2 font-semibold mb-4">
{icon}
{title}
</div>

<div className="space-y-2">
{children}
</div>

</div>

)

}



function ActionBtn({title,onClick}){

return(

<button
onClick={onClick}
className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg text-sm cursor-pointer hover:shadow-md transition"
>
{title}
</button>

)

}



function timeAgo(date){

const diff=(Date.now()-new Date(date))/1000

if(diff<60) return "just now"
if(diff<3600) return Math.floor(diff/60)+" min ago"
if(diff<86400) return Math.floor(diff/3600)+" hr ago"

return Math.floor(diff/86400)+" days ago"

}