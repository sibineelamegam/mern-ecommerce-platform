import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";

import createOrder from "../controllers/orders/createOrder.js";
import getUserOrders from "../controllers/orders/getUserOrders.js";
import getOrderById from "../controllers/orders/getOrderById.js";
import getAllOrders from "../controllers/orders/getAllOrders.js";
import updateOrderStatus from "../controllers/orders/updateOrderStatus.js";

const router = express.Router();

// All user routes require login
router.use(verifyJWT);

router.post("/", createOrder); // Place a new order
router.get("/my", getUserOrders); // Get all orders for logged-in user
router.get("/:id", getOrderById); // Get single order (only if it belongs to the logged-in user)
router.get("/", requireRole("admin"), getAllOrders); // Get all orders (admin only)
router.put("/:id", requireRole("admin"), updateOrderStatus); // Update order status (admin only)

export default router;
