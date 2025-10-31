// src/api/userApi.js
import axiosInstance from "./axiosInstance";

// Admin login
export const loginAdmin = async (data) => {
  return await axiosInstance.post("/user/admin", data);
};
    