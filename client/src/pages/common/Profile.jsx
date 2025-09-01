import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";

const Profile = () => {
  const { auth, setAuth, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
  });
  const [uiState, setUiState] = useState({
    saving: false,
    message: "",
    error: false,
  });

  // Extract fetchProfile so it can be reused
  const fetchProfile = async () => {
    if (loading) return; // wait for auth to load
    try {
      const data = await getProfile();
      setFormData(data.user || {});
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUiState({
        saving: false,
        message: "Failed to load profile",
        error: true,
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ saving: true, message: "", error: false });

    try {
      await updateProfile(formData);

      // Show success message
      setUiState({
        saving: false,
        message: "Profile updated successfully!",
        error: false,
      });

      // Automatically refetch the latest profile data
      await fetchProfile();
      setAuth(formData);

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setUiState((prev) => ({ ...prev, message: "" }));
      }, 3000);

    } catch (err) {
      console.error("Update failed:", err);
      setUiState({
        saving: false,
        message: "Failed to update profile",
        error: true,
      });
    }
  };

  if (loading) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, p: 2 }}>
      <Typography variant="h5" mb={5}>
        My Profile ({formData.role})
      </Typography>

      {uiState.message && (
        <Alert severity={uiState.error ? "error" : "success"} sx={{ mb: 2 }}>
          {uiState.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            disabled
            fullWidth
          />

          {formData.role === "admin" && (
            <TextField
              label="Role"
              value={formData.role}
              disabled
              fullWidth
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uiState.saving}
          >
            {uiState.saving ? "Saving..." : "Update Profile"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Profile;
