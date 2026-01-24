import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom"; // নির্দেশনা অনুযায়ী react-router
import StatsCard from "@/components/Dashboard/StatsCard";
import MealCard from "@/components/Dashboard/MealCard";
import BillCard from "@/components/Dashboard/BillCard";
import ResidentInfoCard from "@/components/Dashboard/ResidentInfoCard";
import { useUser } from "@/Context/UserProvider";


const UserDashboard = () => {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // এই ডেটাগুলো সাধারণত API থেকে আসবে
  const billingData = {
    rent: 5000,
    electricity: 800,
    water: 200,
    mealCost: 4200,
    serviceCharge: 500,
    previousDue: 1800,
    totalPayable: 12500,
    deadline: "২৫ জানুয়ারি, ২০২৬",
    paymentStatus: "Pending" as const,
  };

  interface LoaderData {
  data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    [key: string]: string | undefined;
  };
}

  const user  = useLoaderData() as LoaderData;
  // console.log(user.data.name)

  return (
    <div className="py-5">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ACCOUNT ACTIVE
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
            স্বাগতম, <span className="text-gradient">{user.data.name}</span>
          </h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="hidden md:flex items-center gap-4 bg-card border border-border p-2 rounded-2xl"
        >
           <div className="flex flex-col items-end px-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">পেমেন্ট ডেডলাইন</span>
              <span className="text-sm font-bold text-destructive">{billingData.deadline}</span>
           </div>
           <Button className="bg-primary shadow-glow h-10 px-6 rounded-xl font-bold">
              পেমেন্ট করুন
           </Button>
        </motion.div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="মোট বকেয়া"
          value={`৳${billingData.totalPayable.toLocaleString()}`}
          icon={CreditCard}
          color="destructive"
          delay={0}
        />
        <StatsCard
          title="এই মাসের মিল"
          value="৪৫"
          change="+১২%"
          changeType="positive"
          icon={UtensilsCrossed}
          color="primary"
          delay={0.1}
        />
        <StatsCard
          title="পেমেন্ট বাকি"
          value="০৮ দিন"
          icon={Calendar}
          color="accent"
          delay={0.2}
        />
        <StatsCard
          title="ডকুমেন্ট স্ট্যাটাস"
          value="Verified"
          icon={FileText}
          color="primary"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Meal & Billing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Bill Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-3xl border border-border p-6 md:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4">
               <ReceiptIcon className="w-24 h-24 text-primary/5 absolute -right-4 -top-4 rotate-12" />
            </div>

           

          
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> বিলিং স্ন্যাপশট
                </h2>
                <p className="text-sm text-muted-foreground mt-1">জানুয়ারি ২০২৬ মাসের হিসাব</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                 billingData.paymentStatus === 'Pending' 
                 ? "bg-accent/10 text-accent border-accent/20" 
                 : "bg-green-500/10 text-green-500 border-green-500/20"
              }`}>
                {billingData.paymentStatus === 'Pending' ? "• PENDING" : "• PAID"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 relative z-10">
              <BillCard label="রুম ভাড়া (Rent)" amount={billingData.rent} status="paid" />
              <BillCard label="খাবার খরচ (Meal)" amount={billingData.mealCost} status="pending" />
              <BillCard label="বিদ্যুৎ বিল (Electricity)" amount={billingData.electricity} status="pending" />
              <BillCard label="পানির বিল (Water)" amount={billingData.water} status="pending" />
              <BillCard label="সার্ভিস চার্জ" amount={billingData.serviceCharge} status="pending" />
              <BillCard label="আগের বকেয়া" amount={billingData.previousDue} status="overdue" />
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-center sm:text-left">
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">সর্বমোট পরিশোধযোগ্য</p>
                 <span className="font-display text-3xl font-black text-gradient leading-tight">
                    ৳{billingData.totalPayable.toLocaleString()}
                 </span>
              </div>
              <Button className="w-full sm:w-auto bg-primary shadow-glow px-10 h-12 rounded-xl font-bold">
                 পেমেন্ট করুন
              </Button>
            </div>
          </motion.div>

          {/* Today's Meals */}
          <MealCard/>
        </div>

        {/* Right Column - Resident Profile & Docs */}
        <div className="space-y-6">
          <ResidentInfoCard
            name={user.data.name}
            email={user.data.email}
            phone={user.data.phone}
            building="বিল্ডিং-এ (Niribili Home)"
            flat="ফ্ল্যাট: ৩-বি"
            room="রুম: ৩০২"
            status="active"
          />

          {/* Uploaded Documents Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card rounded-3xl border border-border p-6"
          >
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-primary" /> আইডি ডকুমেন্টস
            </h3>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText className="w-4 h-4"/></div>
                     <span className="text-xs font-bold">NID Front Side</span>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase">Verified</span>
               </div>
               <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText className="w-4 h-4"/></div>
                     <span className="text-xs font-bold">NID Back Side</span>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase">Verified</span>
               </div>
               <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 h-10">
                  সব ডকুমেন্ট দেখুন
               </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-3xl border border-border p-6 bg-linear-to-b from-primary/5 to-transparent"
          >
            <h3 className="font-display text-lg font-bold mb-4">কুইক অ্যাকশন</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl font-bold h-11" asChild>
                <Link to="/user-dashboard/meals"><UtensilsCrossed className="w-4 h-4 text-primary" /> মিল ম্যানেজমেন্ট</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl font-bold h-11" asChild>
                <Link to="/user-dashboard/billing"><CreditCard className="w-4 h-4 text-primary" /> ট্রানজেকশন হিস্ট্রি</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl font-bold h-11" asChild>
                <Link to="/user-dashboard/profile"><User className="w-4 h-4 text-primary" /> প্রোফাইল সেটিংস</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// একটি ছোট ডেকোরেটিভ আইকন কম্পোনেন্ট
const ReceiptIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default UserDashboard;