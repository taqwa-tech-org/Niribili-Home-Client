import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

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

interface ResidentInfoCardProps {
  name: string;
  email: string;
  phone: string;
  building: string;
  flat: string;
  room: string;
  status :string
}

/* ---------------- Dashboard ---------------- */
const UserDashboard = () => {
  /* -------- Context -------- */
  const { user, userProfile, userLoading, profileLoading, error } = useUser();

  /* -------- Local State -------- */
  const [mealData, setMealData] = useState<MealSummary | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------- Fetch Meal Summary -------- */
  useEffect(() => {
    const fetchMealCost = async () => {
      try {
        const res = await axiosSecure.get("/meals/my-total-cost");
        setMealData(res.data.data);
      } catch (err) {
        console.log("error from meal-total-cost", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMealCost();
  }, []);

  /* -------- Global Loading -------- */
  if (userLoading || profileLoading || loading) return <FullScreenLoading />;

  if (error) {
    return <p className="text-red-500">কিছু একটা সমস্যা হয়েছে</p>;
  }

  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* -------- Safe Data Access -------- */
  const profile = userProfile;

  return (
    <div className="py-5 space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
            স্বাগতম, {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Side – User Info */}
        <ResidentInfoCard
          name={user?.name || ""}
          email={user?.email || ""}
          phone={user?.phone || ""}
          building={profile?.buildingId?.name || ""}
          flat={profile?.flatId?.name || ""}
          room={profile?.room || ""}
          status={
            user?.status?.toLowerCase() === "restricted"
              ? "restricted"
              : "active"
          }
        />

        {/* Left Side – Meal & Wallet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meal Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5 rounded-3xl">
              <p className="text-xs">মোট মিল</p>
              <p className="text-2xl font-black">{mealData?.totalMeals ?? 0}</p>
            </div>

            <div className="glass p-5 rounded-3xl">
              <p className="text-xs">মোট মিল খরচ</p>
              <p className="text-2xl font-black">
                ৳ {mealData?.totalMealCost ?? 0}
              </p>
            </div>
          </div>

          {/* Wallet */}
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5" /> ওয়ালেট সারাংশ
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs">বর্তমান ব্যালেন্স</p>
                <p className="text-xl font-black text-green-500">
                  ৳ {mealData?.currentBalance ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs">মোট জমা</p>
                <p className="font-bold">৳ {mealData?.totalDeposited ?? 0}</p>
              </div>

              <div>
                <p className="text-xs">মোট খরচ</p>
                <p className="font-bold text-destructive">
                  ৳ {mealData?.totalSpent ?? 0}
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
