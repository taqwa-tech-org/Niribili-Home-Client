import React, { useEffect, useState } from "react";
import { axiosSecure } from "@/hooks/useAxiosSecure";

import { motion } from "framer-motion";
import {
  Receipt,
  History,
  CreditCard,
  Calendar,
  AlertCircle,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletSummary from "./WalletSummary";

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
    paidAmount: 4000
   
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
    <div className="space-y-8 py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary" /> আমার বিল ও পেমেন্ট
          </h1>
          <p className="text-muted-foreground mt-1">
            জানুয়ারি ২০২৬ মাসের বিলিং বিবরণী
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-border">
            <Download className="w-4 h-4" /> ডাউনলোড ইনভয়েস
          </Button>
          <Button className="bg-primary shadow-glow gap-2">
            <CreditCard className="w-4 h-4" /> পেমেন্ট করুন
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      
      <WalletSummary/>

      {/* Payment History */}
      <div className="glass rounded-3xl border border-border/50 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border/50 bg-secondary/10">
          <h3 className="font-bold flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-primary" /> পেমেন্ট হিস্ট্রি
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground text-[10px] font-black uppercase">
              <tr>
                <th className="px-6 py-4">তারিখ</th>
                <th className="px-6 py-4">মেথড</th>
                <th className="px-6 py-4">ট্রানজেকশন ID</th>
                <th className="px-6 py-4 text-right">পরিমাণ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-xs">
                    লোড হচ্ছে...
                  </td>
                </tr>
              )}

              {!loading &&
                visibleTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-medium">
                      {new Date(tx.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-lg border border-border/50">
                        sslcommerz
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {tx.transactionId}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-green-500">
                      ৳ {tx.amount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!showAll && transactions.length > 5 && (
          <div className="p-4 bg-primary/5 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-bold text-primary hover:underline"
            >
              আরও দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBilling;
