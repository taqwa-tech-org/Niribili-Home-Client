import { axiosSecure } from "@/hooks/useAxiosSecure";
// import { redirect } from "react-router-dom";

export const userProfileLoader = async () => {
  try {
    const res = await axiosSecure.get("/user/me");
    console.log("fetch data", res.data)
    return res.data;
  } catch (err){
    console.log("error detected" , err)
    // return redirect("/login");
   }
};
