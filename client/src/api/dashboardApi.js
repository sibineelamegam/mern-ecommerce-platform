import axios from "./axios";

export const getDashboardStats = async () => {
  try {
    const [usersRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
      axios.get("/users"),
      axios.get("/categories"),
      axios.get("/products"),
      axios.get("/orders"), 
    ]);

    return {
      users: usersRes.data.users?.length || 0,
      categories: categoriesRes.data.categories?.length || 0,
      products: productsRes.data.products?.length || 0,
      orders: ordersRes.data.orders?.length || 0, 
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
