import mongoose from "mongoose";
import Counter from "./Counter.js";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String, // make sure it's string if using "PROD-0001" format
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // says "this field stores ObjectId"
      ref: "Category", // says "this ObjectId comes from Category collection"
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock: {
      type: Number, // number of items available in inventory
      default: 0,   // default 0 if not specified
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment and format productId
productSchema.pre("save", async function (next) {
  if (!this.productId) {
    const counter = await Counter.findOneAndUpdate(
      { name: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.productId = `PROD-${counter.seq.toString().padStart(4, "0")}`;
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;

