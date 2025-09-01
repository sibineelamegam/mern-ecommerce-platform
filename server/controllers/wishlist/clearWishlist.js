import Wishlist from "../../models/wishlist.js";

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Clear all items
    wishlist.items = [];
    await wishlist.save();

    // Populate before sending response (to keep consistent structure)
    await wishlist.populate("items.product", "name price images category stock");

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing wishlist",
    });
  }
};

export default clearWishlist;
