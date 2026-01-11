import { motion } from "framer-motion";
import { Building2, Home as HomeIcon, Bed, User, Phone, Mail } from "lucide-react";

interface ResidentInfoCardProps {
  name: string;
  email: string;
  phone: string;
  building: string;
  flat: string;
  room: string;
  status: "active" | "restricted";
}

const ResidentInfoCard = ({
  name,
  email,
  phone,
  building,
  flat,
  room,
  status,
}: ResidentInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-hero p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border-2 border-primary-foreground/30">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-primary-foreground">
            {name}
          </h3>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              status === "active"
                ? "bg-green-500/20 text-green-100"
                : "bg-red-500/20 text-red-100"
            }`}
          >
            {status === "active" ? "সক্রিয়" : "বন্ধ"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">{phone}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            থাকার তথ্য
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-secondary">
              <Building2 className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">বিল্ডিং</p>
              <p className="font-semibold text-sm">{building}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary">
              <HomeIcon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">ফ্ল্যাট</p>
              <p className="font-semibold text-sm">{flat}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary">
              <Bed className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">রুম</p>
              <p className="font-semibold text-sm">{room}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResidentInfoCard;
