import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import mongoose from "mongoose";

const getProducts = async (req, res) => {
  try {
    const filter = {};
    const { category } = req.query; // backend expects "category"

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }

      // Find all subcategories of this main category
      const subCategories = await Category.find({ parentCategory: category }).select("_id");
      const categoryIds = subCategories.map((c) => c._id);

      // Include the main category itself
      categoryIds.push(category);

      filter.category = { $in: categoryIds };
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default getProducts;
