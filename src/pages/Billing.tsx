import React from "react";
import { motion } from "framer-motion";
import { 
  Receipt, 
  Zap, 
  Droplets, 
  Utensils, 
  History, 
  CreditCard, 
  Calendar,
  AlertCircle,
  Download,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// টাইপ ডিফিনিশন
interface BillingSummary {
  rent: number;
  electricity: number;
  water: number;
  serviceCharge: number;
  mealCost: number;
  previousDue: number;
  paidAmount: number;
  deadline: string;
}

const UserBilling: React.FC = () => {
  const bill: BillingSummary = {
    rent: 3000,
    electricity: 450,
    water: 150,
    serviceCharge: 200,
    mealCost: 1850, // (41 meals * 45tk)
    previousDue: 500,
    paidAmount: 4000,
    deadline: "জানুয়ারি ২৫, ২০২৬",
  };

  const totalCurrentMonth = bill.rent + bill.electricity + bill.water + bill.serviceCharge + bill.mealCost;
  const grandTotal = totalCurrentMonth + bill.previousDue;
  const remainingDue = grandTotal - bill.paidAmount;

  return (
    <div className="space-y-8 py-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary" /> আমার বিল ও পেমেন্ট
          </h1>
          <p className="text-muted-foreground mt-1">জানুয়ারি ২০২৬ মাসের বিলিং বিবরণী</p>
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

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-border/50 bg-linear-to-b from-card to-background">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">মোট বিল (এই মাস + বকেয়া)</p>
          <p className="text-3xl font-black mt-2">৳ {grandTotal}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-accent font-bold">
            <Calendar className="w-4 h-4" /> শেষ সময়: {bill.deadline}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-border/50 bg-linear-to-b from-card to-background">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">পরিশোধিত</p>
          <p className="text-3xl font-black mt-2 text-green-500">৳ {bill.paidAmount}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-500 font-bold">
            <CheckCircle2 className="w-4 h-4" /> সর্বশেষ পেমেন্ট: জানু ১০
          </div>
        </div>

        <div className={`glass p-6 rounded-3xl border border-border/50 bg-linear-to-b from-card to-background ${remainingDue > 0 ? 'border-destructive/30' : ''}`}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">অবশিষ্ট বকেয়া</p>
          <p className={`text-3xl font-black mt-2 ${remainingDue > 0 ? 'text-destructive' : 'text-primary'}`}>৳ {remainingDue}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <AlertCircle className={`w-4 h-4 ${remainingDue > 0 ? 'text-destructive' : 'text-primary'}`} /> 
            {remainingDue > 0 ? "দ্রুত পেমেন্ট সম্পন্ন করুন" : "আপনার কোনো বকেয়া নেই"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bill Breakdown */}
        <div className="glass rounded-3xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-secondary/10">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-accent" /> খরচের বিস্তারিত ব্রেকডাউন
            </h3>
          </div>
          <div className="p-6 space-y-4 bg-linear-to-b from-card to-background/50">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">রুম ভাড়া (Rent)</span>
              </div>
              <span className="font-bold">৳ {bill.rent}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">বিদ্যুৎ বিল</span>
              </div>
              <span className="font-bold">৳ {bill.electricity}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-medium">পানি ও অন্যান্য</span>
              </div>
              <span className="font-bold">৳ {bill.water}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">মিল খরচ (Breakdown)</span>
                  <span className="text-[10px] text-muted-foreground font-bold">৪১টি মিল × ৪৫৳</span>
                </div>
              </div>
              <span className="font-bold text-primary">৳ {bill.mealCost}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">সার্ভিস চার্জ</span>
              </div>
              <span className="font-bold">৳ {bill.serviceCharge}</span>
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-between items-center px-2">
              <span className="font-bold text-muted-foreground">পূর্বের বকেয়া (Previous Due)</span>
              <span className="font-bold text-destructive underline decoration-dotted underline-offset-4">৳ {bill.previousDue}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="glass rounded-3xl border border-border/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-secondary/10">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-primary" /> পেমেন্ট হিস্ট্রি
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto bg-linear-to-b from-card to-background/50">
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
                {[
                  { date: "জানু ১০, ২০২৬", method: "bKash", tid: "TRX-98214", amount: 4000 },
                  { date: "ডিসে ১২, ২০২৫", method: "Nagad", tid: "TRX-77123", amount: 5200 },
                  { date: "নভে ০৫, ২০২৫", method: "Cash", tid: "N/A", amount: 4800 },
                ].map((history, i) => (
                  <tr key={i} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4 text-xs font-medium">{history.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-lg border border-border/50">
                        {history.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{history.tid}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-500">৳ {history.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-primary/5 text-center">
             <button className="text-xs font-bold text-primary hover:underline">পূর্ণাঙ্গ স্টেটমেন্ট দেখুন</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBilling;