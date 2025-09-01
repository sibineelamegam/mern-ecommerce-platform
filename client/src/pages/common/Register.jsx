// src/pages/admin/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", // ✅ should be "name" not "username"
    email: "",
    password: "",
  });

  const [uiState, setUiState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ loading: true, error: "", success: "" });

    try {
      await registerUser(formData);
      setUiState({
        loading: false,
        success: "User registered successfully!",
        error: "",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setUiState({
        loading: false,
        error: err.message || "Registration failed",
        success: "",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        mx: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Admin Register
      </Typography>

      {uiState.error && <Alert severity="error">{uiState.error}</Alert>}
      {uiState.success && <Alert severity="success">{uiState.success}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, width: "100%", maxWidth: 400 }}
      >
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={uiState.loading}
          startIcon={uiState.loading && <CircularProgress size={20} />}
        >
          {uiState.loading ? "Registering..." : "Register"}
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
