import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import Spinner from "../../components/common/Spinner";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const CheckoutPage = () => {
  const { cart, loadingInitial: cartLoading, clearAll, setCart } = useCart();
  const { products, fetchProductById, loadingInitial: productLoading } =
    useProducts();
  const { placeOrder } = useOrders();
  const { alert, setAlert, closeAlert } = useAlert();

  const navigate = useNavigate();
  const location = useLocation();
  const singleProductId = location.state?.productId;

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    country: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch single product if visiting via Buy Now
  useEffect(() => {
    if (singleProductId) fetchProductById(singleProductId);
  }, [singleProductId, fetchProductById]);

  const singleProduct = singleProductId
    ? products.find((p) => p._id === singleProductId)
    : null;

  const checkoutItems = singleProductId
    ? singleProduct
      ? [{ product: singleProduct, quantity: 1 }]
      : []
    : cart;

  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartLoading || productLoading) return <Spinner />;

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>
        Your cart is empty. Add some products before checkout.
      </Typography>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await placeOrder({
        cart: checkoutItems,
        shippingInfo,
        totalPrice,
      });

      // Show alert based on result
      setAlert({ ...result, open: true });

      if (result.type === "success") {
        if (!singleProductId) {
          await clearAll();
          setCart([]);
        }
        navigate("/customer/orders", { state: { fromCheckout: true } });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to place order. Please try again.",
        open: true,
      });
      console.error("Failed to place order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <Typography variant="h5" gutterBottom>
        Checkout
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <form onSubmit={handleSubmit}>
          {["address", "city", "country", "phone"].map((field) => (
            <TextField
              key={field}
              fullWidth
              margin="normal"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={shippingInfo[field]}
              onChange={handleChange}
              required
            />
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Order Summary</Typography>
          {checkoutItems.map((item) => (
            <Box
              key={item.product._id}
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>{item.product?.name}</Typography>
              <Typography>
                {item.quantity} × ${item.product?.price}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ${totalPrice}</Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={submitting}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CheckoutPage;
