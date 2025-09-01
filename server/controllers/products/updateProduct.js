import Product from "../../models/Product.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const updateProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      await deleteUploadedFile(req.file?.filename);
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, stock, category } = req.body;

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    // Handle image updates
    let oldImages = [];
    if (req.file) {
      oldImages = [...product.images]; // copy old images
      product.images = [req.file.filename]; // set new image
    }

    // Save updated product first
    await product.save();

    // Populate category so frontend receives correct info
    const populatedProduct = await Product.findById(product._id).populate("category", "name");

    // Now safely delete old images if no other product uses them
    for (const image of oldImages) {
      await deleteUploadedFile(image);
    }

    // Send response with populated product
    res.status(200).json({
      message: "Product updated successfully",
      product: populatedProduct,
    });
  } catch (error) {
    await deleteUploadedFile(req.file?.filename);
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default updateProduct;
