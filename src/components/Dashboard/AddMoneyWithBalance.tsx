import { useState } from "react";
import { axiosSecure } from "@/hooks/useAxiosSecure";
import { Wallet, PlusCircle, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

type PaymentMethod = "Online";

interface WalletData {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  isActive: boolean;
}

const AddMoneyWithBalance = () => {
  // টাকা যোগ করার state
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // ওয়ালেট state
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);

  // ================= টাকা যোগ করা =================
  const handleAddMoney = async () => {
    if (amount <= 0) {
      alert("অনুগ্রহ করে সঠিক পরিমাণ লিখুন");
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
    } catch (error: any) {
  console.log(error);

  const errorMessage =
    error?.response?.data?.errorSources?.[0]?.message ||
    error?.response?.data?.message ||
    "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন";

  Swal.fire({
    icon: "error",
    title: "পেমেন্ট ব্যর্থ",
    text: errorMessage,
    confirmButtonText: "ঠিক আছে",
  });

  return false;
}
 finally {
      setLoading(false);
    }
  };

  // ================= ওয়ালেট ব্যালেন্স দেখা =================
  const handleGetBalance = async () => {
    try {
      setWalletLoading(true);

      const res = await axiosSecure.get("/wallet/balance");

      if (res.data?.success) {
        setWallet(res.data.data);
      }
    } catch (error) {
      console.error("ওয়ালেট ব্যালেন্স লোড করা যায়নি", error);
      alert("ওয়ালেট ব্যালেন্স পাওয়া যায়নি");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:py-10 bg-gray-50">
      {/* ================= হেডার ================= */}
      <div className="max-w-4xl mx-auto mb-8">
        <div
          className="rounded-2xl p-5 md:p-6 text-white shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, hsl(168 70% 45%) 0%, hsl(168 60% 55%) 100%)",
          }}
        >
          <h1 className="text-xl md:text-3xl font-bold">
            আপনার  ওয়ালেট
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-90">
            ওয়ালেটে টাকা যোগ করুন এবং সহজে হোস্টেল থেকে খাবার অর্ডার করুন
          </p>
        </div>
      </div>

      {/* ================= মূল কন্টেন্ট ================= */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        

        {/* ================= ওয়ালেট ব্যালেন্স ================= */}
        <div className="p-5 md:p-6 bg-white rounded-2xl shadow-sm border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="text-blue-600" />
              <h2 className="text-lg font-semibold">আমার ওয়ালেট</h2>
            </div>

            {!wallet && (
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                অর্ডার করার আগে আপনার বর্তমান ওয়ালেট ব্যালেন্স দেখুন।
              </div>
            )}

            {wallet && (
              <div className="mt-4 space-y-3">
                <div
                  className="p-4 rounded-xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(168 70% 45%) 0%, hsl(168 60% 55%) 100%)",
                  }}
                >
                  <p className="text-sm opacity-90">বর্তমান ব্যালেন্স</p>
                  <p className="text-2xl font-bold">
                    ৳{wallet.balance}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>মোট যোগ করা টাকা: ৳{wallet.totalDeposited}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGetBalance}
            disabled={walletLoading}
            className="mt-6 w-full py-2.5 rounded-lg font-medium text-white transition disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, hsl(168 70% 45%) 0%, hsl(168 60% 55%) 100%)",
            }}
          >
            {walletLoading ? "লোড হচ্ছে..." : "ওয়ালেট ব্যালেন্স দেখুন"}
          </button>
        </div>
        {/* ================= টাকা যোগ করুন ================= */}
        <div className="p-5 md:p-6 bg-white rounded-2xl shadow-sm border">
          <div className="flex items-center gap-2 mb-3">
            <PlusCircle className="text-green-600" />
            <h2 className="text-lg font-semibold">টাকা যোগ করুন</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            খাবার অর্ডার করার জন্য আপনার ওয়ালেটে টাকা যোগ করুন।
          </p>

          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ৳
            </span>
            <input
              type="number"
              min={1}
              placeholder="টাকার পরিমাণ লিখুন"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded-lg pl-8 pr-3 py-2 text-sm md:text-base
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleAddMoney}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, hsl(168 70% 45%) 0%, hsl(168 60% 55%) 100%)",
            }}
          >
            <CreditCard size={18} />
            {loading ? "পেমেন্ট পেজে নেওয়া হচ্ছে..." : "নিরাপদে টাকা যোগ করুন"}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            🔒 নিরাপদ অনলাইন পেমেন্ট
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyWithBalance;
