
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatsCard from "@/components/Dashboard/StatsCard";
import MealCard from "@/components/Dashboard/MealCard";
import BillCard from "@/components/Dashboard/BillCard";
import ResidentInfoCard from "@/components/Dashboard/ResidentInfoCard";

const UserDashboard = () => {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
            স্বাগতম, <span className="text-gradient">রহিম!</span>
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="মোট বাকি"
          value="৳১২,৫০০"
          icon={CreditCard}
          color="destructive"
          delay={0}
        />
        <StatsCard
          title="এই মাসে খাবার"
          value="৪৫"
          change="+১২%"
          changeType="positive"
          icon={UtensilsCrossed}
          color="primary"
          delay={0.1}
        />
        <StatsCard
          title="বাকি দিন"
          value="৮"
          icon={Calendar}
          color="accent"
          delay={0.2}
        />
        <StatsCard
          title="নোটিফিকেশন"
          value="২"
          icon={AlertCircle}
          color="muted"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Meal Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Meals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold">আজকের খাবার</h2>
                <p className="text-sm text-muted-foreground">
                  আগামীকালের জন্য রাত ১০টার মধ্যে অর্ডার করুন
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/user-dashboard/meals" className="flex items-center gap-1">
                  সব দেখুন <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MealCard
                type="breakfast"
                price={50}
                time="সকাল ৭:০০ - ৯:০০"
                isOrdered={true}
                delay={0.3}
              />
              <MealCard
                type="lunch"
                price={80}
                time="দুপুর ১২:৩০ - ২:৩০"
                isOrdered={true}
                delay={0.4}
              />
              <MealCard
                type="dinner"
                price={80}
                time="রাত ৭:৩০ - ৯:৩০"
                isOrdered={false}
                delay={0.5}
              />
            </div>
          </motion.div>

          {/* Bill Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold">বিল সারাংশ</h2>
                <p className="text-sm text-muted-foreground">ডিসেম্বর ২০২৪</p>
              </div>
              <Button variant="hero" size="sm" asChild>
                <Link to="/user-dashboard/billing">পেমেন্ট করুন</Link>
              </Button>
            </div>

            <div className="space-y-3">
              <BillCard label="রুম ভাড়া" amount={5000} status="paid" delay={0.5} />
              <BillCard label="খাবার খরচ" amount={4200} status="pending" delay={0.55} />
              <BillCard label="বিদ্যুৎ বিল" amount={800} status="pending" delay={0.6} />
              <BillCard label="পানির বিল" amount={200} status="pending" delay={0.65} />
              <BillCard label="সার্ভিস চার্জ" amount={500} status="pending" delay={0.7} />
              <BillCard
                label="আগের বাকি"
                amount={1800}
                dueDate="১০ জানু, ২০২৫"
                status="overdue"
                delay={0.75}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-lg font-semibold">মোট পরিশোধযোগ্য</span>
              <span className="font-display text-2xl font-bold text-gradient">
                ৳১২,৫০০
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Profile Card */}
        <div className="space-y-6">
          <ResidentInfoCard
            name="আব্দুর রহিম"
            email="rahim@email.com"
            phone="+৮৮০ ১৭১২-৩৪৫৬৭৮"
            building="বিল্ডিং এ"
            flat="৩বি"
            room="৩০২"
            status="active"
          />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4">দ্রুত কাজ</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/user-dashboard/meals">
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  আগামীকালের খাবার অর্ডার
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/user-dashboard/billing">
                  <CreditCard className="w-4 h-4 mr-2" />
                  পেমেন্ট করুন
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/user-dashboard/profile">
                  <Calendar className="w-4 h-4 mr-2" />
                  প্রোফাইল আপডেট
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
