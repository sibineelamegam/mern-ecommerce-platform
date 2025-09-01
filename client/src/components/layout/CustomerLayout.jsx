// src/components/layout/CustomerLayout.jsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";

const CustomerLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Customer Header now handles logout and alerts internally */}
      <CustomerHeader />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8 }}>
        {/* mt:8 pushes content below AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default CustomerLayout;
