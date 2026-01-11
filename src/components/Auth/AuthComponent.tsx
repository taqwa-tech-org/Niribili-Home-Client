import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; // lucide-react ব্যবহার করা হয়েছে আইকনের জন্য

const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md bg-card rounded-[var(--radius)] shadow-lg border border-border overflow-hidden">
        
        {/* ট্যাব সুইচার */}
        <div className="flex p-2 bg-muted/50 gap-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-base font-medium transition-all rounded-[calc(var(--radius)-4px)] ${
              isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            লগইন
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-base font-medium transition-all rounded-[calc(var(--radius)-4px)] ${
              !isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        <div className="p-8">
          {/* লোগো সেকশন */}
          <div className="flex justify-center mb-6">
            <img src="/niribili-logo.png" alt="Niribili Logo" className="w-12 h-12 object-contain" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground">
              {isLogin ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি করুন'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন।' : 'নিড়িবিলি পরিবারে যুক্ত হতে ফর্মটি পূরণ করুন।'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">আপনার নাম</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: রহিম হোসেন"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5">ইমেইল এড্রেস</label>
                  <input 
                    type="email" 
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none transition-all"
                  />
                </div>
                
                {/* পাসওয়ার্ড ইনপুট উইথ টগল */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">পাসওয়ার্ড</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-teal transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-hero text-primary-foreground font-semibold rounded-lg shadow-glow hover:opacity-90 transition-opacity mt-2">
                  {isLogin ? 'লগইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* বিভাজক */}
          <div className="relative my-8 text-center">
            <hr className="border-border" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs text-muted-foreground uppercase tracking-widest">
              অথবা
            </span>
          </div>

          {/* গুগল লগইন */}
          <button className="w-full py-2.5 border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-secondary transition-colors font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.55-3.55C18.1 1.45 15.34 0 12 0 7.31 0 3.32 2.69 1.39 6.6l4.14 3.22c.98-2.9 3.67-5.04 6.47-5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.2-2.3H12v4.35h6.44c-.28 1.48-1.12 2.74-2.38 3.58l4.14 3.23c2.42-2.23 3.29-5.51 3.29-8.86z" />
              <path fill="#FBBC05" d="M5.53 14.18c-.23-.68-.36-1.41-.36-2.18s.13-1.5.36-2.18L1.39 6.6C.51 8.21 0 10.04 0 12s.51 3.79 1.39 5.4l4.14-3.22z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-4.14-3.23c-1.05.7-2.4 1.14-3.81 1.14-2.8 0-5.18-1.89-6.03-4.44l-4.14 3.22C3.32 21.31 7.31 24 12 24z" />
            </svg>
            গুগল দিয়ে লগইন করুন
          </button>

          {isLogin && (
            <p className="text-center mt-6 text-sm">
              <a href="#" className="text-teal font-medium hover:underline decoration-gold underline-offset-4">
                পাসওয়ার্ড ভুলে গেছেন?
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;