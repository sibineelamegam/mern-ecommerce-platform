import dotenv from "dotenv";
dotenv.config(); // load .env FIRST before anything else

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { validateEnv } from "./utils/validateEnv.js";
import connectDB from "./config/db.js";
import corsOptions, { getAllowedOrigins } from "./config/corsOptions.js";
import { UPLOAD_DIR } from "./middleware/image.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/order.js";

// === Validate Environment Variables ===
validateEnv([
  "MONGO_URI",
  "CLIENT_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_EXPIRY",
  "EMAIL_USER",
  "EMAIL_PASS",
]);

const app = express();
const PORT = process.env.PORT || 5000;

// === Connect to MongoDB ===
connectDB()


// === Middleware ===
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(UPLOAD_DIR));

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

// === Health Check ===
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is up and running" });
});

// === 404 Handler ===
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(
    `🚀 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  );
  console.log("🌍 CORS Allowed Origins:", getAllowedOrigins());
});
