// src/api/cartApi.js
import axios from "./axios";

// Fetch logged-in user's cart
export const getCart = async () => {
  const res = await axios.get("/cart");
  return res.data;
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const res = await axios.post("/cart", { productId, quantity });
  return res.data;
};

// Update quantity of a cart item
export const updateCartItem = async (itemId, quantity) => {
  const res = await axios.put(`/cart/${itemId}`, { quantity });
  return res.data;
};

// Remove a cart item
export const removeFromCart = async (itemId) => {
  const res = await axios.delete(`/cart/${itemId}`);
  return res.data;
};

// Clear entire cart
export const clearCart = async () => {
  const res = await axios.delete("/cart/clear");
  return res.data;
};
