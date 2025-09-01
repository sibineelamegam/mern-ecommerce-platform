import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import cartStyles from "../../styles/cart";
import Spinner from "../../components/common/Spinner";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const CartPage = () => {
  const {
    cart,
    loadingInitial,
    loadingAction,
    incrementItem,
    decrementItem,
    removeItem,
    clearAll,
    totalPrice,
  } = useCart();

  const { alert, setAlert, closeAlert } = useAlert();
  const navigate = useNavigate();

  if (loadingInitial) return <Spinner />;

  // Handlers
  const handleIncrement = async (id) => {
    const result = await incrementItem(id);
    setAlert({ ...result, open: true });
  };

  const handleDecrement = async (id) => {
    const result = await decrementItem(id);
    setAlert({ ...result, open: true });
  };

  const handleRemove = async (id) => {
    const result = await removeItem(id);
    setAlert({ ...result, open: true });
  };

  const handleClearAll = async () => {
    const result = await clearAll();
    setAlert({ ...result, open: true });
  };

  return (
    <Box sx={cartStyles.container}>
      {/* Local Cart Alerts */}
      <AlertToast alert={alert} closeAlert={closeAlert} />

      {/* Empty Cart */}
      {(!cart || cart.length === 0) ? (
        <Typography sx={cartStyles.message}>Your cart is empty.</Typography>
      ) : (
        <>
          <Typography variant="h5" sx={cartStyles.title}>
            My Cart
          </Typography>

          {cart.map((item) => {
            const outOfStock = item.quantity > (item.product?.stock || 0);
            return (
              <Box key={item._id} sx={cartStyles.itemRow}>
                {/* Product Image */}
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_UPLOADS_BASE_URL}/${item.product?.images?.[0]}`}
                  alt={item.product?.name || "Product"}
                  sx={cartStyles.image}
                />

                {/* Product Details */}
                <Box sx={cartStyles.itemDetails}>
                  <Typography variant="subtitle1">{item.product?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.product?.price}
                  </Typography>

                  <Box sx={cartStyles.actions}>
                    <IconButton
                      size="small"
                      onClick={() => handleDecrement(item._id)}
                      disabled={loadingAction || item.quantity <= 1 || outOfStock}
                    >
                      <Remove />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleIncrement(item._id)}
                      disabled={
                        loadingAction ||
                        outOfStock ||
                        item.quantity >= (item.product?.stock || 0)
                      }
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {item.product?.stock - item.quantity} left in stock
                  </Typography>
                </Box>

                {/* Price & Remove */}
                <Box sx={cartStyles.rightSection}>
                  <Typography>
                    ${(item.product?.price || 0) * item.quantity}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(item._id)}
                    disabled={loadingAction || outOfStock}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          {/* Cart Summary */}
          <Box sx={cartStyles.summary}>
            <Typography variant="h6">Total: ${totalPrice}</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/customer/checkout")}
                disabled={loadingAction}
              >
                Checkout
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAll}
                disabled={
                  loadingAction ||
                  cart.some((item) => item.quantity > (item.product?.stock || 0))
                }
              >
                Clear Cart
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartPage;
