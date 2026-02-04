import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "../ui/button";

const CTA = () => {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden ">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0  h-96 bg-teal-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0  h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10  h-32 border border-primary-foreground rounded-2xl rotate-12" />
        <div className="absolute top-20 right-20  h-24 border border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 left-1/4  h-40 border border-primary-foreground rounded-3xl -rotate-12" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              যোগাযোগ করুন
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              কোনো প্রশ্ন বা সমস্যা থাকলে আমাদের সাথে যোগাযোগ করুন। 
              আমরা সবসময় আপনার পাশে আছি।
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary-foreground/90">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">ফোন</p>
                  <p className="font-medium">+৮৮০ ১৭১২-৩৪৫৬৭৮</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-primary-foreground/90">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">ইমেইল</p>
                  <p className="font-medium">info@niribilihome.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-primary-foreground/90">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">ঠিকানা</p>
                  <p className="font-medium">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Login CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="p-8 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-4">
                ইতিমধ্যে রেজিস্টার্ড?
              </h3>
              <p className="text-primary-foreground/70 mb-6">
                আপনার অ্যাকাউন্টে লগইন করুন এবং খাবার অর্ডার করুন, বিল দেখুন।
              </p>
              <Button variant="gold" size="xl" asChild className="w-full sm:w-auto">
                <Link to="/login" className="group">
                  লগইন করুন
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <p className="text-primary-foreground/50 text-sm mt-6">
              নতুন? ম্যানেজমেন্টের সাথে যোগাযোগ করুন রেজিস্ট্রেশনের জন্য।
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
