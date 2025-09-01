import Cart from "../../models/Cart.js";

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });

    // Update quantity in cart only (do not touch product stock)
    item.quantity = quantity;
    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update cart item failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

export default updateCartItem;
