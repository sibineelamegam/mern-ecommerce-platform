import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart, shippingInfo, totalPrice } = req.body;

    if (!cart || cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (
      !shippingInfo?.address ||
      !shippingInfo?.city ||
      !shippingInfo?.country ||
      !shippingInfo?.phone
    )
      return res.status(400).json({ message: "Shipping info is required" });

    const orderItems = [];

    // Deduct stock & prepare order items
    for (const item of cart) {
      const productId = item.product._id || item.product;
      const product = await Product.findById(productId);

      if (!product)
        return res.status(404).json({ message: `Product not found` });

      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      // Prepare snapshot for order
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingInfo,
      totalPrice,
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default createOrder;
