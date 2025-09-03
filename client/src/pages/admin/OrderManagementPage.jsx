import { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import Spinner from "../../components/common/Spinner";
import { useOrders } from "../../context/OrderContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const OrderManagementPage = () => {
  const {
    orders,
    loadingInitial,
    loadingAction,
    fetchAllOrders,
    updateStatus,
  } = useOrders();
  const { alert, setAlert, closeAlert } = useAlert();

  // Fetch orders on mount if not loaded
  useEffect(() => {
    if (orders.length === 0) {
      fetchAllOrders().then((res) => res && setAlert({ ...res, open: true }));
    }
  }, [fetchAllOrders, orders.length, setAlert]);

  const handleStatusChange = async (id, status) => {
    const res = await updateStatus(id, status);
    if (res) setAlert({ ...res, open: true });
  };

  if (loadingInitial) return <Spinner />;

  const formatPrice = (price) => (price != null ? price.toFixed(2) : "0.00");

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 6, p: 2 }}>
      <Typography variant="h6" mb={4}>
        Order Management
      </Typography>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      <Paper sx={{ width: "100%", overflowX: "auto", p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total ($)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Products</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No orders available.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.user?.name || "Unknown"}</TableCell>
                    <TableCell>{order.shippingInfo?.address}</TableCell>
                    <TableCell>{order.shippingInfo?.city}</TableCell>
                    <TableCell>{order.shippingInfo?.country}</TableCell>
                    <TableCell>{order.shippingInfo?.phone}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={loadingAction}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {order.items
                        .map(
                          (item) =>
                            `${item.product?.name || item.name} x${
                              item.quantity || 0
                            }`
                        )
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderManagementPage;
