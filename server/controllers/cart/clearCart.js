import Cart from "../../models/Cart.js";

const clearCart = async (req, res) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Clear all items (no stock restoration)
    cart.items = [];
    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

export default clearCart;
