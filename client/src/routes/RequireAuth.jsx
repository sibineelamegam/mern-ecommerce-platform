import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  // User is not authenticated
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated but not authorized
  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default RequireAuth;
