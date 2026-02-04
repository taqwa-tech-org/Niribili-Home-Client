import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { axiosSecure } from "@/hooks/useAxiosSecure";

type WalletSummaryType = {
  totalDeposits: number;
  totalDeductions: number;
  closingBalance: number;
};

const WalletSummary = () => {
  const [summary, setSummary] = useState<WalletSummaryType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/wallet/summary");
        setSummary(res.data?.data);
      } catch (error) {
        console.error("Wallet summary fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass p-6 rounded-3xl border border-border/50 animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* মোট জমা */}
      <div className="glass p-6 rounded-3xl border border-border/50">
        <p className="text-xs font-bold text-muted-foreground uppercase">
          মোট জমা
        </p>
        <p className="text-3xl font-black mt-2">
          ৳ {summary?.totalDeposits ?? 0}
        </p>
      </div>

      {/* মোট কর্তন */}
      <div className="glass p-6 rounded-3xl border border-border/50">
        <p className="text-xs font-bold text-muted-foreground uppercase">
          মোট কর্তন
        </p>
        <p className="text-3xl font-black mt-2 text-green-500">
          ৳ {summary?.totalDeductions ?? 0}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-500">
          <CheckCircle2 className="w-4 h-4" />
          মোট খরচ
        </div>
      </div>

      {/* বর্তমান ব্যালেন্স */}
      <div
        className={`glass p-6 rounded-3xl border border-border/50 ${
          summary?.closingBalance <= 0 ? "border-destructive/30" : ""
        }`}
      >
        <p className="text-xs font-bold text-muted-foreground uppercase">
          বর্তমান ব্যালেন্স
        </p>
        <p
          className={`text-3xl font-black mt-2 ${
            summary?.closingBalance > 0
              ? "text-primary"
              : "text-destructive"
          }`}
        >
          ৳ {summary?.closingBalance ?? 0}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          হালনাগাদ ব্যালেন্স
        </div>
      </div>
    </div>
  );
};

export default WalletSummary;
