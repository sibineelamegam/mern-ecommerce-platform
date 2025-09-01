import Order from "../../models/Order.js";

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId).populate("user", "name email customerId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateOrderStatus;
