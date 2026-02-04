// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { axiosSecure } from "@/hooks/useAxiosSecure";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

console.log("login page", BACKEND_URL);


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔐 Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password }
      );

      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("লগইন সফল হয়েছে 🎉");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "লগইন করতে সমস্যা হয়েছে";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Forget Password
  const handleForgetPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "ইমেইল প্রয়োজন",
        text: "অনুগ্রহ করে আপনার ইমেইল লিখুন",
      });
      return;
    }

    try {
      await axiosSecure.post("/auth/forget-password", { email });

      Swal.fire({
        icon: "success",
        title: "ইমেইল পাঠানো হয়েছে",
        text: "পাসওয়ার্ড রিসেট করার নির্দেশনা আপনার ইমেইলে পাঠানো হয়েছে",
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে";

      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে",
        text: message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold text-center mb-2">স্বাগতম</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* 👉 Register + Forget Password */}
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-primary hover:underline"
            >
              নতুন অ্যাকাউন্ট খুলুন
            </button>

            <button
              type="button"
              onClick={handleForgetPassword}
              className="text-primary hover:underline"
            >
              পাসওয়ার্ড ভুলে গিয়েছেন ?
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg"
          >
            {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
