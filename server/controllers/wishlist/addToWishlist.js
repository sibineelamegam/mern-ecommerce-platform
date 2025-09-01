import Wishlist from "../../models/wishlist.js";
import Product from "../../models/product.js";

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Check if product already in wishlist
    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    wishlist.items.push({ product: productId });
    await wishlist.save();

    // Populate before sending response
    await wishlist.populate(
      "items.product",
      "name price images category stock"
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product to wishlist",
    });
  }
};

export default addToWishlist;
