import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";

export const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  /** Fetch wishlist items */
  const fetchWishlist = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const data = await getWishlist();
      setWishlist(data?.wishlist?.items || []);
      return { type: "success", message: "Wishlist fetched" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to fetch wishlist" };
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Toggle wishlist item */
  const toggleWishlist = async ({ productId }) => {
    setLoadingAction(true);
    try {
      const existingItem = wishlist.find(item => item.product._id === productId);
      let data, message;

      if (existingItem) {
        data = await removeFromWishlist(existingItem._id);
        message = "Removed from wishlist";
      } else {
        data = await addToWishlist(productId);
        message = "Added to wishlist";
      }

      setWishlist(data?.wishlist?.items || []);
      return { type: "success", message };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to update wishlist" };
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loadingInitial,
        loadingAction,
        fetchWishlist,
        toggleWishlist,
        setWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
