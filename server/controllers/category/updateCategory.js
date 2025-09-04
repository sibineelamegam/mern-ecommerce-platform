// updateCategory.js
import Category from "../../models/Category.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      if (req.file?.filename) await deleteUploadedFile(req.file.filename);
      return res.status(404).json({ message: "Category not found" });
    }

    // consider parentCategory when checking duplicates
    if (name) {
      const trimmedName = name.trim();

      const exists = await Category.findOne({
        name: trimmedName,
        parentCategory: parentCategory || null, // must match same parent
        _id: { $ne: id }, // exclude current category
      });

      if (exists) {
        if (req.file?.filename) await deleteUploadedFile(req.file.filename);
        return res.status(400).json({ message: "Category already exists under the same parent" });
      }

      category.name = trimmedName;
    }

    // still allow null for parent (main category)
    category.parentCategory = parentCategory || null;
    category.updatedBy = req.user.id;

    if (req.file) {
      if (category.image) await deleteUploadedFile(category.image);
      category.image = req.file.filename;
    }

    const updated = await category.save();

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
    if (req.file?.filename) await deleteUploadedFile(req.file.filename);
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateCategory;
