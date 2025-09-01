// routes/productRoutes.js
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";

// Middleware
import { handleImageUpload } from "../middleware/image.js";

// Controllers
import createProduct from "../controllers/products/createProduct.js";
import deleteProduct from "../controllers/products/deleteProduct.js";
import getProducts from "../controllers/products/getProducts.js";
import getProductById from "../controllers/products/getProductById.js";
import updateProduct from "../controllers/products/updateProduct.js";


const router = express.Router();

// PUBLIC CUSTOMER ROUTES
router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get single product by ID

// ADMIN ROUTES (protected)
router.post(
  "/",
  verifyJWT,
  requireRole("admin"),
  handleImageUpload,
  createProduct
);
router.put(
  "/:id",
  verifyJWT,
  requireRole("admin"),
  handleImageUpload,
  updateProduct
);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteProduct);


export default router;
