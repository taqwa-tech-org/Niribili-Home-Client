import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface BillCardProps {
  label: string;
  amount: number;
  dueDate?: string;
  status?: "paid" | "pending" | "overdue";
  delay?: number;
}

const BillCard = ({
  label,
  amount,
  dueDate,
  status = "pending",
  delay = 0,
}: BillCardProps) => {
  const statusConfig = {
    paid: {
      bg: "bg-green-500/10",
      text: "text-green-600",
      label: "পরিশোধিত",
    },
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      label: "বাকি",
    },
    overdue: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      label: "মেয়াদোত্তীর্ণ",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{label}</h4>
        {dueDate && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>সময়সীমা: {dueDate}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-lg font-bold">৳{amount.toLocaleString("bn-BD")}</span>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};

export default BillCard;
