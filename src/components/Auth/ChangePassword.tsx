// src/pages/auth/ChangePassword.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { axiosSecure } from "@/hooks/useAxiosSecure";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!oldPassword || !newPassword) {
      Swal.fire({
        icon: "error",
        title: "ভুল!",
        text: "সব ফিল্ড পূরণ করুন",
      });
      return;
    }

    if (newPassword.length < 5) {
      Swal.fire({
        icon: "error",
        title: "পাসওয়ার্ড দুর্বল",
        text: "নতুন পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে",
      });
      return;
    }

    setLoading(true);

    try {
      await axiosSecure.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
        confirmButtonText: "ঠিক আছে",
      });

      setOldPassword("");
      setNewPassword("");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি";

      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          পাসওয়ার্ড পরিবর্তন
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          আপনার নতুন পাসওয়ার্ড সেট করুন
        </p>

        <form className="space-y-4" onSubmit={handleChangePassword}>
          {/* Old Password */}
          <div>
            <label className="text-sm">পুরাতন পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm">নতুন পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
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

export default ChangePassword;
