import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, UtensilsCrossed, Shield, Home } from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Floating Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute inset-0 -z-5 overflow-hidden pointer-events-none"
      >
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] p-3 rounded-2xl glass shadow-lg"
        >
          <Building2 className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-48 right-[20%] p-3 rounded-2xl glass shadow-lg"
        >
          <UtensilsCrossed className="w-8 h-8 text-accent" />
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[20%] p-3 rounded-2xl glass shadow-lg"
        >
          <Shield className="w-8 h-8 text-primary" />
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass mb-8"
          >
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              {/* <Home className="w-5 h-5 text-primary-foreground" /> */}
              <img src="/niribili-logo.png" alt="niribili home" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground">
              নিরিবিলি হোম
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            স্বাগতম
            <br />
            <span className="text-gradient">নিরিবিলি হোম</span> এ
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            আপনার হোস্টেল জীবনকে সহজ করুন। খাবার অর্ডার করুন, বিল দেখুন, 
            এবং সবকিছু এক জায়গা থেকে পরিচালনা করুন।
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/login" className="group">
                লগইন করুন
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/contact">যোগাযোগ</Link>
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-20 pt-10 border-t border-border"
          >
            {[
              { icon: UtensilsCrossed, title: "সহজ খাবার অর্ডার", desc: "প্রতিদিনের খাবার অর্ডার করুন সহজেই" },
              { icon: Building2, title: "একাধিক বিল্ডিং", desc: "সকল বিল্ডিং এক সিস্টেমে" },
              { icon: Shield, title: "নিরাপদ পেমেন্ট", desc: "বিকাশে সহজে পেমেন্ট করুন" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-secondary/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
