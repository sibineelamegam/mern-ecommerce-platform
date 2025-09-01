// routes/category.js
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";

// Middleware
import { handleImageUpload } from "../middleware/image.js";

// Import Category controllers
import createCategory from "../controllers/category/createCategory.js";
import getAllCategories from "../controllers/category/getAllCategories.js";
import getCategoryById from "../controllers/category/getCategoryById.js";
import updateCategory from "../controllers/category/updateCategory.js";
import deleteCategory from "../controllers/category/deleteCategory.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only routes
router.post("/", verifyJWT, requireRole("admin"), handleImageUpload, createCategory);
router.put("/:id", verifyJWT, requireRole("admin"), handleImageUpload, updateCategory);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteCategory);

export default router;
