import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ===========================
// ➕ Add Product
// ===========================
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    // 🧩 Validation
    if (!name || !description || !price || !category || !subCategory) {
      return res.json({
        success: false,
        message:
          "All fields (name, description, price, category, subcategory) are required",
      });
    }

    if (!req.files?.length) {
      return res.json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ✅ Parse sizes safely
    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch {
      parsedSizes = [];
    }

    // ✅ Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const product = await productModel.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes || [],
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: imageUrls,
      date: new Date(),
    });

    res.json({
      success: true,
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// ===========================
// 📜 List All Products
// ===========================
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error listing products:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching products",
      });
  }
};

// ===========================
// 📦 Get Single Product
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================
// ❌ Remove Product
// ===========================
export const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // 🧹 Delete product images from Cloudinary
    if (Array.isArray(product.image) && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (url) => {
          try {
            const publicId = url.split("/upload/")[1]?.split(".")[0];
            if (publicId) await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Cloudinary delete failed:", err.message);
          }
        })
      );
    }

    await productModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting product" });
  }
};
