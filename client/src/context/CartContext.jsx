import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../api/cartApi";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  /** Fetch cart items */
  const fetchCart = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const data = await getCart();
      setCart(data?.cart?.items || []);
    } catch (err) {
      if (err.response?.status !== 401) console.error(err);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Add item to cart */
  const addItem = async (productId, quantity = 1) => {
    setLoadingAction(true);
    try {
      const data = await addToCart(productId, quantity);
      setCart(data?.cart?.items || []);
      return { type: "success", message: "Item added to cart" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to add item" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Update quantity of an item in cart */
  const updateItem = async (itemId, quantity) => {
    setLoadingAction(true);
    try {
      await updateCartItem(itemId, quantity);
      setCart((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, quantity } : item))
      );
      return { type: "success", message: "Cart updated" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to update cart" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Increment item quantity with stock check */
  const incrementItem = async (itemId) => {
    const item = cart.find((i) => i._id === itemId);
    if (!item) return { type: "error", message: "Item not found" };
    if (item.quantity >= (item.product?.stock || 0)) {
      return { type: "error", message: "Maximum stock reached" };
    }
    await updateItem(itemId, item.quantity + 1);
    return { type: "success", message: "Quantity increased" };
  };

  /** Decrement item quantity, minimum 1 */
  const decrementItem = async (itemId) => {
    const item = cart.find((i) => i._id === itemId);
    if (!item) return { type: "error", message: "Item not found" };
    if (item.quantity <= 1) {
      return { type: "error", message: "Cannot have less than 1 item" };
    }
    await updateItem(itemId, item.quantity - 1);
    return { type: "success", message: "Quantity decreased" };
  };

  /** Remove an item from cart */
  const removeItem = async (itemId) => {
    setLoadingAction(true);
    try {
      await removeFromCart(itemId);
      setCart((prev) => prev.filter((item) => item._id !== itemId));
      return { type: "success", message: "Item removed from cart" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to remove item" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Clear all items from cart */
  const clearAll = async () => {
    setLoadingAction(true);
    try {
      await clearCart();
      setCart([]);
      return { type: "success", message: "Cart cleared" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to clear cart" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Calculate total cart price */
  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  /** Fetch cart items on mount */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingInitial,
        loadingAction,
        fetchCart,
        addItem,
        updateItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearAll,
        setCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
