import { Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import ForgotPassword from "./pages/common/ForgotPassword";
import ResetPassword from "./pages/common/ResetPassword";
import Profile from "./pages/common/Profile";
import Dashboard from "./pages/admin/Dashboard";
import Unauthorized from "./pages/common/Unauthorized";
import NotFound from "./pages/common/NotFound";
import RequireAuth from "./routes/RequireAuth";
import AdminLayout from "./components/layout/AdminLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import CategoryManagement from "./pages/admin/CategoryManagement";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CustomerHome from "./pages/customer/CustomerHome";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import CartPage from "./pages/customer/CartPage";
import WishlistPage from "./pages/customer/WishlistPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import OrderDetailsPage from "./pages/customer/OrderDetailsPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/products/:id?" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />

        <Route element={<RequireAuth allowedRoles={["customer"]} />}>
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/customer/wishlist" element={<WishlistPage />} />
          <Route path="/customer/checkout" element={<CheckoutPage />} />
          <Route path="/customer/orders" element={<MyOrdersPage />} />
          <Route path="/customer/orders/:id" element={<OrderDetailsPage />} />
        </Route>
      </Route>

      <Route element={<AdminLayout />}>
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<OrderManagementPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
