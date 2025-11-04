import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";
import {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", adminAuth, upload.array("images"), addProduct);
router.get("/", listProducts);
router.get("/:id", getSingleProduct);
router.delete("/:id", adminAuth, removeProduct);

export default router;
