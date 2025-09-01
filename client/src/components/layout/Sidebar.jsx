import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt"; 
import { layoutStyles } from "../../styles/layoutStyles";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // auto-close on mobile
  };

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/admin/profile", label: "Profile", icon: <PersonIcon /> },
    { path: "/admin/users", label: "Users", icon: <PeopleIcon /> },
    { path: "/admin/products", label: "Products", icon: <InventoryIcon /> },
    { path: "/admin/categories", label: "Categories", icon: <CategoryIcon /> },
    { path: "/admin/orders", label: "Orders Management", icon: <ListAltIcon /> }, 
  ];

  const drawerContent = (
    <Box sx={layoutStyles.drawer}>
      <List>
        {links.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton onClick={() => handleNavigation(link.path)}>
              <ListItemIcon sx={{ color: "#fff" }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={open}
      sx={layoutStyles.drawerPaper}
      variant={isMobile ? "temporary" : "persistent"}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
