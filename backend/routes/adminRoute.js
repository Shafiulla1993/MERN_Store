import express from "express";
import loginAdmin from "../controllers/adminController.js"; // default export

const router = express.Router();

// POST /api/user/admin
router.post("/admin", loginAdmin);

export default router;
