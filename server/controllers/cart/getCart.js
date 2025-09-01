import Cart from "../../models/Cart.js";

const getCart = async (req, res) => {
  try {
    // Find the cart for the current user and populate product details
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    // If no cart exists, respond with an empty cart
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { items: [] },
      });
    }

    // If cart exists, return it with populated product details
    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    // Log error and respond with failure message
    console.error("Get cart failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

export default getCart;
