import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  CreditCard,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  Users,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ১. রোল অনুযায়ী মেনু কনফিগ
const menuConfig = {
  user: [
    { icon: LayoutDashboard, label: "ড্যাশবোর্ড", href: "/user-dashboard" },
    { icon: UtensilsCrossed, label: "খাবার অর্ডার", href: "/user-dashboard/meals" },
    { icon: CreditCard, label: "বিলিং", href: "/user-dashboard/billing" },
    { icon: User, label: "প্রোফাইল", href: "/user-dashboard/profile" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "এডমিন ড্যাশবোর্ড", href: "/admin-dashboard" },
    { icon: Users, label: "ইউজার ম্যানেজমেন্ট", href: "/admin-dashboard/users" },
    { icon: UtensilsCrossed, label: "মিল কন্ট্রোল", href: "/admin-dashboard/meals" },
    { icon: FileText, label: "বিল জেনারেটর", href: "/admin-dashboard/billing" },
  ]
};

interface Props {
  role: 'admin' | 'user';
}

const DashboardLayout = ({ role = 'user' }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const menuItems = menuConfig[role];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden border-r lg:flex w-64 flex-col fixed inset-y-0 left-0 z-50 bg-card">
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
            <img src="/niribili-logo.png" alt="logo" className="w-5 h-5 brightness-0 invert" />
          </div>
          <span className="font-display text-lg font-bold text-gradient">নিরিবিলি হোম</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 bg-linear-to-b from-card to-secondary/30">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 p-2 rounded-xl glass hover:bg-secondary transition-all cursor-pointer group">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {role === 'admin' ? 'এ' : 'র'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                {role === 'admin' ? 'এডমিন সাহেব' : 'আব্দুর রহিম'}
              </p>
              <div className="flex items-center gap-1">
                {role === 'admin' && <ShieldCheck className="w-3 h-3 text-accent" />}
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {role}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 border-b border-border/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Role Indicator for Header */}
          <div className="hidden md:block">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
              role === 'admin' 
              ? 'bg-accent/10 text-accent border-accent/20' 
              : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {role === 'admin' ? 'ADMIN PANEL' : 'RESIDENT PORTAL'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
            </Button>
            
            <div className="h-8 w-[1px] bg-border mx-2" />

            <Button variant="ghost" size="icon" className="hover:text-destructive transition-colors" asChild>
              <Link to="/">
                <LogOut className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-linear-to-b from-background to-secondary/20 p-4 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      {/* Mobile Sidebar (Logic same as above, just inside AnimatePresence) */}
      {/* ... (আপনার আগের মোবাইলের AnimatePresence লজিকটি এখানে বসিয়ে দিন) */}
    </div>
  );
};

export default DashboardLayout;