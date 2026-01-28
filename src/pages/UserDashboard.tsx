import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  CreditCard,
  Wallet,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ResidentInfoCard from "@/components/Dashboard/ResidentInfoCard";
import { useUser } from "@/Context/UserProvider";
import FullScreenLoading from "@/components/ui/FullScreenLoading";
import { axiosSecure } from "@/hooks/useAxiosSecure";

/* ---------------- Types ---------------- */
interface MealSummary {
  totalMealCost: number;
  totalMeals: number;
  currentBalance: number;
  totalDeposited: number;
  totalSpent: number;
  netBalance: number;
}

const UserDashboard = () => {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { user, userProfile, userLoading, profileLoading, error } = useUser();

  const [mealData, setMealData] = useState<MealSummary | null>(null);
  const [mealLoading, setMealLoading] = useState(false);

  /* ---------------- Fetch meal summary ---------------- */
  useEffect(() => {
    const fetchMealSummary = async () => {
      try {
        setMealLoading(true);
        const res = await axiosSecure.get("/meals/my-total-cost");
        setMealData(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch meal summary", err);
      } finally {
        setMealLoading(false);
      }
    };

    fetchMealSummary();
  }, []);

  if (userLoading || profileLoading || mealLoading) {
    return <FullScreenLoading />;
  }

  if (error) return <p>{error}</p>;
  if (!userProfile || !mealData) return <p>Profile not available</p>;

  return (
    <div className="py-5 space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
            স্বাগতম, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden md:flex items-center gap-4 bg-card border border-border p-2 rounded-2xl"
        >
          <div className="flex flex-col items-end px-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              পেমেন্ট ডেডলাইন
            </span>
            <span className="text-sm font-bold text-destructive">
              প্রতি মাসের ১০ তারিখ
            </span>
          </div>
          <Button className="bg-primary shadow-glow h-10 px-6 rounded-xl font-bold">
            পেমেন্ট করুন
          </Button>
        </motion.div>
      </div>

      {/* ---------------- Main Grid ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* -------- Right Column -------- */}
        <div className="space-y-6">
          <ResidentInfoCard
            name={user.name}
            email={user.email}
            phone={String(user.phone)}
            building={userProfile.buildingId?.name}
            flat={userProfile.flatId?.name}
            room={userProfile?.room}
            status="active"
          />
        </div>
        {/* -------- Left Column -------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meal Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -2 }}
              className="glass rounded-3xl p-5 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">মোট মিল</p>
                  <p className="text-2xl font-black">
                    {mealData.totalMeals}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="glass rounded-3xl p-5 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    মোট মিল খরচ
                  </p>
                  <p className="text-2xl font-black">
                    ৳ {mealData.totalMealCost}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Wallet Snapshot */}
          <div className="glass rounded-3xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                ওয়ালেট সারাংশ
              </h3>
              <span className="text-xs text-muted-foreground">
                আপডেটেড
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  বর্তমান ব্যালেন্স
                </p>
                <p className="text-xl font-black text-green-500">
                  ৳ {mealData.currentBalance}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">মোট জমা</p>
                <p className="font-bold">৳ {mealData.totalDeposited}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">মোট খরচ</p>
                <p className="font-bold text-destructive">
                  ৳ {mealData.totalSpent}
                </p>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default UserDashboard;
