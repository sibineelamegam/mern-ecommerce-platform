import axios from "./axios";

// Get all products, optionally filtered by category
export const getAllProducts = async (id) => {
  const query = id ? `?category=${id}` : ""; // <-- must match backend
  const res = await axios.get(`/products${query}`);
  return res.data;
};

// Get single product by ID
export const getProductById = async (id) => {
  const res = await axios.get(`/products/${id}`);
  return res.data;
};

// Search products by name (starts with)
export const searchProducts = async (query) => {
  if (!query) return [];
  const res = await axios.get(`/products/search?q=${query}`);
  return Array.isArray(res.data) ? res.data : []; // ensure array
};

// Create new product (Admin only)
export const createProduct = async (formData) => {
  const res = await axios.post("/products", formData);
  return res.data;
};

// Update product (Admin only)
export const updateProduct = async (id, formData) => {
  const res = await axios.put(`/products/${id}`, formData);
  return res.data;
};

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};
