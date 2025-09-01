import Product from "../../models/Product.js";
import mongoose from "mongoose";


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default getProductById;
