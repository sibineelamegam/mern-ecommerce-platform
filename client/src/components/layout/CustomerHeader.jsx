import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../api/authApi";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const CustomerHeader = () => {
  const { auth, setAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { alert, setAlert, closeAlert } = useAlert();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navigateTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuth(null);
      setAlert({
        type: "success",
        message: "Logged out successfully",
        open: true,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
      setAlert({ type: "error", message: "Logout failed", open: true });
    } finally {
      handleMenuClose();
    }
  };

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            MyShop
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {auth ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={() => navigate("/customer/wishlist")}
                >
                  <Badge badgeContent={wishlistCount} color="secondary">
                    <FavoriteIcon
                      sx={{ color: wishlistCount ? "#db9be7ff" : "inherit" }}
                    />
                  </Badge>
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={() => navigate("/customer/cart")}
                >
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <Avatar
                  onClick={handleMenuOpen}
                  sx={{ bgcolor: "secondary.main", cursor: "pointer" }}
                >
                  {auth.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => navigateTo("/customer/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigateTo("/customer/orders")}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default CustomerHeader;
