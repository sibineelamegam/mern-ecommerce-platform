import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Spinner from "../../components/common/Spinner";
import { useOrders } from "../../context/OrderContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { orders, getOrder, loadingAction } = useOrders();
  const { alert, setAlert, closeAlert } = useAlert();

  // Find order in context
  const order = orders.find((o) => o._id === id);

  // Fetch order on mount if missing
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!order) await getOrder(id);
      } catch (err) {
        setAlert({
          type: "error",
          message: "Failed to fetch order",
          open: true,
        });
      }
    };
    fetchOrder();
  }, [id, order, getOrder, setAlert]);

  if (loadingAction || !order) return <Spinner />;

  const formatPrice = (price) => (price != null ? price.toFixed(2) : "0.00");

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Order Details
      </Typography>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      {/* Order Summary */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography>
          <strong>Order ID:</strong> {order.orderId}
        </Typography>
        <Typography>
          <strong>Status:</strong>{" "}
          {order.status
            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
            : "Unknown"}
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "Unknown"}
        </Typography>
        <Typography>
          <strong>Total:</strong> ${formatPrice(order.totalPrice)}
        </Typography>
      </Paper>

      {/* Shipping Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Shipping Info</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography>{order.shippingInfo?.address || "N/A"}</Typography>
        <Typography>
          {order.shippingInfo?.city || "N/A"},{" "}
          {order.shippingInfo?.country || "N/A"}
        </Typography>
        <Typography>{order.shippingInfo?.phone || "N/A"}</Typography>
      </Paper>

      {/* Items */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Items</Typography>
        <Divider sx={{ my: 1 }} />
        <List>
          {order.items.map((item) => {
            const productName = item.name || "Unknown Product";
            const price = item.price ?? 0;
            const subtotal = price * (item.quantity || 0);
            const productImage = item.product?.images?.[0];

            return (
              <ListItem key={item._id} divider>
                <ListItemText
                  primary={`${productName} x${item.quantity || 0}`}
                  secondary={`$${formatPrice(
                    price
                  )} each | Subtotal: $${formatPrice(subtotal)}`}
                />
                {productImage ? (
                  <Box
                    component="img"
                    src={`${
                      import.meta.env.VITE_UPLOADS_BASE_URL
                    }/${productImage}`}
                    alt={productName}
                    sx={{ width: 60, height: 60, ml: 2, borderRadius: 1 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      ml: 2,
                      borderRadius: 1,
                      bgcolor: "grey.300",
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default OrderDetailsPage;
