import { useState } from "react";
import { axiosSecure } from "@/hooks/useAxiosSecure";

type PaymentMethod = "Online";

interface WalletData {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  isActive: boolean;
}

const AddMoneyWithBalance = () => {
  // Add money state
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Wallet state
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);

  // ================= ADD MONEY =================
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
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // ================= GET WALLET BALANCE =================
  const handleGetBalance = async () => {
    try {
      setWalletLoading(true);

      const res = await axiosSecure.get("/wallet/balance");

      if (res.data?.success) {
        setWallet(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load wallet balance", error);
      alert("Could not fetch wallet balance");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* ================= LEFT: ADD MONEY ================= */}
      <div className="p-6 bg-white rounded-xl shadow">
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

      {/* ================= RIGHT: WALLET BALANCE ================= */}
      <div className="p-6 bg-white rounded-xl shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>

          {!wallet && (
            <p className="text-gray-500 text-sm">
              Tap the button to see your wallet balance
            </p>
          )}

          {wallet && (
            <div className="space-y-2 mt-4">
              <p className="text-lg">
                💰 <span className="font-semibold">Balance:</span> ৳{wallet.balance}
              </p>
              <p className="text-sm text-gray-600">
                Total Deposited: ৳{wallet.totalDeposited}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleGetBalance}
          disabled={walletLoading}
          className="mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {walletLoading ? "Loading..." : "Tap to See Balance"}
        </button>
      </div>
    </div>
  );
};

export default AddMoneyWithBalance;
