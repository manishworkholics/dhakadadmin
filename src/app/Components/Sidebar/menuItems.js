import {
  LayoutDashboard,
  Search,
  Users,
  Phone,
  Info,
  Image,
  UsersRound,
  Trophy,
  UserCog,
  Star,
  MapPin,
  CreditCard,
  Shield,
  BarChart2,
  TicketPercent,
  UserX,
} from "lucide-react";

export const adminMenuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/Pages/Dashboard",
  },
  { name: "Contact Us", icon: <Phone size={20} />, path: "/Pages/ContactUs" },
  {
    name: "Success Stories",
    icon: <Trophy size={20} />,
    path: "/Pages/SuccessStory",
  },
  {
    name: "Profile Management",
    icon: <UserCog size={20} />,
    path: "/Pages/ProfileManagement",
  },
  { name: "Testimonials", icon: <Star size={20} />, path: "/Pages/Testimonials" },
  {
    name: "Membership Plans",
    icon: <CreditCard size={20} />,
    path: "/Pages/MembershipPlans",
  },
  {
    name: "Coupons",
    icon: <TicketPercent size={20} />,
    path: "/Pages/Coupon",
  },
  { name: "Admin User", icon: <Shield size={20} />, path: "/Pages/AdminUser" },
  {
    name: "Users Management",
    icon: <Users size={20} />,
    path: "/Pages/UserManagement",
  },
  {
    name: "Deactivate Requests",
    icon: <UserX size={20} />,
    path: "/Pages/DeactivateRequests",
  },
  {
    name: "Payment Management",
    icon: <BarChart2 size={20} />,
    path: "/Pages/PaymentManagement",
  },
  { name: "Cities", icon: <MapPin size={20} />, path: "/Pages/Cities" },
  { name: "Seo", icon: <Search size={20} />, path: "/Pages/Seo" },
  { name: "Blog", icon: <Search size={20} />, path: "/Pages/Blog" },
  { name: "Gallery", icon: <Image size={20} />, path: "/Pages/Gallery" },
  {
    name: "Terms & Conditions",
    icon: <Info size={20} />,
    path: "/Pages/Terms",
  },
  {
    name: "Team Members",
    icon: <UsersRound size={20} />,
    path: "/Pages/TeamMembers",
  },
];
