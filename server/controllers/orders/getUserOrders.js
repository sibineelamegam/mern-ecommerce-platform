import Order from "../../models/Order.js";

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId }).populate(
      "items.product",
      "name price images stock"
    );

    res.status(200).json({
      message:
        orders.length > 0 ? "Orders fetched successfully" : "No orders found",
      orders,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getUserOrders;
