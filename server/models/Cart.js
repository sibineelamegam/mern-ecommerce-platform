import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // one cart per user
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;

