import Category from "../../models/Category.js";

const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories and populate related references:
    // - createdBy and updatedBy: only select name and email
    // - parentCategory: only select name
    const categories = await Category.find()
      .populate([
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
        { path: "parentCategory", select: "name" },
      ]);

    // If no categories exist, return empty array with a message
    if (!categories || categories.length === 0) {
      return res.status(200).json({
        message: "No categories found",
        categories: [],
      });
    }

    // Return all categories with populated references
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    // Log error and return server error response
    console.error("Get All Categories Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getAllCategories;


/*
 Example:
electronics (parent only)
laptops → products live here
mobiles → products live here
fashion (parent only)
hoodies → products live here
t-shirts → products live here
*/
