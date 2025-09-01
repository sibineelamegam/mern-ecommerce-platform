import Product from "../../models/Product.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      // Delete uploaded file if it exists
      await deleteUploadedFile(req.file?.filename);
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle uploaded image
    const images = req.file ? [req.file.filename] : [];

    // Create the product
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images,
      createdBy: req.user.id, // from verifyJWT middleware
    });

    // Populate category name and creator info
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    // Delete uploaded file if something goes wrong
    await deleteUploadedFile(req.file?.filename);
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default createProduct;
