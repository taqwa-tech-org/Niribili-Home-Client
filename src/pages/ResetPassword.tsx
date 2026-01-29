import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { axiosSecure } from "@/hooks/useAxiosSecure";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // token usually comes from email link
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "পাসওয়ার্ড প্রয়োজন",
        text: "অনুগ্রহ করে নতুন পাসওয়ার্ড লিখুন",
      });
      return;
    }

    try {
      setLoading(true);

      await axiosSecure.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      Swal.fire({
        icon: "success",
        title: "পাসওয়ার্ড পরিবর্তন সফল",
        text: "এখন আপনি নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারবেন",
      });

      navigate("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে";

      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border rounded-xl shadow-lg p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">নতুন পাসওয়ার্ড সেট করুন</h2>
          <p className="text-sm text-muted-foreground mt-2">
            আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে একটি শক্তিশালী নতুন পাসওয়ার্ড দিন
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-sm">নতুন পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg"
          >
            {loading ? "অপেক্ষা করুন..." : "পাসওয়ার্ড পরিবর্তন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
