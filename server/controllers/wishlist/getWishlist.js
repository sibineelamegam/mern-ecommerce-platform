import Wishlist from "../../models/wishlist.js";

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // user ID from verifyJWT

    // Find wishlist for the user and populate product details
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product",
      "name price images category stock"
    );

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist",
    });
  }
};

export default getWishlist;
