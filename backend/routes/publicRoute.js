import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  getUserOrders,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/UserController.js";
import {
  getAllCategories,
  getSubcategoriesByCategory,
  getAllProducts,
  getSingleProduct,
} from "../controllers/publicController.js";
import auth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/v1/register", registerUser);
router.post("/v1/login", loginUser);

// Category endpoints
router.get("/v1/categories", getAllCategories);
router.get("/v1/categories/:id/subcategories", getSubcategoriesByCategory);

// ✅ Protected routes (user must be logged in)
router.get("/v1/profile", auth, getUserProfile);
router.put("/v1/profile", auth, updateUserProfile);
router.post("/v1/address", auth, addAddress);
router.get("/v1/orders", auth, getUserOrders);
// 🛒 Cart routes
router.get("/v1/cart", auth, getCart);
router.post("/v1/cart", auth, addToCart);
router.put("/v1/cart", auth, updateCartItem);
router.delete("/v1/cart/:productId", auth, removeFromCart);

// Product endpoints
router.get("/v1/products", getAllProducts);
router.get("/v1/products/:id", getSingleProduct);

export default router;
