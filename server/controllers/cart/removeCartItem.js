import mongoose from "mongoose";
import Cart from "../../models/Cart.js";

const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid cart item ID" });
    }

    // Fetch user's cart and populate product details
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    // Find the index of the item to remove
    const index = cart.items.findIndex(item => item._id.toString() === itemId);
    if (index === -1) return res.status(404).json({ success: false, message: "Cart item not found" });

    // Remove the item from the cart (no stock restoration)
    cart.items.splice(index, 1);
    await cart.save();

    // Populate product details for response
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Remove cart item failed:", error);
    res.status(500).json({ success: false, message: "Failed to remove cart item", error: error.message });
  }
};

export default removeCartItem;
