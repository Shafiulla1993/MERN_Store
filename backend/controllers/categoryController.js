import categoryModel from "../models/categoryModel.js";

// ===========================
// ➕ Add Main Category
// ===========================
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Category name is required" });
    }

    // Check duplicate
    const existing = await categoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const newCategory = new categoryModel({ name: name.trim() });
    await newCategory.save();

    res.json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// ➕ Add Subcategory
// ===========================
export const addSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategory } = req.body;

    if (!categoryId || !subCategory) {
      return res.json({
        success: false,
        message: "Category ID and Subcategory name are required",
      });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category)
      return res.json({ success: false, message: "Category not found" });

    // Check if subcategory already exists
    const exists = category.subCategories.find(
      (s) => s.name.toLowerCase() === subCategory.toLowerCase()
    );
    if (exists)
      return res.json({
        success: false,
        message: "Subcategory already exists",
      });

    // ✅ Push proper object (not string)
    category.subCategories.push({
      name: subCategory.trim(),
      sizeOptions: [],
    });

    await category.save();

    res.json({
      success: true,
      message: "Subcategory added successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 📜 List Categories
// ===========================
export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error listing categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// ❌ Delete Category
// ===========================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category)
      return res.json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 🔧 Update Subcategory Sizes
// ===========================
export const updateSubcategorySizes = async (req, res) => {
  try {
    const { categoryId, subCategoryName, sizes } = req.body;

    if (!categoryId || !subCategoryName || !Array.isArray(sizes)) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category)
      return res.json({ success: false, message: "Category not found" });

    const subCat = category.subCategories.find(
      (sub) => sub.name.toLowerCase() === subCategoryName.toLowerCase()
    );
    if (!subCat)
      return res.json({ success: false, message: "Subcategory not found" });

    // ✅ Update the sizes
    subCat.sizeOptions = sizes;
    await category.save();

    res.json({
      success: true,
      message: "Subcategory sizes updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating subcategory sizes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubcategorySizes = async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.query;

    if (!categoryId || !subCategoryName) {
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
      (sub) => sub.name.toLowerCase() === subCategoryName.toLowerCase()
    );

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, sizes: subcategory.sizeOptions || [] });
  } catch (error) {
    console.error("getSubcategorySizes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
