import axios from "axios";

// 🌍 Base URL setup (works for dev + production)
export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const axiosInstance = axios.create({
  baseURL: backendUrl + "/api", // every API call = /api/...
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});

// 🔐 Attach token to every request (standard "Authorization: Bearer <token>")
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ changed line
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
