import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import Spinner from "../../components/common/Spinner";
import { useCategories } from "../../context/CategoryContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

const CategoryManagement = () => {
  const {
    fetchCategories,
    categories,
    loadingInitial,
    loadingAction,
    addCategory,
    updateCat,
    removeCategory,
  } = useCategories();
  const { alert, setAlert, closeAlert } = useAlert();

  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null,
    parentCategory: "",
  });

  /** Fetch Categories automatically on context mount */
  useEffect(() => {
    if (categories.length === 0)
      fetchCategories().then((res) => res && setAlert({ ...res, open: true }));
  }, [fetchCategories, categories.length, setAlert]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      const file = files[0];
      if (formData.imagePreview) URL.revokeObjectURL(formData.imagePreview);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditCategory(category);
      setFormData({
        name: category.name,
        image: null,
        imagePreview: null,
        parentCategory: category.parentCategory?._id || "",
      });
    } else {
      setEditCategory(null);
      setFormData({
        name: "",
        image: null,
        imagePreview: null,
        parentCategory: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
    if (formData.imagePreview) URL.revokeObjectURL(formData.imagePreview);
    setFormData({
      name: "",
      image: null,
      imagePreview: null,
      parentCategory: "",
    });
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      return setAlert({
        type: "error",
        message: "Name is required",
        open: true,
      });
    }
    if (!formData.image && !editCategory) {
      return setAlert({
        type: "error",
        message: "Image is required",
        open: true,
      });
    }

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", formData.image);
    if (formData.parentCategory)
      data.append("parentCategory", formData.parentCategory);

    let result;
    if (editCategory) result = await updateCat(editCategory._id, data);
    else result = await addCategory(data);

    setAlert({ ...result, open: true });
    handleCloseDialog();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    const result = await removeCategory(id);
    setAlert({ ...result, open: true });
  };

  const displayUpdatedInfo = (category) => {
    if (!category.updatedBy || !category.updatedAt) return "Not updated yet";
    if (
      new Date(category.updatedAt).getTime() ===
      new Date(category.createdAt).getTime()
    )
      return "Not updated yet";
    return `${category.updatedBy.name} (${
      category.updatedBy.email
    }) on ${new Date(category.updatedAt).toLocaleString()}`;
  };

  if (loadingInitial) return <Spinner />;

  return (
    <Box sx={{ m: 8 }}>
      <Typography variant="h6" gutterBottom>
        Category Management
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog()}
        sx={{ my: 3 }}
      >
        Add Category
      </Button>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      {categories.length === 0 ? (
        <Typography>No categories available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Parent Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated By</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.parentCategory?.name || "—"}</TableCell>
                  <TableCell>
                    {cat.image ? (
                      <img
                        src={`${UPLOADS_BASE_URL}/${cat.image}`}
                        alt={cat.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {cat.createdBy
                      ? `${cat.createdBy.name} (${cat.createdBy.email})`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{displayUpdatedInfo(cat)}</TableCell>
                  <TableCell>
                    {cat.updatedAt &&
                    new Date(cat.updatedAt).getTime() !==
                      new Date(cat.createdAt).getTime()
                      ? new Date(cat.updatedAt).toLocaleString()
                      : "Not updated yet"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(cat)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCategory(cat._id)}>
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
          {editCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            label="Parent Category"
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
          >
            <option value="">None (Parent Category)</option>
            {categories
              .filter((cat) => !editCategory || cat._id !== editCategory._id)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </TextField>
          <TextField
            margin="dense"
            label="Image"
            name="image"
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleInputChange}
          />
          {formData.imagePreview && (
            <Box mt={2}>
              <Typography variant="subtitle2">New Image Preview:</Typography>
              <img
                src={formData.imagePreview}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Box>
          )}
          {editCategory && editCategory.image && (
            <Box mt={2}>
              <Typography variant="subtitle2">Current Image:</Typography>
              <img
                src={`${UPLOADS_BASE_URL}/${editCategory.image}`}
                alt={editCategory.name}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Box>
          )}
          {editCategory && (
            <Box mt={2}>
              <Typography variant="subtitle2">
                Last updated: {displayUpdatedInfo(editCategory)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCategory}
            disabled={loadingAction}
            variant="contained"
          >
            {editCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
