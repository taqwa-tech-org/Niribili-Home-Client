import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Edit2, Check, X, Loader, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface UserProfile {
  fullName?: string;
  phone?: string;
  email?: string;
  profilePhoto?: string;
  whatsappNumber?: string;
  nid?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  emergencyContact?: string;
  building?: string;
  flat?: string;
  room?: string;
  bio?: string;
}

interface DecodedToken {
  name?: string;
  email?: string;
  phone?: string;
  userId?: string;
  id?: string;
  iat?: number;
  exp?: number;
}

// ✅ Function to decode JWT token from localStorage
const decodeTokenFromStorage = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem("real Token");

    if (!token) {
      console.log("No token found in localStorage");
      return null;
    }

    console.log("Token found:", token.substring(0, 20) + "...");

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

const UserProfileComponent: React.FC = () => {
  const [decodedUser, setDecodedUser] = useState<DecodedToken | null>(null);
  const [profile, setProfile] = useState<UserProfile>({});
  const [formData, setFormData] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const PROFILE_ID = "6969e2eca612c04bfede3540";

  // Initialize on mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const token = localStorage.getItem("real Token");

        if (!token) {
          toast.error("লগইন করুন প্রথমে");
          setLoading(false);
          return;
        }

        // Decode token
        const decoded = decodeTokenFromStorage();
        if (!decoded) {
          toast.error("টোকেন ডিকোড করতে ব্যর্থ");
          setLoading(false);
          return;
        }

        setDecodedUser(decoded);

        // Fetch existing profile data
        await fetchProfile(token);
      } catch (err) {
        console.error("Initialization error:", err);
        toast.error("প্রোফাইল লোড করতে ব্যর্থ");
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/profile/${PROFILE_ID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data;

      // Check if profile has editable data
      const hasData = Object.values(data).some(
        (val) => typeof val === "string" && val.length > 0 && val !== "N/A"
      );

      if (hasData) {
        setHasExistingData(true);
        setProfile(data);
        setFormData(data);
      } else {
        // New user - initialize with empty form
        setHasExistingData(false);
        setFormData({});
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      // New user - no existing data
      setHasExistingData(false);
      setFormData({});
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("real Token");

      if (!token) {
        toast.error("টোকেন পাওয়া যায়নি");
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("profilePhoto", file);

      const res = await axios.patch(
        `http://localhost:8080/api/v1/profile/${PROFILE_ID}`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({ ...formData, profilePhoto: res.data.data.profilePhoto });
      setProfile({ ...profile, profilePhoto: res.data.data.profilePhoto });
      toast.success("ছবি আপডেট হয়েছে ✅");
    } catch (err) {
      toast.error("ছবি আপলোড ব্যর্থ");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllData = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("real Token");

      if (!token) {
        toast.error("টোকেন পাওয়া যায়নি");
        return;
      }

      // Validate that at least some fields are filled
      const hasData = Object.values(formData).some(
        (val) => typeof val === "string" && val.length > 0
      );

      if (!hasData) {
        toast.error("কমপক্ষে একটি ফিল্ড পূরণ করুন");
        return;
      }

      const res = await axios.patch(
        `http://localhost:8080/api/v1/profile/${PROFILE_ID}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(res.data.data);
      setHasExistingData(true);
      setIsEditing(false);
      toast.success(hasExistingData ? "আপডেট হয়েছে ✅" : "ডেটা সংরক্ষণ হয়েছে ✅");
    } catch (err) {
      toast.error("ডেটা সংরক্ষণ ব্যর্থ");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  bg-secondary/50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-600 mt-2">
            {hasExistingData ? "আপনার তথ্য দেখুন এবং আপডেট করুন" : "আপনার তথ্য পূরণ করুন"}
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* Profile Photo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={
                  formData.profilePhoto ||
                  "https://via.placeholder.com/150?text=No+Photo"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-indigo-200 object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                <Upload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={saving}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">প্রোফাইল ছবি আপলোড করুন</p>
          </div>

          {/* Non-Editable Fields - From Token */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                সম্পূর্ণ নাম
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {decodedUser?.name || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                ফোন নম্বর
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {decodedUser?.phone || "N/A"}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                ইমেইল
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {decodedUser?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            {!isEditing && hasExistingData ? (
              // View Mode
              <>
                <ProfileDisplayField
                  label="হোয়াটসঅ্যাপ নম্বর"
                  value={formData.whatsappNumber}
                />
                <ProfileDisplayField
                  label="জাতীয় আইডি / জন্ম সার্টিফিকেট"
                  value={formData.nid}
                />
                <ProfileDisplayField
                  label="অভিভাবকের নাম"
                  value={formData.guardianName}
                />
                <ProfileDisplayField
                  label="অভিভাবকের ফোন"
                  value={formData.guardianPhone}
                />
                <ProfileDisplayField
                  label="অভিভাবকের সম্পর্ক"
                  value={formData.guardianRelation}
                />
                <ProfileDisplayField
                  label="জরুরি যোগাযোগ"
                  value={formData.emergencyContact}
                />
                <ProfileDisplayField
                  label="বিল্ডিং এর নাম"
                  value={formData.building}
                />
                <ProfileDisplayField label="ফ্ল্যাট" value={formData.flat} />
                <ProfileDisplayField label="রুম" value={formData.room} />
                <ProfileDisplayField label="সম্পর্কে" value={formData.bio} />
              </>
            ) : (
              // Edit Mode
              <>
                <ProfileEditField
                  label="হোয়াটসঅ্যাপ নম্বর"
                  field="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+880..."
                />
                <ProfileEditField
                  label="জাতীয় আইডি / জন্ম সার্টিফিকেট"
                  field="nid"
                  value={formData.nid}
                  onChange={handleInputChange}
                  placeholder="১৯৯৮"
                />
                <ProfileEditField
                  label="অভিভাবকের নাম"
                  field="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  placeholder="অভিভাবকের নাম"
                />
                <ProfileEditField
                  label="অভিভাবকের ফোন"
                  field="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  placeholder="+880..."
                />
                <ProfileEditField
                  label="অভিভাবকের সম্পর্ক"
                  field="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleInputChange}
                  placeholder="পিতা / মাতা"
                />
                <ProfileEditField
                  label="জরুরি যোগাযোগ"
                  field="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="+880..."
                />
                <ProfileEditField
                  label="বিল্ডিং এর নাম"
                  field="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  placeholder="গ্রিন ভিউ অ্যাপার্টমেন্ট"
                />
                <ProfileEditField
                  label="ফ্ল্যাট"
                  field="flat"
                  value={formData.flat}
                  onChange={handleInputChange}
                  placeholder="B-3"
                />
                <ProfileEditField
                  label="রুম"
                  field="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  placeholder="302"
                />
                <ProfileEditTextArea
                  label="সম্পর্কে"
                  field="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="আপনার সম্পর্কে লিখুন..."
                />
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 justify-end border-t pt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                >
                  <X className="inline mr-2" size={20} />
                  বাতিল করুন
                </button>
                <button
                  onClick={handleSaveAllData}
                  disabled={saving}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      সংরক্ষণ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      সংরক্ষণ করুন
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
              >
                <Edit2 size={20} />
                {hasExistingData ? "আপডেট করুন" : "তথ্য যোগ করুন"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Display Field Component (Read-only)
interface ProfileDisplayFieldProps {
  label: string;
  value?: string;
}

const ProfileDisplayField: React.FC<ProfileDisplayFieldProps> = ({
  label,
  value,
}) => {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg">
      <label className="text-sm font-semibold text-gray-700 block mb-2">
        {label}
      </label>
      <p className="text-gray-900">{value || "তথ্য নেই"}</p>
    </div>
  );
};

// Edit Field Component
interface ProfileEditFieldProps {
  label: string;
  field: string;
  value?: string;
  onChange: (field: string, value: string) => void;
  placeholder?: string;
}

const ProfileEditField: React.FC<ProfileEditFieldProps> = ({
  label,
  field,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
};

// Edit TextArea Component
interface ProfileEditTextAreaProps {
  label: string;
  field: string;
  value?: string;
  onChange: (field: string, value: string) => void;
  placeholder?: string;
}

const ProfileEditTextArea: React.FC<ProfileEditTextAreaProps> = ({
  label,
  field,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-2">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={4}
        placeholder={placeholder}
      />
    </div>
  );
};

export default UserProfileComponent;