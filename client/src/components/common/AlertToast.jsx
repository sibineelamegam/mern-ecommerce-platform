// components/common/AlertToast.jsx
import { Snackbar, Alert } from "@mui/material";

export default function AlertToast({ alert, closeAlert }) {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={alert.type} onClose={closeAlert} variant="filled">
        {alert.message}
      </Alert>
    </Snackbar>
  );
}
