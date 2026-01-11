import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color?: "primary" | "accent" | "destructive" | "muted";
  delay?: number;
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color = "primary",
  delay = 0,
}: StatsCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="w-4 h-4" />
            ) : changeType === "negative" ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-display font-bold">{value}</p>
    </motion.div>
  );
};

export default StatsCard;
