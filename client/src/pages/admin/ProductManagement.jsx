import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Spinner from "../../components/common/Spinner";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;
const normalizedUrl = UPLOADS_BASE_URL.replace(/\/$/, "");

const ProductManagement = () => {
  const {
    products,
    loadingInitial,
    loadingAction,
    addProduct,
    fetchProducts,
    updateProd,
    removeProduct,
  } = useProducts();
  const { categories } = useCategories();
  const { alert, setAlert, closeAlert } = useAlert();

  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts().then((res) => res && setAlert({ ...res, open: true }));
  }, [fetchProducts, setAlert]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
    if (name === "image" && !files?.length && fileInputRef.current)
      fileInputRef.current.value = null;
  };

  const resetForm = () => {
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category?._id || "",
        image: null,
      });
    } else resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSaveProduct = async () => {
    const { name, description, price, stock, category, image } = formData;
    if (!name || !description || !price || !stock || !category) {
      setAlert({
        type: "error",
        message: "All fields are required",
        open: true,
      });
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", price);
    data.append("stock", stock);
    data.append("category", category);
    if (image) data.append("image", image);

    if (editProduct)
      await updateProd(editProduct._id, data).then(
        (res) => res && setAlert({ ...res, open: true })
      );
    else
      await addProduct(data).then(
        (res) => res && setAlert({ ...res, open: true })
      );

    handleCloseDialog();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await removeProduct(id).then(
      (res) => res && setAlert({ ...res, open: true })
    );
  };

  if (loadingInitial) return <Spinner />;

  return (
    <Box sx={{ m: 8 }}>
      <Typography variant="h6" gutterBottom>
        Product Management
      </Typography>
      <Box sx={{ display: "flex", gap: 2, my: 3 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </Box>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      {products.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.productId}</TableCell>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.description}</TableCell>
                  <TableCell>{prod.price}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>{prod.category?.name || "N/A"}</TableCell>
                  <TableCell>
                    {prod.images?.length > 0 ? (
                      <img
                        src={`${normalizedUrl}/${prod.images[0]}`}
                        alt={prod.name}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenDialog(prod)}
                      disabled={loadingAction}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteProduct(prod._id)}
                      disabled={loadingAction}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            label="Category"
            name="category"
            fullWidth
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="dense"
            label="Image"
            name="image"
            type="file"
            fullWidth
            inputRef={fileInputRef}
            InputLabelProps={{ shrink: true }}
            onChange={handleInputChange}
          />

          {editProduct && editProduct.images?.[0] && !formData.image && (
            <Box mt={2}>
              <Typography variant="subtitle2">Current Image:</Typography>
              <img
                src={`${normalizedUrl}/${editProduct.images[0]}`}
                alt={editProduct.name}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            disabled={loadingAction}
          >
            {editProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
