import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import { loginStyles } from "../../styles/loginStyles";
import Spinner from "../../components/common/Spinner";

const Login = () => {
  const { auth, setAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [uiState, setUiState] = useState({
    error: "",
    isSubmitting: false,
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState({ error: "", isSubmitting: true, success: false });

    try {
      const data = await loginUser(formData);
      const user = data?.user;

      if (user) {
        setAuth(user);
        setUiState({ error: "", isSubmitting: false, success: true });
      } else {
        setUiState({
          error: "Login failed. No user data returned.",
          isSubmitting: false,
          success: false,
        });
      }
    } catch (err) {
      setUiState({
        error: err.message || "Login failed. Please check your credentials.",
        isSubmitting: false,
        success: false,
      });
    }
  };

  // Updated redirect logic based on role
  useEffect(() => {
    if (uiState.success && auth) {
      let redirectPath;

      if (auth.role === "admin") {
        redirectPath = "/dashboard"; // admin dashboard
      } else if (auth.role === "customer") {
        redirectPath = "/"; // customer portal index
      } else {
        redirectPath = "/login"; // fallback for unknown role
      }

      const timer = setTimeout(() => {
        if (redirectPath !== location.pathname) {
          navigate(redirectPath, { replace: true });
        }
      }, 2000); // short delay for UX

      return () => clearTimeout(timer);
    }
  }, [uiState.success, auth, navigate, location.pathname]);

  if (authLoading) return <Spinner />;

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h2 style={loginStyles.title}>Login</h2>

        {uiState.error && (
          <p style={{ ...loginStyles.message, color: "red" }}>
            {uiState.error}
          </p>
        )}

        {uiState.success ? (
          <div style={{ ...loginStyles.message, color: "green" }}>
            Login successful! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
                style={loginStyles.input}
                disabled={uiState.isSubmitting}
              />
            </div>

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={loginStyles.input}
                disabled={uiState.isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={uiState.isSubmitting}
              style={{
                ...loginStyles.button,
                opacity: uiState.isSubmitting ? 0.7 : 1,
                cursor: uiState.isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {uiState.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {!uiState.success && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p>
              <Link to="/forgot-password" style={{ color: "#007bff" }}>
                Forgot Password?
              </Link>
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#007bff" }}>
                Register
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
