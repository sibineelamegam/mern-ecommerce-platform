import Wishlist from "../../models/wishlist.js";

const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Find item index
    const itemIndex = wishlist.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    // Remove item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Populate before sending response
    await wishlist.populate(
      "items.product",
      "name price images category stock"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing item from wishlist",
    });
  }
};

export default removeWishlistItem;
