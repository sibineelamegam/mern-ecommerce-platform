import mongoose from "mongoose";
import Counter from "./Counter.js";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true, // snapshot of product name at purchase time
  },
  price: {
    type: Number,
    required: true, // snapshot of price at purchase time
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String, // formatted like ORD-0001
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment and format orderId
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const counter = await Counter.findOneAndUpdate(
      { name: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderId = `ORD-${counter.seq.toString().padStart(4, "0")}`;
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
