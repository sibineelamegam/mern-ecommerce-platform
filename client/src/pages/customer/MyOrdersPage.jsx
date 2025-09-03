import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import { useOrders } from "../../context/OrderContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const MyOrdersPage = () => {
  const { orders, fetchMyOrders, loadingInitial } = useOrders();
  const { alert, setAlert, closeAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchMyOrders();
      } catch (err) {
        setAlert({ type: "error", message: "Failed to fetch orders", open: true });
      }
    };
    fetch();
  }, [fetchMyOrders, setAlert]);

  if (loadingInitial) return <Spinner />;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        My Orders
      </Typography>

      <AlertToast alert={alert} closeAlert={closeAlert} />

      {orders.length === 0 ? (
        <Typography sx={{ mt: 3 }}>You have no orders yet.</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/customer/orders/${order._id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default MyOrdersPage;
