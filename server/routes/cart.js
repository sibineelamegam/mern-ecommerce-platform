import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

// Controllers
import getCart from "../controllers/cart/getCart.js";
import addToCart from "../controllers/cart/addToCart.js";
import updateCartItem from "../controllers/cart/updateCartItem.js";
import removeCartItem from "../controllers/cart/removeCartItem.js";
import clearCart from "../controllers/cart/clearCart.js";

const router = express.Router();

// All routes require user login
router.use(verifyJWT);

router.delete("/clear", clearCart); // CLEAR all items in cart
router.get("/", getCart); // GET cart
router.post("/", addToCart); // ADD product to cart
router.put("/:itemId", updateCartItem); // UPDATE quantity of specific cart item
router.delete("/:itemId", removeCartItem); // REMOVE specific cart item


export default router;
