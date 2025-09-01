// src/pages/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "./AdminHeader";
import Sidebar from "./Sidebar";
import { layoutStyles } from "../../styles/layoutStyles";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* Header now internally handles alerts, no need to pass handleLogout */}
      <Header onMenuClick={handleSidebarToggle} />

      <Box component="main" sx={layoutStyles.main(sidebarOpen, isMobile)}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
