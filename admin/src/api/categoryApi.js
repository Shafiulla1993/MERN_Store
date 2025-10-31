import axiosInstance from "./axiosInstance";

// ➕ Add main category
export const addCategory = async (name) => {
  return await axiosInstance.post("/category", { name });
};

// ➕ Add sub-category
export const addSubCategory = async (categoryId, subCategory) => {
  return await axiosInstance.post("/category/sub", {
    categoryId,
    subCategory,
  });
};

// 📜 List all categories
export const listCategories = async () => {
  return await axiosInstance.get("/category");
};

// ❌ Delete category
export const deleteCategory = async (categoryId) => {
  return await axiosInstance.delete(`/category/${categoryId}`);
};

// 🔧 Update subcategory size options
export const updateSubcategorySizes = async (
  categoryId,
  subCategoryName,
  sizes
) => {
  return await axiosInstance.put("/category/subcategory-sizes", {
    categoryId,
    subCategoryName,
    sizes,
  });
};


// Get sizes for a specific subcategory
export const getSubcategorySizes = async (categoryId, subCategoryName) => {
  return await axiosInstance.get("/category/subcategory-sizes", {
    params: { categoryId, subCategoryName },
  });
};
