import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

// Controllers
import getWishlist from "../controllers/wishlist/getWishlist.js";
import addToWishlist from "../controllers/wishlist/addToWishlist.js";
import removeWishlistItem from "../controllers/wishlist/removeWishlistItem.js";
import clearWishlist from "../controllers/wishlist/clearWishlist.js";

const router = express.Router();

// All routes require user login
router.use(verifyJWT);

router.get("/", getWishlist); // GET wishlist
router.post("/", addToWishlist); // ADD product to wishlist
router.delete("/clear", clearWishlist); // CLEAR all wishlist items
router.delete("/:itemId", removeWishlistItem); // REMOVE specific product

export default router;
