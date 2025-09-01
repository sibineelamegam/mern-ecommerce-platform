import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    parentCategory: {
      // self-referencing relationship
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // reference to another category if this is a subcategory
      default: null, // null means main category
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      default: null, // initially null, will be set when updated
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;

