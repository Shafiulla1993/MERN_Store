import categoryModel from "../models/categoryModel.js";

// ===========================
// ➕ Add Main Category
// ===========================
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await categoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = await categoryModel.create({ name: name.trim() });

    res.json({
      success: true,
      message: "✅ Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding category" });
  }
};

// ===========================
// ➕ Add Subcategory
// ===========================
export const addSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategory } = req.body;

    if (!categoryId || !subCategory?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category ID and Subcategory name are required",
      });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const exists = category.subCategories.find(
      (s) => s.name.toLowerCase() === subCategory.trim().toLowerCase()
    );

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory already exists" });
    }

    category.subCategories.push({
      name: subCategory.trim(),
      sizeOptions: [],
    });

    await category.save();

    res.json({
      success: true,
      message: "✅ Subcategory added successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding subcategory",
    });
  }
};

// ===========================
// 📜 List Categories
// ===========================
export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error listing categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

// ===========================
// ❌ Delete Category
// ===========================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "🗑️ Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
    });
  }
};

// ===========================
// 🔧 Update Subcategory Sizes
// ===========================
export const updateSubcategorySizes = async (req, res) => {
  try {
    const { categoryId, subCategoryName, sizes } = req.body;

    if (!categoryId || !subCategoryName?.trim() || !Array.isArray(sizes)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const subCat = category.subCategories.find(
      (sub) => sub.name.toLowerCase() === subCategoryName.trim().toLowerCase()
    );

    if (!subCat) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    subCat.sizeOptions = sizes;
    await category.save();

    res.json({
      success: true,
      message: "✅ Subcategory sizes updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating subcategory sizes:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating sizes" });
  }
};

// ===========================
// 📏 Get Subcategory Sizes
// ===========================
export const getSubcategorySizes = async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.query;

    if (!categoryId || !subCategoryName?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Missing parameters" });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const subcategory = category.subCategories.find(
      (sub) => sub.name.toLowerCase() === subCategoryName.trim().toLowerCase()
    );

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, sizes: subcategory.sizeOptions || [] });
  } catch (error) {
    console.error("Error fetching subcategory sizes:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching sizes" });
  }
};
