// src/api/axios.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
