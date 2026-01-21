// import useAxiosSecure from "@/hooks/useAxiosSecure";
// import { createContext, useEffect, useState } from "react";


// export const UserContext = createContext(null);

// const UserContextProvider = ({ children }) => {
//   const axiosSecure = useAxiosSecure();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axiosSecure.get("/user/me");
//         setUser(res.data); // adjust if your backend structure is different
//         console.log(res.data)
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [axiosSecure]);

//   const value = {
//     user,
//     loading,
//     setUser, // optional (useful for update profile)
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContextProvider;
