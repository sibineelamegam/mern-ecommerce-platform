import Category from "../../models/Category.js";

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Normalize name and parentCategory
    const categoryName = name.trim();
    const parentId = parentCategory || null;

    // Check for duplicate category under the same parent
    const existing = await Category.findOne({
      name: categoryName,
      parentCategory: parentId,
    });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const category = new Category({
      name: categoryName,
      parentCategory: parentId,
      image: req.file?.filename || null, 
      createdBy: req.user.id,
    });

    // Save category to DB
    const saved = await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category: saved,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default createCategory;
