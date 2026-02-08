import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import useAxiosSecure, { axiosSecure } from "@/hooks/useAxiosSecure";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 password validation
    if (password.length < 5) {
      Swal.fire({
        icon: "error",
        title: "দুর্বল পাসওয়ার্ড",
        text: "কমপক্ষে ৫ অক্ষরের একটি শক্ত পাসওয়ার্ড ব্যবহার করুন",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosSecure.post(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        {
          name,
          phone,
          email,
          password,
        }
      );

      Swal.fire({
        icon: "success",
        title: "রেজিস্ট্রেশন সফল 🎉",
        text: "রেজিস্ট্রেশন সফল হয়েছে, অনুগ্রহ করে লগইন করুন",
        confirmButtonText: "লগইন পেজে যান",
      });

      navigate("/login");
    } catch (err: any) {
      let errorMessage = "রেজিস্ট্রেশন করা যায়নি";

      // ✅ Backend validation error handle
      if (err.response?.data?.errorSources) {
        errorMessage = err.response.data.errorSources
          .map((error: any) => `• ${error.message}`)
          .join("\n");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "ভুল তথ্য দেওয়া হয়েছে ❌",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          অ্যাকাউন্ট তৈরি করুন
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          নতুন অ্যাকাউন্ট খুলুন
        </p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="text-sm">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm">ফোন নাম্বার</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 🔗 Login link (right aligned) */}
          <div className="flex justify-end">
            <Link
              to="/login"
              className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-70"
          >
            {loading ? "অপেক্ষা করুন..." : "রেজিস্ট্রেশন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
