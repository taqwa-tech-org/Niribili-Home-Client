import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MealCardProps {
  type: "breakfast" | "lunch" | "dinner";
  price: number;
  time: string;
  isOrdered?: boolean;
  delay?: number;
}

const mealConfig = {
  breakfast: {
    icon: Coffee,
    label: "সকালের নাস্তা",
    color: "bg-amber-500/10 text-amber-600",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  lunch: {
    icon: Sun,
    label: "দুপুরের খাবার",
    color: "bg-primary/10 text-primary",
    gradient: "from-primary/20 to-teal-light/20",
  },
  dinner: {
    icon: Moon,
    label: "রাতের খাবার",
    color: "bg-indigo-500/10 text-indigo-600",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
};

const MealCard = ({
  type,
  price,
  time,
  isOrdered = false,
  delay = 0,
}: MealCardProps) => {
  const [quantity, setQuantity] = useState(isOrdered ? 1 : 0);
  const [ordered, setOrdered] = useState(isOrdered);

  const config = mealConfig[type];
  const Icon = config.icon;

  const handleOrder = () => {
    if (quantity > 0) {
      setOrdered(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 ${
        ordered ? "ring-2 ring-primary/50" : ""
      }`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50`}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.color}`}>
            <Icon className="w-7 h-7" />
          </div>
          {ordered && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Check className="w-4 h-4" />
              অর্ডার হয়েছে
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-semibold mb-1">{config.label}</h3>
        <p className="text-sm text-muted-foreground mb-4">{time}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-2xl font-bold text-foreground">৳{price}</span>
          <span className="text-sm text-muted-foreground">/ জন</span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              disabled={ordered}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(quantity + 1)}
              disabled={ordered}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant={ordered ? "secondary" : "hero"}
            size="sm"
            className="flex-1"
            onClick={handleOrder}
            disabled={quantity === 0 || ordered}
          >
            {ordered ? "নিশ্চিত" : `অর্ডার (৳${price * quantity})`}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MealCard;
