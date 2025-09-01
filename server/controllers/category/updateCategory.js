import Category from "../../models/Category.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    // Fetch the category to update
    const category = await Category.findById(id);
    if (!category) {
      // If category not found, delete uploaded file (if any) to prevent orphaned files
      if (req.file?.filename) await deleteUploadedFile(req.file.filename);
      return res.status(404).json({ message: "Category not found" });
    }

    // If a new name is provided, check for duplicates under the same parent
    let trimmedName;
    if (name) {
      trimmedName = name.trim();

      // ✅ Exclude the current category from duplicate check
      const exists = await Category.findOne({ 
        name: trimmedName,
        _id: { $ne: id } // ignore the category itself
      });

      if (exists) {
        // Delete newly uploaded image to prevent orphaned files
        if (req.file?.filename) await deleteUploadedFile(req.file.filename);
        return res.status(400).json({ message: "Category already exists" });
      }

      // Update the category name
      category.name = trimmedName;
    }

    // Update parentCategory and updatedBy fields
    category.parentCategory = parentCategory || null;
    category.updatedBy = req.user.id;

    // If a new image is uploaded, delete the old one and set the new image
    if (req.file) {
      if (category.image) await deleteUploadedFile(category.image);
      category.image = req.file.filename;
    }

    // Save the updated category
    const updated = await category.save();

    // Populate related references for response
    await updated.populate([
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" },
      { path: "parentCategory", select: "name" },
    ]);

    res.status(200).json({
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    // If an error occurs, delete uploaded file to prevent orphaned files
    if (req.file?.filename) await deleteUploadedFile(req.file.filename);
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateCategory;
