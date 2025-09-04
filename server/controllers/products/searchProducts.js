// controllers/products/searchProducts.js
import Product from "../../models/Product.js";

const searchProducts = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q) return res.json([]);

    const regex = new RegExp(`^${q}`, "i"); // starts with, case-insensitive
    const products = await Product.find({ name: regex }).limit(50);

    res.json(products);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default searchProducts;
