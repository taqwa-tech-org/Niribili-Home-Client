import React, { useEffect, useState } from "react";
import { axiosSecure } from "@/hooks/useAxiosSecure";
import {
  Receipt,
  History,
  CreditCard,
  Download,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletSummary from "../../pages/WalletSummary";

/* -------------------- Types -------------------- */
interface BillingSummary {
  rent: number;
  electricity: number;
  water: number;
  serviceCharge: number;
  mealCost: number;
  previousDue: number;
  paidAmount: number;
}

interface Transaction {
  _id: string;
  amount: number;
  transactionId: string;
  createdAt: string;
}

/* -------------------- Component -------------------- */
const UserBilling: React.FC = () => {
  /* ---------- Static bill summary ---------- */
  const bill: BillingSummary = {
    rent: 3000,
    electricity: 450,
    water: 150,
    serviceCharge: 200,
    mealCost: 1850,
    previousDue: 500,
    paidAmount: 4000,
  };

  const totalCurrentMonth =
    bill.rent +
    bill.electricity +
    bill.water +
    bill.serviceCharge +
    bill.mealCost;

  const grandTotal = totalCurrentMonth + bill.previousDue;
  const remainingDue = grandTotal - bill.paidAmount;

  /* ---------- Payment history state ---------- */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  /* ---------- Fetch transactions ---------- */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          "/wallet/transactions?month=2026-01&type=deposit"
        );
        setTransactions(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const visibleTransactions = showAll
    ? transactions
    : transactions.slice(0, 5);

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full space-y-6 py-4 px-4 sm:space-y-8 sm:py-5 sm:px-3 lg:px-0">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-display text-gradient flex items-center gap-2 sm:gap-3 sm:text-3xl">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
            <span className="truncate">আমার বিল ও পেমেন্ট</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            জানুয়ারি ২০২৬ মাসের বিলিং বিবরণী
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 border-border flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">ডাউনলোড ইনভয়েস</span>
          </Button>
          <Button className="bg-primary shadow-glow gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">পেমেন্ট করুন</span>
          </Button>
        </div>
      </div>

      {/* ---------- Wallet Summary ---------- */}
      <WalletSummary />

      {/* ---------- Payment History ---------- */}
      <div className="glass rounded-2xl sm:rounded-3xl border border-border/50 overflow-hidden flex flex-col">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-border/50 bg-secondary/10">
          <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            <span>পেমেন্ট হিস্ট্রি</span>
          </h3>
        </div>

        {/* ---------- Desktop Table (Visible on sm and above) ---------- */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground text-[10px] sm:text-xs font-black uppercase">
              <tr>
                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold">
                  তারিখ
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold">
                  মেথড
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold">
                  ট্রানজেকশন ID
                </th>
                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-bold">
                  পরিমাণ
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 sm:px-4 lg:px-6 py-6 text-center text-xs text-muted-foreground"
                  >
                    লোড হচ্ছে...
                  </td>
                </tr>
              )}

              {!loading && visibleTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 sm:px-4 lg:px-6 py-6 text-center text-xs text-muted-foreground"
                  >
                    কোন লেনদেন নেই
                  </td>
                </tr>
              )}

              {!loading &&
                visibleTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">
                      {new Date(tx.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 py-1 bg-secondary rounded-lg border border-border/50 inline-block">
                        sslcommerz
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-muted-foreground font-mono text-xs sm:text-sm max-w-xs truncate">
                      {tx.transactionId}
                    </td>

                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-bold text-green-500 text-xs sm:text-sm">
                      ৳ {tx.amount.toLocaleString("bn-BD")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile Card View (Visible only on mobile) ---------- */}
        <div className="sm:hidden space-y-2 p-3">
          {loading && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              লোড হচ্ছে...
            </div>
          )}

          {!loading && visibleTransactions.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              কোন লেনদেন নেই
            </div>
          )}

          {!loading &&
            visibleTransactions.map((tx) => (
              <div
                key={tx._id}
                className="border border-border/50 rounded-lg bg-secondary/5 overflow-hidden"
              >
                {/* Card Header (Always visible) */}
                <button
                  onClick={() =>
                    setExpandedRow(expandedRow === tx._id ? null : tx._id)
                  }
                  className="w-full p-3 flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <div className="flex flex-col items-start gap-1 flex-1 text-left">
                    <div className="text-xs font-bold text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm font-bold text-green-500">
                      ৳ {tx.amount.toLocaleString("bn-BD")}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-primary transition-transform flex-shrink-0 ${
                      expandedRow === tx._id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Card Expanded Details */}
                {expandedRow === tx._id && (
                  <div className="border-t border-border/50 p-3 bg-primary/5 space-y-2">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase mb-1">
                        পেমেন্ট মেথড
                      </div>
                      <span className="text-[9px] font-bold px-2 py-1 bg-secondary rounded-lg border border-border/50 inline-block">
                        sslcommerz
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase mb-1">
                        ট্রানজেকশন ID
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground break-all bg-muted/20 p-2 rounded border border-border/50">
                        {tx.transactionId}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* ---------- Show More Button ---------- */}
        {!showAll && transactions.length > 5 && (
          <div className="p-3 sm:p-4 bg-primary/5 text-center border-t border-border/50">
            <button
              onClick={() => setShowAll(true)}
              className="text-xs sm:text-sm font-bold text-primary hover:underline transition-colors"
            >
              আরও দেখুন ({transactions.length - 5} টি লুকানো)
            </button>
          </div>
        )}

        {/* ---------- Show Less Button ---------- */}
        {showAll && transactions.length > 5 && (
          <div className="p-3 sm:p-4 bg-primary/5 text-center border-t border-border/50">
            <button
              onClick={() => setShowAll(false)}
              className="text-xs sm:text-sm font-bold text-primary hover:underline transition-colors"
            >
              কম দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBilling;