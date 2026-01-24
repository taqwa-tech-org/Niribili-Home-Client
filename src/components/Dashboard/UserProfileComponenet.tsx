import React, { useState , useContext} from "react";
import { motion } from "framer-motion";
import { Upload, Edit2, X, Loader, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import useAxiosSecure from "@/hooks/useAxiosSecure";


interface UserProfile {
  profilePhoto?: string;
  nidPhoto?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  emergencyContact?: string;
  buildingId?: string;
  flatId?: string;
  room?: string;
  whatsappNumber?: string;
  bio?: string;
}

interface LoaderData {
  data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    [key: string]: string | undefined;
  };
}

const buildingData: Record<string, { flats: string[]; rooms: string[] }> = {
  "Niribili-N2": {
    flats: ["A-1", "B-1", "A-3", "B-3", "A-4", "B-4", "A-5", "B-5", "A-6", "B-6"],
    rooms: ["Master Bed Room", "Semi master Bed Room", "Normal Bed Room", "Special Bed Room", "Extra Room 1", "Extra Room 2"],
  },
  "Niribili-N3": {
    flats: ["0-A", "0-B", "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B", "6-A", "6-B"],
    rooms: ["Master Bed Room", "Semi master Bed Room", "Normal Bed Room", "Special Bed Room", "Extra Room 1", "Extra Room 2"],
  },
  "Niribili-N6": {
    flats: ["3-A", "3-B", "4-A", "4-B", "5-A", "5-B", "6-A", "6-B", "7-A", "7-B"],
    rooms: ["Master Bed Room", "Semi master Bed Room", "Normal Bed Room", "Special Bed Room", "Extra Room 1", "Extra Room 2"],
  },
  "Niribili-N9": {
    flats: ["G-1", "G-2", "G-3", "B-1", "A-3", "B-3", "B-4", "T-1", "T-2"],
    rooms: ["Master Bed Room", "Semi master Bed Room", "Normal Bed Room", "Special Bed Room", "Extra Room 1", "Extra Room 2"],
  },
  "Niribili-N10": {
    flats: ["0-A", "0-B", "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "4-B", "5-A", "5-B", "6-A", "6-B"],
    rooms: ["Master Bed Room", "Semi master Bed Room", "Normal Bed Room", "Special Bed Room", "Extra Room 1", "Extra Room 2"],
  },
};

const UserProfileComponent: React.FC = () => {
  const user = useLoaderData() as LoaderData;
  // const user  = useContext(UserContext)
  const axiosSecure = useAxiosSecure();

  // console.log(user.data._id); // ✅ data is already available

  const [profile, setProfile] = useState<UserProfile>({});
  const [formData, setFormData] = useState<UserProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBuildingChange = (value: string) => {
    // Reset flat and room when building changes
    setFormData({ ...formData, buildingId: value, flatId: "", room: "" });
  };

  const handleFlatChange = (value: string) => {
    // Reset room when flat changes
    setFormData({ ...formData, flatId: value, room: "" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      // Your file upload logic here for profile photo
      toast.success("প্রোফাইল ছবি আপডেট হয়েছে ✅");
    } catch (err) {
      toast.error("ছবি আপলোড ব্যর্থ");
    } finally {
      setSaving(false);
    }
  };

  const handleNidPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      // Your file upload logic here for NID photo
      toast.success("NID/জন্ম সনদ ছবি আপডেট হয়েছে ✅");
    } catch (err) {
      toast.error("ছবি আপলোড ব্যর্থ");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllData = async () => {
    try {
      setSaving(true);
      console.log(formData)
      const hasData = Object.values(formData).some(
        (val) => typeof val === "string" && val.length > 0
      );

      if (!hasData) {
        toast.error("কমপক্ষে একটি ফিল্ড পূরণ করুন");
        return;
      }

      // Send PATCH request to update profile
      const response = await axiosSecure.patch(
        `/profile/${user.data._id}`,
        formData
      );

      if (response.data) {
        setProfile(formData);
        setIsEditing(false);
        toast.success("ডেটা সংরক্ষণ হয়েছে ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error("ডেটা সংরক্ষণ ব্যর্থ");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const availableFlats = formData.buildingId ? buildingData[formData.buildingId]?.flats || [] : [];
  const availableRooms = formData.buildingId ? buildingData[formData.buildingId]?.rooms || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br bg-secondary/50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-600 mt-2">আপনার তথ্য দেখুন এবং আপডেট করুন</p>
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

          {/* NID Photo Upload Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  জাতীয় পরিচয়পত্র / জন্ম সনদ আপলোড করুন
                </h3>
                <p className="text-sm text-gray-600">
                  {formData.nidPhoto ? "ছবি আপলোড হয়েছে ✅" : "ছবি নির্বাচন করুন"}
                </p>
              </div>
              <label className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition font-semibold flex items-center gap-2">
                <Upload size={20} />
                আপলোড করুন
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNidPhotoUpload}
                  className="hidden"
                  disabled={saving}
                />
              </label>
            </div>
            {formData.nidPhoto && (
              <div className="mt-4">
                <img
                  src={formData.nidPhoto}
                  alt="NID"
                  className="w-full max-w-md h-auto rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            {!isEditing ? (
              // View Mode
              <>
                <ProfileDisplayField
                  label="সম্পূর্ণ নাম"
                  value={user.data.name}
                />
                <ProfileDisplayField label="ফোন নম্বর" value={user.data.phone} />
                <ProfileDisplayField label="ইমেইল" value={user.data.email} />
                <ProfileDisplayField
                  label="হোয়াটসঅ্যাপ নম্বর"
                  value={profile.whatsappNumber}
                />
                <ProfileDisplayField
                  label="অভিভাবকের নাম"
                  value={profile.guardianName}
                />
                <ProfileDisplayField
                  label="অভিভাবকের ফোন"
                  value={profile.guardianPhone}
                />
                <ProfileDisplayField
                  label="অভিভাবকের সম্পর্ক"
                  value={profile.guardianRelation}
                />
                <ProfileDisplayField
                  label="জরুরি যোগাযোগ"
                  value={profile.emergencyContact}
                />
                <ProfileDisplayField
                  label="বিল্ডিং এর নাম"
                  value={profile.buildingId}
                />
                <ProfileDisplayField label="ফ্ল্যাট" value={profile.flatId} />
                <ProfileDisplayField label="রুম" value={profile.room} />
                <ProfileDisplayField label="নিজের সম্পর্কে বলুন" value={profile.bio} />
              </>
            ) : (
              // Edit Mode
              <>
                <ProfileDisplayField
                  label="সম্পূর্ণ নাম"
                  value={user.data.name}
                />
                <ProfileDisplayField label="ফোন নম্বর" value={user.data.phone} />
                <ProfileDisplayField label="ইমেইল" value={user.data.email} />
                <ProfileEditField
                  label="হোয়াটসঅ্যাপ নম্বর"
                  field="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+880..."
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

                {/* Building Dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    বিল্ডিং এর নাম
                  </label>
                  <select
                    value={formData.buildingId || ""}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">বিল্ডিং নির্বাচন করুন</option>
                    {Object.keys(buildingData).map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flat Dropdown - Dependent on Building */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    ফ্ল্যাট
                  </label>
                  <select
                    value={formData.flatId || ""}
                    onChange={(e) => handleFlatChange(e.target.value)}
                    disabled={!formData.buildingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.buildingId ? "ফ্ল্যাট নির্বাচন করুন" : "প্রথমে বিল্ডিং নির্বাচন করুন"}
                    </option>
                    {availableFlats.map((flat) => (
                      <option key={flat} value={flat}>
                        {flat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Dropdown - Dependent on Building */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    রুম
                  </label>
                  <select
                    value={formData.room || ""}
                    onChange={(e) => handleInputChange("room", e.target.value)}
                    disabled={!formData.buildingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.buildingId ? "রুম নির্বাচন করুন" : "প্রথমে বিল্ডিং নির্বাচন করুন"}
                    </option>
                    {availableRooms.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>

                <ProfileEditTextArea
                  label="নিজের সম্পর্কে বলুন"
                  field="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="নিজের সম্পর্কে কিছু লিখুন..."
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
                onClick={handleEdit}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
              >
                <Edit2 size={20} />
                আপডেট করুন
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