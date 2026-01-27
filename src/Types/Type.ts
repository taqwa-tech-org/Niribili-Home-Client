export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UserProfile {
  _id: string;
  userId: User;
  profilePhoto: string;
  nidPhoto: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  emergencyContact: string;
  buildingId: Building;
  flatId: Flat;
  billId: string | null;
  room: string;
  whatsappNumber: string;
  accountStatus: "pending" | "process" | "approve" | "active" | "inactive";
  bio: string;
  role: "user" | "admin";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: "user" | "admin";
  status: "Active" | "Inactive";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Building {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface Flat {
  _id: string;
  buildingId: string;
  name: string;
  monthlyRent: number;
  occupantsCount: number;
  electricity: number;
  water: number;
  mealCost: number;
  serviceCharge: number;
  paymentDeadline: string;
  totalPayable: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
    