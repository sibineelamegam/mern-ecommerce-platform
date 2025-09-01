// src/api/categoryApi.js
import axios from "./axios";

// Public routes
export const getAllCategories = async () => {
  const response = await axios.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axios.get(`/categories/${id}`);
  return response.data;
};

// Admin-only routes
export const createCategory = async (categoryData) => {
  const response = await axios.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`/categories/${id}`);
  return response.data;
};
