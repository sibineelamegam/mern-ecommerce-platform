import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import { Box } from "@mui/material";

const PersistLogin = () => {
  const { loading } = useAuth(); // Get loading state from AuthContext

  return (
    <>
      {loading ? (
        // Show loading spinner while checking refresh token
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spinner />
        </Box>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
