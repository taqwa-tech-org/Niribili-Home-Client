import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  UtensilsCrossed,
  CreditCard,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const userMenuItems = [
  {icon: Home, label: "হোম", href: "/"},
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", href: "/user-dashboard" },
  { icon: UtensilsCrossed, label: "খাবার অর্ডার", href: "/user-dashboard/meals" },
  { icon: CreditCard, label: "বিলিং", href: "/user-dashboard/billing" },
  { icon: User, label: "প্রোফাইল", href: "/user-dashboard/profile" },
  { icon: Bell, label: "নোটিফিকেশন", href: "/user-dashboard/notifications" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const menuItems = userMenuItems;

  const isActive = (href: string) => {
    if (href === `/${'user'}-dashboard`) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex ">
      {/* Sidebar - Desktop */}
      <aside className="hidden border  lg:flex w-64 flex-col fixed inset-y-0 left-0 z-50">

        {/* Logo */}
        <div className="h-16 flex items-center gap-2  px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg  flex items-center justify-center">
            <img src="/niribili-logo.png" alt="" />
          </div>
          <div>
            <span className="font-display text-lg font-semibold block leading-tight">নিরিবিলি হোম</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              {/* <AvatarFallback className="bg-primary/10 text-primary">
                {type === "admin" ? "অ্যা" : "র"}
              </AvatarFallback> */}
            </Avatar>
            <div className="flex-1 min-w-0">
              {/* <p className="text-sm font-medium truncate">
                {type === "admin" ? "মালিক" : "আব্দুর রহিম"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {type === "admin" ? "admin@niribili.com" : "rahim@email.com"}
              </p> */}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 lg:hidden"
            >
              {/* Logo */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                    <Home className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-display text-lg font-semibold">নিরিবিলি হোম</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-6 px-3">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col ">
        {/* Top Header */}

        <header className="h-16 bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>

            {/* Logout */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <LogOut className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
