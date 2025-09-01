import Category from "../../models/Category.js";

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the category by ID and populate related references
    const category = await Category.findById(id).populate([
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" },
      { path: "parentCategory", select: "name" },
    ]);

    // If category does not exist, return 404
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // // Fetch subcategories where this category is the parent
    // const subcategories = await Category.find({ parentCategory: id }).populate([
    //   { path: "createdBy", select: "name email" },
    //   { path: "updatedBy", select: "name email" },
    // ]);

    // Return the category with its subcategories
    res.status(200).json({
      message: "Category retrieved successfully",
      category,
      // subcategories,
    });
  } catch (error) {
    // Log error and return server error response
    console.error("Get Category By ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getCategoryById;
