import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addCategory,
  addSubCategory,
  listCategories,
  deleteCategory,
  updateSubcategorySizes,
  getSubcategorySizes,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", adminAuth, addCategory);
router.post("/sub", adminAuth, addSubCategory);
router.get("/", listCategories);
router.delete("/:id", adminAuth, deleteCategory);
router.put("/subcategory-sizes", adminAuth, updateSubcategorySizes);
router.get("/subcategory-sizes", getSubcategorySizes);

console.log("✅ categoryRoute.js loaded");

export default router;
