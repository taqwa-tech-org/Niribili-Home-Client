import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  CreditCard,
  Building2,
  Bell,
  Clock,
  Shield,
  Smartphone,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "সহজ খাবার অর্ডার",
    description:
      "প্রতিদিনের সকাল, দুপুর ও রাতের খাবার সহজেই অর্ডার করুন। একাধিক পরিমাণও অর্ডার করতে পারবেন।",
    color: "primary",
  },
  {
    icon: Clock,
    title: "অগ্রিম অর্ডার",
    description:
      "পরবর্তী দিনের খাবার রাত ১০টার মধ্যে অর্ডার করুন। সময়মতো অর্ডার না করলে অর্ডার বন্ধ হয়ে যাবে।",
    color: "accent",
  },
  {
    icon: CreditCard,
    title: "সহজ পেমেন্ট",
    description:
      "বিকাশের মাধ্যমে সহজেই পেমেন্ট করুন। ভাড়া, খাবার, বিদ্যুৎ সব একসাথে দেখুন।",
    color: "primary",
  },
  {
    icon: Building2,
    title: "রুম ও ফ্ল্যাট ব্যবস্থাপনা",
    description:
      "বিল্ডিং, ফ্ল্যাট ও রুম অনুযায়ী সকল তথ্য সুন্দরভাবে সাজানো।",
    color: "accent",
  },
  {
    icon: Bell,
    title: "রিমাইন্ডার ও নোটিফিকেশন",
    description:
      "পেমেন্ট ডেডলাইন, খাবার অর্ডার কাটঅফ সময় সম্পর্কে অটো নোটিফিকেশন।",
    color: "primary",
  },
  {
    icon: FileText,
    title: "বিস্তারিত বিল",
    description:
      "ভাড়া, বিদ্যুৎ, পানি, খাবার, সার্ভিস চার্জ - সব আলাদাভাবে দেখুন।",
    color: "accent",
  },
  {
    icon: Shield,
    title: "নিরাপদ তথ্য",
    description:
      "আপনার সকল তথ্য ও ডকুমেন্ট নিরাপদে সংরক্ষিত থাকবে।",
    color: "primary",
  },
  {
    icon: Smartphone,
    title: "মোবাইল ফ্রেন্ডলি",
    description:
      "যেকোনো ডিভাইস থেকে সহজেই ব্যবহার করুন - মোবাইল, ট্যাবলেট বা কম্পিউটার।",
    color: "accent",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            সুবিধাসমূহ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            নিরিবিলি হোম এ
            <br />
            <span className="text-gradient">যা যা পাবেন</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            আপনার হোস্টেল জীবনকে আরও সহজ ও স্বাচ্ছন্দ্যময় করতে আমাদের সকল সুবিধা
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                    feature.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
