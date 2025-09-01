// pages/common/ForgotPassword.jsx
import { useState } from "react";
import { forgotPassword } from "../../api/authApi";
import { loginStyles } from "../../styles/loginStyles"; // reuse login styles
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [uiState, setUiState] = useState({
    isSubmitting: false,
    success: false,
    message: "",
    error: "",
  });

  const updateUiState = (key, value) => {
    setUiState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUiState("error", "");
    updateUiState("message", "");
    updateUiState("isSubmitting", true);

    try {
      const data = await forgotPassword({ email });
      updateUiState("success", true);
      updateUiState("message", data.message || "Reset link sent!");
      updateUiState("isSubmitting", false);
    } catch (err) {
      updateUiState("error", err.message || "Failed to send reset link");
      updateUiState("isSubmitting", false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h2 style={loginStyles.title}>Forgot Password</h2>

        {uiState.error && <p style={{ color: "red" }}>{uiState.error}</p>}
        {uiState.success && <p style={{ color: "green" }}>{uiState.message}</p>}

        {!uiState.success && (
          <form onSubmit={handleSubmit}>
            <div style={loginStyles.inputGroup}>
              <label style={loginStyles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {uiState.isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {uiState.isSubmitting && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Sending reset link, please wait...
          </p>
        )}

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" style={{ color: "#007bff" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
