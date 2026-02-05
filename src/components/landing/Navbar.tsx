import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "../ui/button";



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState("https://i.ibb.co.com/jvWvrYyy/images.jpg");
  const [userName, setUserName] = useState("");

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      // You can also fetch user data here if needed
      // const storedUserName = localStorage.getItem("userName");
      // const storedUserImage = localStorage.getItem("userImage");
      // if (storedUserName) setUserName(storedUserName);
      // if (storedUserImage) setUserImage(storedUserImage);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const navItems = [
    { name: "হোম", href: "/" },
    { name: "সুবিধাসমূহ", href: "#features" },
    { name: "নিয়মাবলী", href: "#rules" },
    { name: "যোগাযোগ", href: "#contact" },
    { name: "ড্যাশবোর্ড", href: "/user-dashboard" }
  ];

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
   
    
    setIsLoggedIn(false);
    setUserName("");
    setUserImage("");
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  
 

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
              <img src="/niribili-logo.png" alt="niribili home logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl font-semibold text-foreground leading-tight">
                নিরিবিলি <span className="text-gradient">হোম</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">
                Bachelor Hostel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                {userImage ? (
                  <>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary hover:border-primary/70 transition-all duration-300 hover:shadow-glow"
                    >
                      <img
                        src={userImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-semibold">{userName}</p>
                            <p className="text-xs text-muted-foreground">
                              Logged in
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/user-dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                            >
                              {/* <LayoutDashboard className="w-4 h-4" /> */}
                              ড্যাশবোর্ড
                            </Link>
                            <Link to="/changepassword">
                             <p className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors">পাসওয়ার্ড পরিবর্তন</p>
                             
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2 w-full text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              {/* <LogOut className="w-4 h-4" /> */}
                              লগআউট
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    লগআউট
                  </button>
                )}
              </div>
            ) : (
              <Button variant="hero" asChild>
                <Link to="/login">লগইন</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              <Link  to="/changepassword">
               <p className="mt-3 hover:text-green-400">পাসওয়ার্ড পরিবর্তন</p>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;