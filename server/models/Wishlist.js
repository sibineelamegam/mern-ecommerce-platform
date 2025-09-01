import mongoose from "mongoose";

// Each item in the wishlist
const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
    //  Difference: this tracks when the product was added
    // If removed → you'll only have createdAt/updatedAt for the whole wishlist
  },
});

// Wishlist schema (one per user)
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // one wishlist per user
      required: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
  // This tracks when the wishlist doc was created/last updated
);

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;

