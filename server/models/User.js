import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Counter from "./Counter.js";

const userSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Auto-generate customerId and hash password
userSchema.pre("save", async function (next) {
  try {
    // If document is new and customerId not set, generate one
    if (this.isNew && !this.customerId) {
      const counter = await Counter.findOneAndUpdate(
        { name: "customerId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.customerId = `CUST-${counter.seq.toString().padStart(4, "0")}`;
    }

    // Convert password to  hash
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

