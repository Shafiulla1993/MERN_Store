// src/api/axiosInstance.js
import axios from "axios";

// ✅ Base URL for your backend
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.token = token;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
