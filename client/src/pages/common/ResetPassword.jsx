// pages/common/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { loginStyles } from "../../styles/loginStyles";
import Spinner from "../../components/common/Spinner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // get token from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [uiState, setUiState] = useState({
    isSubmitting: false,
    success: false,
    error: "",
    message: "",
  });

  const updateUiState = (key, value) => {
    setUiState((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUiState("error", "");
    updateUiState("message", "");
    updateUiState("isSubmitting", true);

    if (formData.password !== formData.confirmPassword) {
      updateUiState("error", "Passwords do not match.");
      updateUiState("isSubmitting", false);
      return;
    }

    try {
      const data = await resetPassword({ token, password: formData.password });
      updateUiState("success", true);
      updateUiState("message", data.message || "Password reset successful!");
      updateUiState("isSubmitting", false);

      // Optional: Redirect to login after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      updateUiState("error", err.message || "Failed to reset password.");
      updateUiState("isSubmitting", false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h2 style={loginStyles.title}>Reset Password</h2>

        {uiState.error && <p style={{ color: "red" }}>{uiState.error}</p>}
        {uiState.success && <p style={{ color: "green" }}>{uiState.message}</p>}

        {!uiState.success && (
          <form onSubmit={handleSubmit}>
            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>New Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={loginStyles.input}
                disabled={uiState.isSubmitting}
              />
            </div>

            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
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
              {uiState.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" style={{ color: "#007bff" }}>
            Back to Login
          </Link>
        </p>

        {uiState.isSubmitting && <Spinner />}
      </div>
    </div>
  );
};

export default ResetPassword;
