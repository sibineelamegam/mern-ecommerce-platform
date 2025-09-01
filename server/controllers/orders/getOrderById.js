import Order from "../../models/Order.js";

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Populate only items.product to get product details
    const order = await Order.findById(orderId).populate(
      "items.product",
      "name price images stock"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getOrderById;
