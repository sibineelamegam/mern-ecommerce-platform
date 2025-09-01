import { createContext, useContext, useState, useCallback } from "react";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

export const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true); 
  const [loadingAction, setLoadingAction] = useState(false); 

  /** Fetch all products, optionally filtered by category */
  const fetchProducts = useCallback(async (categoryId = null) => {
    setLoadingInitial(true);
    try {
      const data = await getAllProducts(categoryId);
      setProducts(data.products || []);
      return { type: "success", message: "Products fetched" };
    } catch (err) {
      console.error(err);
      setProducts([]);
      return { type: "error", message: "Failed to fetch products" };
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Fetch single product by ID  */
  const fetchProductById = useCallback(async (id) => {
    setLoadingAction(true);
    try {
      const data = await getProductById(id);
      setProducts(prev => {
        const exists = prev.find(p => p._id === id);
        return exists
          ? prev.map(p => (p._id === id ? data.product : p))
          : [...prev, data.product];
      });
      return { type: "success", message: "Product fetched" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to fetch product" };
    } finally {
      setLoadingAction(false);
    }
  }, []);

  /** Create a new product */
  const addProduct = async (formData) => {
    setLoadingAction(true);
    try {
      const { product: newProduct } = await createProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      return { type: "success", message: "Product created" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to create product" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Update an existing product */
  const updateProd = async (id, formData) => {
    setLoadingAction(true);
    try {
      const { product: updated } = await updateProduct(id, formData);
      setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
      return { type: "success", message: "Product updated" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to update product" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Delete a product */
  const removeProduct = async (id) => {
    setLoadingAction(true);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      return { type: "success", message: "Product deleted" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to delete product" };
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loadingInitial,
        loadingAction,
        fetchProducts,
        fetchProductById,
        addProduct,
        updateProd,
        removeProduct,
        setProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
