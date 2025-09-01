// src/api/authApi.js
import axios from "./axios";

// Helper to extract error message
const handleError = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

// Register a new user
export const registerUser = async (data) => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data; // res sent user
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Login an existing user
export const loginUser = async (data) => {
  try {
    const response = await axios.post("/auth/login", data);
    return response.data; // res sent user + sets tokens in cookie
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    const response = await axios.post("/auth/logout");
    return response.data; // clears cookies
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get a new access token using refresh token (guest-safe)
export const refreshToken = async () => {
  try {
    const response = await axios.get("/auth/refresh");
    return response.data; // user info + tokens set in cookies
  } catch (error) {
    // If no refresh token (guest), just return null silently
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    // Otherwise, throw unexpected errors
    throw new Error(handleError(error));
  }
};

// Request password reset link
export const forgotPassword = async (data) => {
  try {
    const response = await axios.post("/auth/forgot-password", data);
    return response.data; // res sent message
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Reset password using token
export const resetPassword = async (data) => {
  try {
    const response = await axios.post("/auth/reset-password", data);
    return response.data; // res sent message
  } catch (error) {
    throw new Error(handleError(error));
  }
};
