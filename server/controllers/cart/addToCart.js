import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Fetch the product from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Optional: check stock, but do NOT deduct
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    // Check if product is already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart failed:", error);
    res.status(500).json({ success: false, message: "Failed to add product to cart", error: error.message });
  }
};

export default addToCart;
