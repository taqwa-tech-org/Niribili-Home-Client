import React, { useEffect, useState } from "react";
import { Upload, Edit2, X, Loader, Save } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useUser } from "@/Context/UserProvider";
import FullScreenLoading from "../ui/FullScreenLoading";

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
  accountStatus?: string;
}

const buildingData: Record<string, { flats: string[]; rooms: string[] }> = { "Niribili-N2": { flats: ["A-1","B-1","A-3","B-3","A-4","B-4","A-5","B-5","A-6","B-6"], rooms: ["Master Bed Room","Semi master Bed Room","Normal Bed Room","Special Bed Room","Extra Room 1","Extra Room 2"] }, "Niribili-N3": { flats: ["0-A","0-B","1-A","1-B","2-A","2-B","3-A","3-B","4-A","4-B","5-A","5-B","6-A","6-B"], rooms: ["Master Bed Room","Semi master Bed Room","Normal Bed Room","Special Bed Room","Extra Room 1","Extra Room 2"] }, "Niribili-N6": { flats: ["3-A","3-B","4-A","4-B","5-A","5-B","6-A","6-B","7-A","7-B"], rooms: ["Master Bed Room","Semi master Bed Room","Normal Bed Room","Special Bed Room","Extra Room 1","Extra Room 2"] }, "Niribili-N9": { flats: ["G-1","G-2","G-3","B-1","A-3","B-3","B-4","T-1","T-2"], rooms: ["Master Bed Room","Semi master Bed Room","Normal Bed Room","Special Bed Room","Extra Room 1","Extra Room 2"] }, "Niribili-N10": { flats: ["0-A","0-B","1-A","1-B","2-A","2-B","3-A","3-B","4-A","4-B","5-A","5-B","6-A","6-B"], rooms: ["Master Bed Room","Semi master Bed Room","Normal Bed Room","Special Bed Room","Extra Room 1","Extra Room 2"] }, };

