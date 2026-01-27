import { useState } from "react";
import { axiosSecure } from "@/hooks/useAxiosSecure";

type PaymentMethod = "Online";

const AddMoney = () => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddMoney = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amount,
        method: "Online" as PaymentMethod,
      };

      const res = await axiosSecure.post("/ssl/add-money", payload);

      if (res.data?.success) {
        window.location.href = res.data.data.paymentUrl;
      }
    } catch (error) {
      console.error(error);
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Money</h2>

      <input
        type="number"
        min={1}
        placeholder="Enter amount"
        value={amount === 0 ? "" : amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleAddMoney}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Add Money"}
      </button>
    </div>
  );
};

export default AddMoney;
