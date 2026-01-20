import { axiosSecure } from "@/hooks/useAxiosSecure";
import { redirect } from "react-router-dom";

export const userProfileLoader = async () => {
  try {
    const res = await axiosSecure.get("/user/me");
    return res.data;
  } catch {
    return redirect("/login");
  }
};