const UserProfileComponent: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { userProfile, userLoading, profileLoading, error } = useUser();

  const [profile, setProfile] = useState<UserProfile>({});
  const [formData, setFormData] = useState<UserProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= backend → state ================= */
  useEffect(() => {
    if (userProfile) {
      const normalized: UserProfile = {
        profilePhoto: userProfile.profilePhoto,
        nidPhoto: userProfile.nidPhoto,
        guardianName: userProfile.guardianName,
        guardianPhone: userProfile.guardianPhone,
        guardianRelation: userProfile.guardianRelation,
        emergencyContact: userProfile.emergencyContact,
        whatsappNumber: userProfile.whatsappNumber,
        bio: userProfile.bio,
        room: userProfile.room,
        buildingId:
          typeof userProfile.buildingId === "object"
            ? userProfile.buildingId?.name
            : userProfile.buildingId,
        flatId:
          typeof userProfile.flatId === "object"
            ? userProfile.flatId?.name
            : userProfile.flatId,
        accountStatus: userProfile.accountStatus || "process",
      };

      setProfile(normalized);
      setFormData(normalized);
    }
  }, [userProfile]);

  if (userLoading || profileLoading) return <FullScreenLoading />;
  if (error) return <p>{error}</p>;
  if (!userProfile) return <p>Profile not available</p>;

  /* ================= handlers ================= */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBuildingChange = (value: string) => {
    setFormData(prev => ({ ...prev, buildingId: value, flatId: "", room: "" }));
  };

  const handleFlatChange = (value: string) => {
    setFormData(prev => ({ ...prev, flatId: value, room: "" }));
  };

  /* ================= image upload ================= */
  const uploadImage = async (file: File, preset: string, cloud: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);
    data.append("cloud_name", cloud);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
      { method: "POST", body: data }
    );
    return res.json();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setSaving(true);
    try {
      const img = await uploadImage(e.target.files[0], "Niribili", "djw8kaemj");
      setFormData(prev => ({ ...prev, profilePhoto: img.url }));
      toast.success("প্রোফাইল ছবি আপডেট হয়েছে ✅");
    } finally {
      setSaving(false);
    }
  };

  const handleNidPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setSaving(true);
    try {
      const img = await uploadImage(e.target.files[0], "Niribili Nid", "dydqqj7mu");
      setFormData(prev => ({ ...prev, nidPhoto: img.url }));
      toast.success("NID ছবি আপডেট হয়েছে ✅");
    } finally {
      setSaving(false);
    }
  };

  /* ================= save ================= */
  const handleSaveAllData = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        accountStatus: "process", // ✅ hardcoded
      };

      const res = await axiosSecure.patch(
        `/profile/${userProfile._id}`,
        payload
      );

      if (res.data) {
        setProfile(payload);
        setIsEditing(false);
        toast.success("ডেটা সংরক্ষণ হয়েছে ✅");
      }
    } catch {
      toast.error("ডেটা সংরক্ষণ ব্যর্থ ❌");
    } finally {
      setSaving(false);
    }
  };

  const availableFlats =
    formData.buildingId && buildingData[formData.buildingId]
      ? buildingData[formData.buildingId].flats
      : [];

  const availableRooms =
    formData.buildingId && buildingData[formData.buildingId]
      ? buildingData[formData.buildingId].rooms
      : [];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-secondary/50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* profile photo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src={formData.profilePhoto || "/default-avatar.png"}
              className="w-32 h-32 rounded-full object-cover border"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer text-white">
              <Upload size={16} />
              <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        {/* nid */}
        <div className="mb-6">
          <label className="font-semibold block mb-2">NID / Birth Certificate</label>
          <input type="file" accept="image/*" onChange={handleNidPhotoUpload} />
          {formData.nidPhoto && (
            <img src={formData.nidPhoto} className="mt-3 max-w-sm rounded" />
          )}
        </div>

        {/* fields */}
        <div className="space-y-4">
          {isEditing ? (
            <>
              <ProfileEditField label="WhatsApp" field="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} />
              <ProfileEditField label="Guardian Name" field="guardianName" value={formData.guardianName} onChange={handleInputChange} />
              <ProfileEditField label="Guardian Phone" field="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} />
              <ProfileEditField label="Relation" field="guardianRelation" value={formData.guardianRelation} onChange={handleInputChange} />
              <ProfileEditField label="Emergency Contact" field="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} />

              <select className="border w-full p-2 rounded" value={formData.buildingId || ""} onChange={e => handleBuildingChange(e.target.value)}>
                <option value="">Select Building</option>
                {Object.keys(buildingData).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select className="border w-full p-2 rounded" value={formData.flatId || ""} onChange={e => handleFlatChange(e.target.value)}>
                <option value="">Select Flat</option>
                {availableFlats.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select className="border w-full p-2 rounded" value={formData.room || ""} onChange={e => handleInputChange("room", e.target.value)}>
                <option value="">Select Room</option>
                {availableRooms.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <ProfileEditTextArea label="Bio" field="bio" value={formData.bio} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <ProfileDisplayField label="WhatsApp" value={profile.whatsappNumber} />
              <ProfileDisplayField label="Guardian Name" value={profile.guardianName} />
              <ProfileDisplayField label="Guardian Phone" value={profile.guardianPhone} />
              <ProfileDisplayField label="Relation" value={profile.guardianRelation} />
              <ProfileDisplayField label="Emergency Contact" value={profile.emergencyContact} />
              <ProfileDisplayField label="Building" value={profile.buildingId} />
              <ProfileDisplayField label="Flat" value={profile.flatId} />
              <ProfileDisplayField label="Room" value={profile.room} />
              <ProfileDisplayField label="Bio" value={profile.bio} />
            </>
          )}
        </div>

        {/* actions */}
        <div className="flex justify-end gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => { setFormData(profile); setIsEditing(false); }}
                className="border px-4 py-2 rounded flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSaveAllData}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                {saving ? <Loader className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= helpers ================= */
const ProfileDisplayField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

const ProfileEditField = ({ label, field, value, onChange }: any) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      value={value || ""}
      onChange={e => onChange(field, e.target.value)}
      className="border w-full px-3 py-2 rounded"
    />
  </div>
);

const ProfileEditTextArea = ({ label, field, value, onChange }: any) => (
  <div>
    <label className="text-sm">{label}</label>
    <textarea
      value={value || ""}
      onChange={e => onChange(field, e.target.value)}
      rows={3}
      className="border w-full px-3 py-2 rounded"
    />
  </div>
);

export default UserProfileComponent;
