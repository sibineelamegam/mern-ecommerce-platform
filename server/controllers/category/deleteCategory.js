import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Prevent deletion if the category has subcategories
    const subCategories = await Category.find({ parentCategory: id }).select("_id");
    if (subCategories.length > 0) {
      return res.status(400).json({ message: "Cannot delete category with subcategories" });
    }

    // Prevent deletion if products are assigned to this category
    const hasProducts = await Product.exists({ category: id });
    if (hasProducts) {
      return res.status(400).json({ message: "Cannot delete category assigned to products" });
    }

    // Delete the category's uploaded image (if exists)
    if (category.image) await deleteUploadedFile(category.image);

    // Delete the category itself
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    // Log and return server error
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default deleteCategory;
