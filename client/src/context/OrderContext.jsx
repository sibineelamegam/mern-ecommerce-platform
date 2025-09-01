import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";

export const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  /** Fetch current user's orders */
  const fetchMyOrders = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const data = await getMyOrders();
      setOrders(data?.orders || []);
      return { type: "success", message: "Orders fetched" };
    } catch (err) {
      console.error(err);
      setOrders([]);
      return { type: "error", message: "Failed to fetch orders" };
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Admin: fetch all orders */
  const fetchAllOrders = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const data = await getAllOrders();
      setOrders(data?.orders || []);
      return { type: "success", message: "Orders fetched" };
    } catch (err) {
      console.error(err);
      setOrders([]);
      return { type: "error", message: "Failed to fetch orders" };
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Place a new order */
  const placeOrder = async ({ cart, shippingInfo, totalPrice }) => {
    setLoadingAction(true);
    try {
      const data = await createOrder(cart, shippingInfo, totalPrice);
      setOrders((prev) => [data?.order, ...prev]);
      return { type: "success", message: "Order placed successfully!" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to place order" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Fetch single order by ID */
  const getOrder = async (id) => {
    setLoadingAction(true);
    try {
      const data = await getOrderById(id);
      setOrders((prev) => {
        const exists = prev.find((order) => order._id === id);
        return exists
          ? prev.map((order) => (order._id === id ? data?.order : order))
          : [...prev, data?.order];
      });
      return { type: "success", message: "Order fetched" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to fetch order details" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Update order status */
  const updateStatus = async (id, status) => {
    setLoadingAction(true);
    try {
      const data = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: data?.order?.status } : order
        )
      );
      return { type: "success", message: "Order status updated" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to update status" };
    } finally {
      setLoadingAction(false);
    }
  };

  const resetOrders = () => {
    setOrders([]);
    setLoadingInitial(false);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingInitial,
        loadingAction,
        fetchMyOrders,
        fetchAllOrders,
        placeOrder,
        getOrder,
        updateStatus,
        setOrders,
        resetOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
