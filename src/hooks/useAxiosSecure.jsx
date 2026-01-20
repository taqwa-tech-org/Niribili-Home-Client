import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 🔐 REQUEST INTERCEPTOR
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ❌ RESPONSE ERROR HANDLE
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // ♻️ REFRESH TOKEN LOGIC
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // If refreshToken doesn't exist, logout user
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirect to login page
            return Promise.reject(new Error("Session expired. Please login again."));
          }

          // Call refresh token endpoint
          const response = await axios.post(
            "http://localhost:8080/api/v1/auth/refresh",
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const newAccessToken = response.data.data.accessToken;
          const newRefreshToken = response.data.data.refreshToken;

          // Store new tokens
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update Authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry original request with new token
          return axiosSecure(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Redirect to login page
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;

/*  How to use it   
const axiosSecure = useAxiosSecure();
  const getProfile = async () => {
    const res = await axiosSecure.get("/user/profile");
    console.log(res.data);
  };
  
*/