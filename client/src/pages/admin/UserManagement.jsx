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
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import Spinner from "../../components/common/Spinner";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/userApi";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const { alert, setAlert, closeAlert } = useAlert();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data.users || []);
      setAlert({ ...data, open: true });
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setAlert({ type: "error", message: "Failed to fetch users", open: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      });
    } else {
      setEditUser(null);
      setFormData({ name: "", email: "", role: "", password: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
    setFormData({ name: "", email: "", role: "", password: "" });
  };

  const handleSaveUser = async () => {
    const { name, email, role, password } = formData;
    if (!name.trim() || !email.trim() || (!editUser && !password.trim())) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields",
        open: true,
      });
      return;
    }

    const payload = { name, email };
    if (password) payload.password = password;
    if (role) payload.role = role;

    setLoading(true);
    try {
      if (editUser) {
        await updateUser(editUser._id, payload);
        setAlert({
          type: "success",
          message: "User updated successfully",
          open: true,
        });
      } else {
        await createUser(payload);
        setAlert({
          type: "success",
          message: "User created successfully",
          open: true,
        });
      }
      await fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to save user:", err);
      setAlert({ type: "error", message: "Failed to save user", open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
      await fetchUsers();
      setAlert({
        type: "success",
        message: "User deleted successfully",
        open: true,
      });
    } catch (err) {
      console.error("Failed to delete user:", err);
      setAlert({ type: "error", message: "Failed to delete user", open: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box sx={{ m: 8 }}>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => handleOpenDialog()}
        sx={{ my: 3 }}
      >
        Add User
      </Button>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      {users.length === 0 ? (
        <Typography>No users available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.customerId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "user"}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user._id)}>
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
        <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {!editUser && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          )}
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
