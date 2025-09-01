// src/api/userApi.js
import axios from "./axios";

// Get logged-in user profile
export const getProfile = async () => {
  const response = await axios.get("/users/profile/me");
  return response.data;
};

// Update logged-in user profile
export const updateProfile = async (profileData) => {
  const response = await axios.put("/users/profile/me", profileData);
  return response.data;
};

// Admin-only: get all users
export const getAllUsers = async () => {
  const response = await axios.get("/users");
  return response.data;
};

// Admin-only: get single user by id
export const getUserById = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

// Admin-only: create new user
export const createUser = async (userData) => {
  const response = await axios.post("/users", userData);
  return response.data;
};

// Admin-only: update any user
export const updateUser = async (id, userData) => {
  const response = await axios.put(`/users/${id}`, userData);
  return response.data;
};

// Admin-only: delete user
export const deleteUser = async (id) => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};
