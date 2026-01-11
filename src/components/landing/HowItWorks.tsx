import { motion } from "framer-motion";
import { Clock, CreditCard, AlertTriangle, Ban, Check } from "lucide-react";

const rules = [
  {
    icon: Clock,
    title: "অর্ডার সময়সীমা",
    description: "পরবর্তী দিনের খাবার অর্ডার করতে হবে আগের দিন রাত ১০:০০ টার মধ্যে।",
  },
  {
    icon: CreditCard,
    title: "পেমেন্ট ডেডলাইন",
    description: "প্রতি মাসের বিল পরবর্তী মাসের ১০ তারিখের মধ্যে পরিশোধ করতে হবে।",
  },
  {
    icon: AlertTriangle,
    title: "বাকি থাকলে",
    description: "ডেডলাইনের মধ্যে পেমেন্ট না করলে আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ হয়ে যাবে।",
  },
  {
    icon: Ban,
    title: "অর্ডার বন্ধ",
    description: "বাকি থাকা অবস্থায় নতুন খাবার অর্ডার করা যাবে না।",
  },
];

const HowItWorks = () => {
  return (
    <section id="rules" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            নিয়মাবলী
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            গুরুত্বপূর্ণ
            <br />
            <span className="text-gradient-gold">নিয়মাবলী</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            সুন্দর ও সুশৃঙ্খল হোস্টেল জীবনের জন্য অনুগ্রহ করে নিয়মগুলো মেনে চলুন
          </p>
        </motion.div>

        {/* Rules */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <rule.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {rule.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-3xl glass border border-primary/20">
            <h3 className="font-display text-2xl font-semibold text-center mb-6">
              মাসিক বিলে যা অন্তর্ভুক্ত
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                "রুম ভাড়া",
                "বিদ্যুৎ বিল",
                "পানির বিল",
                "খাবার খরচ",
                "সার্ভিস চার্জ",
                "আগের বাকি",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
