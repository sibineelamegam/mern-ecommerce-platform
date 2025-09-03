import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

export const CategoryContext = createContext();
export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true); 
  const [loadingAction, setLoadingAction] = useState(false); 

  /** Fetch all categories */
  const fetchCategories = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const data = await getAllCategories();
      setCategories(data?.categories || []);
      return { type: "success", message: "categories fetched" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to fetch categories" };
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  /** Create a new category */
  const addCategory = async (formData) => {
    setLoadingAction(true);
    try {
      const created = await createCategory(formData);
      setCategories((prev) => [...prev, created.category]);
      return { type: "success", message: "Category created" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to create category" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Update a category */
  const updateCat = async (id, formData) => {
    setLoadingAction(true);
    try {
      const updated = await updateCategory(id, formData);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? updated.category : cat))
      );
      return { type: "success", message: "Category updated" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to update category" };
    } finally {
      setLoadingAction(false);
    }
  };

  /** Delete a category */
  const removeCategory = async (id) => {
    setLoadingAction(true);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      return { type: "success", message: "Category deleted" };
    } catch (err) {
      console.error(err);
      return { type: "error", message: "Failed to delete category" };
    } finally {
      setLoadingAction(false);
    }
  };


  return (
    <CategoryContext.Provider
      value={{
        categories,
        loadingInitial,
        loadingAction,
        fetchCategories,
        addCategory,
        updateCat,
        removeCategory,
        setCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
