import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <img src="/niribili-logo.png" alt="niribili home logo" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-background block leading-tight">
                  নিরিবিলি হোম
                </span>
                <span className="text-[10px] text-background/50">Bachelor Hostel</span>
              </div>
            </Link>
            <p className="text-background/60 text-sm">
              আপনার নিরাপদ ও আরামদায়ক থাকার জায়গা। 
              সুন্দর পরিবেশে মানসম্মত সেবা।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-background/60 hover:text-primary transition-colors">
                  সুবিধাসমূহ
                </a>
              </li>
              <li>
                <a href="#rules" className="text-sm text-background/60 hover:text-primary transition-colors">
                  নিয়মাবলী
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-background/60 hover:text-primary transition-colors">
                  যোগাযোগ
                </a>
              </li>
              <li>
                <Link to="/login" className="text-sm text-background/60 hover:text-primary transition-colors">
                  লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="hidden md:block">
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+৮৮০ ১৭১২-৩৪৫৬৭৮</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@niribilihome.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © {currentYear} নিরিবিলি হোম। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-background/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
