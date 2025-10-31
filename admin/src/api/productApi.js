import axiosInstance from "./axiosInstance";

// ➕ Add product (with images)
export const addProduct = async (formData) => {
  return await axiosInstance.post("/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📜 List all products
export const listProducts = async () => {
  return await axiosInstance.get("/product");
};

// 🔍 Get single product
export const getSingleProduct = async (productId) => {
  return await axiosInstance.get(`/product/${productId}`);
};

// ❌ Remove product (DELETE method)
export const removeProduct = async (productId) => {
  return await axiosInstance.delete(`/product/${productId}`);
};
