import { useEffect, useState } from "react";
import { useUser } from "@/Context/UserProvider";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  User,
  Phone,
  MessageCircle,
  Home,
  Building2,
  Users,
  AlertCircle,
  Camera,
  Upload,
  Loader2,
  Lock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";


const roomsData = [
  "Master Bed Room",
  "Normal Room",
  "Extra Room 1",
  "Extra Room 2",
  "Special Room",
  "VIP Room",
  "Extra Room",
  "Sami Master Bed Room"
]

const UserProfileComponent = () => {
  const axiosSecure = useAxiosSecure();
  const { userProfile, refetchUserProfile } = useUser();

  const [buildings, setBuildings] = useState([]);
  const [flats, setFlats] = useState([]);
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  const [previewNid, setPreviewNid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Check if account is in "process" or "approve" status - if so, disable all fields
  const isAccountInProcess = userProfile?.accountStatus === "process";
  const isAccountApproved = userProfile?.accountStatus === "approve";
  const isFieldsDisabled = isAccountInProcess || isAccountApproved;

  const [formData, setFormData] = useState({
    phone: "",
    whatsappNumber: "",
    bio: "",
    buildingId: "",
    flatId: "",
    room: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
    emergencyContact: "",
    profilePhoto: null as File | null,
    nidPhoto: null as File | null,
  });

  // ✅ Load initial user data
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        phone: userProfile?.userId?.phone || "",
        whatsappNumber: userProfile?.whatsappNumber || "",
        bio: userProfile?.bio || "",
        buildingId:
          typeof userProfile?.buildingId === "object"
            ? userProfile?.buildingId?._id
            : userProfile?.buildingId || "",
        flatId:
          typeof userProfile?.flatId === "object"
            ? userProfile?.flatId?._id
            : userProfile?.flatId || "",
        room: userProfile?.room || "",
        guardianName: userProfile?.guardianName || "",
        guardianPhone: userProfile?.guardianPhone || "",
        guardianRelation: userProfile?.guardianRelation || "",
        emergencyContact: userProfile?.emergencyContact || "",
      }));

      // Set existing images if available
      if (userProfile?.profilePhoto)
        setPreviewProfile(userProfile.profilePhoto);
      if (userProfile?.nidPhoto) setPreviewNid(userProfile.nidPhoto);
    }
  }, [userProfile]);

  // ✅ Fetch buildings
  useEffect(() => {
    axiosSecure.get("/buildings").then((res) => {
      setBuildings(res.data.data || []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.buildingId) {
      axiosSecure
        .get(`/flats?buildingId=${formData.buildingId}`)
        .then((res) => {
          setFlats(res.data.data || []);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.buildingId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (isFieldsDisabled) return;

    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "profilePhoto") setPreviewProfile(reader.result as string);
        if (name === "nidPhoto") setPreviewNid(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", "Niribili_Image_info");
    cloudinaryFormData.append("cloud_name", "dehak09z6");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dehak09z6/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      );

      if (!response.ok) {
        return null;
      }

      const imgData = await response.json();
      return imgData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Check each field and add specific error messages
    if (!formData.whatsappNumber.trim()) {
      newErrors.push("WhatsApp নম্বর দিন");
    }
    
    if (!formData.bio.trim()) {
      newErrors.push("About Me লিখুন");
    }
    
    if (!formData.buildingId) {
      newErrors.push("Building সিলেক্ট করুন");
    }
    
    if (!formData.flatId) {
      newErrors.push("Flat সিলেক্ট করুন");
    }
    
    if (!formData.room.trim()) {
      newErrors.push("Room Number দিন");
    }
    
    if (!formData.guardianName.trim()) {
      newErrors.push("Guardian Name দিন");
    }
    
    if (!formData.guardianPhone.trim()) {
      newErrors.push("Guardian Phone দিন");
    }
    
    if (!formData.guardianRelation.trim()) {
      newErrors.push("Guardian এর সাথে সম্পর্ক উল্লেখ করুন");
    }
    
    if (!formData.emergencyContact.trim()) {
      newErrors.push("Emergency Contact দিন");
    }
    
    if (!formData.profilePhoto && !previewProfile) {
      newErrors.push("Profile Photo আপলোড করুন");
    }
    
    if (!formData.nidPhoto && !previewNid) {
      newErrors.push("NID Photo আপলোড করুন");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading and submitting...");

    try {
      let profilePhotoUrl = userProfile?.profilePhoto || "";
      let nidPhotoUrl = userProfile?.nidPhoto || "";

      // Upload profile photo if new one is selected
      if (formData.profilePhoto) {
        const uploadedUrl = await uploadToCloudinary(formData.profilePhoto);
        if (!uploadedUrl) {
          toast.error("Profile photo upload failed", { id: toastId });
          setIsSubmitting(false);
          return;
        }
        profilePhotoUrl = uploadedUrl;
      }

      // Upload NID photo if new one is selected
      if (formData.nidPhoto) {
        const uploadedUrl = await uploadToCloudinary(formData.nidPhoto);
        if (!uploadedUrl) {
          toast.error("NID photo upload failed", { id: toastId });
          setIsSubmitting(false);
          return;
        }
        nidPhotoUrl = uploadedUrl;
      }

      // Prepare payload
      const payload = {
        whatsappNumber: formData.whatsappNumber,
        bio: formData.bio,
        buildingId: formData.buildingId,
        flatId: formData.flatId,
        room: formData.room,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        guardianRelation: formData.guardianRelation,
        emergencyContact: formData.emergencyContact,
        profilePhoto: profilePhotoUrl,
        nidPhoto: nidPhotoUrl,
        accountStatus: "process",
      };

      const res = await axiosSecure.patch(
        `/profile/${userProfile?._id}`,
        payload,
      );

      if (res?.data?.success) {
        // Refresh profile so UI reflects updated data without manual reload
        await refetchUserProfile();
        toast.success(res.data.message || "Profile updated successfully!", {
          id: toastId,
        });
        setErrors([]); // Clear any errors on success
      } else {
        toast.error("Failed to update profile", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Keep your information up to date</p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-3">
                  ⚠️ নিচের ফিল্ডগুলো সঠিকভাবে পূরণ করুন:
                </h3>
                <ul className="space-y-2">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-700 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Account Status Banner */}
        {isAccountApproved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Account Approved</h3>
              <p className="text-sm text-green-700">
                Your account has been approved. All fields are locked and cannot
                be edited.
              </p>
            </div>
          </div>
        )}
        {isAccountInProcess && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Account Under Review
              </h3>
              <p className="text-sm text-yellow-700">
                Your profile is currently being reviewed. All fields are locked
                and cannot be edited.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 ${isFieldsDisabled ? "opacity-75" : ""}`}
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-xl">
                  {previewProfile ? (
                    <img
                      src={previewProfile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {!isFieldsDisabled && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      disabled={isFieldsDisabled}
                    />
                  </label>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {userProfile?.userId?.name || "Your Name"}
              </h3>
              <p className="text-gray-500 text-sm">
                {userProfile?.userId?.email || "your@email.com"}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 ${isFieldsDisabled ? "opacity-75" : ""}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  About Me <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  rows={4}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Residence Information */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 ${isFieldsDisabled ? "opacity-75" : ""}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Home className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Residence Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Building <span className="text-red-500">*</span>
                </label>
                <select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select Building</option>
                  {buildings.map((b: { _id: string; name: string }) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Home className="w-4 h-4 text-gray-500" />
                  Flat <span className="text-red-500">*</span>
                </label>
                <select
                  name="flatId"
                  value={formData.flatId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={!formData.buildingId || isFieldsDisabled}
                >
                  <option value="">Select Flat</option>
                  {flats.map((f: { _id: string; name: string }) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Home className="w-4 h-4 text-gray-500" />
                  Select Room Name
                </label>
                <select
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}

                >
                  <option value="">Select Room Name</option>
                  {roomsData.map((data) => (
                    <option value={data}>
                      {data}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Guardian & Emergency Contact */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 ${isFieldsDisabled ? "opacity-75" : ""}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Guardian & Emergency Contact
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="guardianName"
                  placeholder="Full name"
                  value={formData.guardianName}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Guardian Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="guardianPhone"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Relation <span className="text-red-500">*</span>
                </label>
                <input
                  name="guardianRelation"
                  placeholder="e.g., Father, Mother"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Emergency Contact <span className="text-red-500">*</span>
                </label>
                <input
                  name="emergencyContact"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={isFieldsDisabled}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isFieldsDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* NID Upload */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-8 ${isFieldsDisabled ? "opacity-75" : ""}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Identity Verification <span className="text-red-500">*</span>
              </h2>
            </div>

            <div className="space-y-4">
              <label
                className={`block ${isFieldsDisabled ? "pointer-events-none" : ""}`}
              >
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors ${isFieldsDisabled ? "cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
                >
                  {previewNid ? (
                    <div className="space-y-4">
                      <img
                        src={previewNid}
                        alt="NID"
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      {!isFieldsDisabled && (
                        <p className="text-sm text-gray-600">
                          Click to change NID photo
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          Upload NID Photo
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    name="nidPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={isFieldsDisabled}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isFieldsDisabled || isSubmitting}
              className={`px-8 py-4 font-semibold rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 ${isFieldsDisabled || isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:scale-105"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : isAccountApproved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Account Approved
                </>
              ) : isAccountInProcess ? (
                <>
                  <Lock className="w-5 h-5" />
                  Profile Locked
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileComponent;