// src/api/orderApi.js
import axios from "./axios";

// Place a new order
export const createOrder = async (cart, shippingInfo, totalPrice) => {
  const res = await axios.post("/orders", { cart, shippingInfo, totalPrice });
  return res.data;
};

// Get all orders for logged-in user
export const getMyOrders = async () => {
  const res = await axios.get("/orders/my");
  return res.data;
};

// Get a single order by ID
export const getOrderById = async (id) => {
  const res = await axios.get(`/orders/${id}`);
  return res.data;
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  const res = await axios.get("/orders");
  return res.data;
};

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  const res = await axios.put(`/orders/${id}`, { status });
  return res.data;
};
