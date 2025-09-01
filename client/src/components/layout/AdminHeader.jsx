import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const AdminHeader = ({ onMenuClick }) => {
  const { auth, setAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { alert, setAlert, closeAlert } = useAlert();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuth(null); // clear frontend auth
      setAlert({ type: "success", message: "Logged out successfully", open: true });
      navigate("/login", { replace: true, state: {} });
    } catch (err) {
      console.error("Logout failed", err);
      setAlert({ type: "error", message: "Logout failed", open: true });
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Admin Portal</Typography>
          <Box onClick={handleMenu}>
            <Avatar>{auth?.name?.[0] || "U"}</Avatar>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>
              <Box>
                <Typography>{auth?.name || "Unknown"}</Typography>
                <Typography variant="body2">{auth?.email || "No email"}</Typography>
                <Typography variant="body2">{auth?.role || "No role"}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AdminHeader;
