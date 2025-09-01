import axios from "./axios";

// Fetch logged-in user's wishlist
export const getWishlist = async () => {
  const res = await axios.get("/wishlist");
  return res.data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const res = await axios.post("/wishlist", { productId });
  return res.data;
};

// Remove a product from wishlist
export const removeFromWishlist = async (itemId) => {
  const res = await axios.delete(`/wishlist/${itemId}`);
  return res.data;
};

// Clear entire wishlist
export const clearWishlist = async () => {
  const res = await axios.delete("/wishlist/clear");
  return res.data;
};
