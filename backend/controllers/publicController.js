import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

// ===========================
// 📂 Get all categories
// ===========================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 📂 Get subcategories by category ID
// ===========================
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res.json({ success: true, subCategories: category.subCategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 🛍️ Get all products (with optional filters)
// ===========================
export const getAllProducts = async (req, res) => {
  try {
    const { category, subCategory, bestSeller } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (subCategory) filters.subCategory = subCategory;
    if (bestSeller === "true") filters.bestSeller = true;

    const products = await productModel.find(filters).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 🛒 Get single product details
// ===========================
export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
