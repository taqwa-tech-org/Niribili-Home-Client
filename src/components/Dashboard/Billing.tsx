import BillCard from "@/components/Dashboard/BillCard";

export default function Billing() {
  const bills = [
    {
      label: "মাসিক খাবারের বিল",
      amount: 5000,
      dueDate: "২০২৬-০১-৩০",
      status: "pending" as const,
    },
    {
      label: "বোর্ডিং চার্জ",
      amount: 8000,
      dueDate: "২০২৬-০১-২৫",
      status: "pending" as const,
    },
    {
      label: "ইউটিলিটি বিল",
      amount: 1500,
      dueDate: "২০২৬-০১-২০",
      status: "overdue" as const,
    },
    {
      label: "ওয়াইফাই চার্জ",
      amount: 800,
      dueDate: "২০২৬-০১-১৫",
      status: "paid" as const,
    },
  ];

  return (
    <div className="space-y-3 p-6">
      <h2 className="text-2xl font-bold mb-6">বিল এবং পেমেন্ট</h2>
      {bills.map((bill, index) => (
        <BillCard
          key={index}
          label={bill.label}
          amount={bill.amount}
          dueDate={bill.dueDate}
          status={bill.status}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}