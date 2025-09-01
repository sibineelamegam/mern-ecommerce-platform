import Order from "../../models/Order.js";

const getAllOrders = async (req, res) => {
  try {
    // Populate user info for reference and items.product for product details
    const orders = await Order.find()
      .populate("user", "name email customerId")
      .populate("items.product", "name price images stock");

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getAllOrders;
