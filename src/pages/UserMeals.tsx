import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Utensils, 
  Clock, 
  AlertCircle, 
  Lock, 
  Plus, 
  Minus, 
  CheckCircle2, 
  PauseCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// টাইপ ডিফিনিশন
type MealType = "Breakfast" | "Lunch" | "Dinner";
type OrderStatus = "Pending" | "Confirmed" | "Paused";

interface MealOrder {
  id: string;
  date: string;
  type: MealType;
  quantity: number;
  status: OrderStatus;
}

const UserMeals: React.FC = () => {
  const [orders, setOrders] = useState<MealOrder[]>([
    { id: "1", date: "2026-01-18", type: "Breakfast", quantity: 1, status: "Confirmed" },
    { id: "2", date: "2026-01-18", type: "Lunch", quantity: 2, status: "Pending" },
    { id: "3", date: "2026-01-18", type: "Dinner", quantity: 1, status: "Paused" },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // কাট-অফ টাইম লজিক (10:00 PM)
  const isLocked = () => {
    const hours = currentTime.getHours();
    return hours >= 22; // 10 PM = 22:00
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    if (isLocked()) return;
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, quantity: Math.max(0, order.quantity + delta) } : order
    ));
  };

  return (
    <div className="space-y-8 py-5">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient flex items-center gap-3">
            <Utensils className="w-8 h-8 text-primary" /> মিল অর্ডার প্যানেল
          </h1>
          <p className="text-muted-foreground mt-1 tracking-wide">
            আগামীকালের মিল অর্ডার করার শেষ সময় রাত ১০:০০ টা।
          </p>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${
          isLocked() ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"
        }`}>
          {isLocked() ? <Lock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          <span className="font-black text-sm uppercase">
            {isLocked() ? "Orders Locked" : "Orders Open"}
          </span>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-secondary/30 border border-border rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">অ্যাডভান্স অর্ডার:</strong> অন্তত ১ দিন আগে অর্ডার করতে হবে।
          </p>
        </div>
        <div className="p-4 bg-secondary/30 border border-border rounded-2xl flex items-start gap-3">
          <PauseCircle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">পজ (Paused):</strong> বকেয়া বিলের কারণে মিল সাময়িকভাবে বন্ধ থাকতে পারে।
          </p>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">অটো-লক:</strong> কাট-অফ টাইমের পর অর্ডার এডিট করা যাবে না।
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="glass rounded-3xl border border-border/50 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border/50 bg-secondary/10 flex justify-between items-center">
          <h3 className="font-bold">আগামীকালের অর্ডার (১৮ জানুয়ারি, ২০২৬)</h3>
          <span className="text-xs font-medium text-muted-foreground">বর্তমান সময়: {currentTime.toLocaleTimeString()}</span>
        </div>

        <div className="divide-y divide-border/40 bg-linear-to-b from-card to-background/50">
          {orders.map((order) => (
            <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-primary/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${
                  order.type === 'Breakfast' ? 'bg-orange-500/10 text-orange-500' : 
                  order.type === 'Lunch' ? 'bg-primary/10 text-primary' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{order.type}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      order.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      order.status === 'Paused' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-accent/10 text-accent border-accent/20'
                    }`}>
                      {order.status === 'Paused' && <PauseCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded-xl border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-20"
                    disabled={isLocked() || order.quantity === 0 || order.status === 'Paused'}
                    onClick={() => updateQuantity(order.id, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-black min-w-[20px] text-center">{order.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-20"
                    disabled={isLocked() || order.status === 'Paused'}
                    onClick={() => updateQuantity(order.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="hidden md:block w-[1px] h-10 bg-border" />
                
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Cost</p>
                  <p className="text-lg font-black text-primary">৳ {order.quantity * 45}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-border hover:bg-secondary">
          অর্ডার রিসেট
        </Button>
        <Button 
          disabled={isLocked()} 
          className="h-12 px-8 rounded-xl font-bold bg-primary shadow-glow disabled:opacity-50"
        >
          {isLocked() ? "অর্ডার এখন বন্ধ" : "অর্ডার কনফার্ম করুন"}
        </Button>
      </div>
    </div>
  );
};

export default UserMeals;