import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Running from "@/images/running.png";
import ApiService from "@/services/ApiService";
import FirebaseService from "@/services/FirebaseService";
import LoadingOverlay from "@/components/LoadingOverlay";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingMessage("Logging you in...");
    setLoading(true);

    try {
      const { token: firebaseToken } = await FirebaseService.login(
        form.email,
        form.password
      );

      if (!firebaseToken) {
        throw new Error(
          "Authentication failed. Please check your credentials."
        );
      }

      const { authToken, user } = await ApiService.post("/auth/login", {
        token: firebaseToken,
      });

      if (!authToken) {
        throw new Error("Failed to retrieve session token. Please try again.");
      }

      if (rememberMe) {
        localStorage.setItem("authToken", authToken);
      } else {
        sessionStorage.setItem("authToken", authToken);
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoadingMessage("Sending password reset link to your email...");
    setLoading(true);

    try {
      const { message } = await ApiService.post("/auth/forget-password", {
        email: resetEmail,
      });
      toast.success(message || "Password reset link sent to your email.");
      setShowResetModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <LoadingOverlay isLoading={loading} message={loadingMessage} />
      <div style={styles.card}>
        <h2 style={styles.header}>Welcome Back!</h2>
        <p style={styles.subHeader}>Log in to access your account</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" style={styles.checkboxLabel}>
              Remember Me
            </label>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={styles.footer}>
          <button
            style={styles.linkButton}
            onClick={() => setShowResetModal(true)}
          >
            Forgot Password?
          </button>
          <button style={styles.linkButton} onClick={() => navigate("/signup")}>
            Create Account
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeader}>Reset Password</h3>
            <p style={styles.modalText}>
              Enter your email to receive a password reset link.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button
              onClick={handlePasswordReset}
              style={styles.button}
              disabled={loading}
            >
              Send Reset Link
            </button>
            <button
              onClick={() => setShowResetModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `url(${Running}) no-repeat center center`,
    backgroundSize: "cover",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    width: "400px",
  },
  header: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  subHeader: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
  },
  form: { textAlign: "left" },
  formGroup: { marginBottom: "15px" },
  label: { marginBottom: "5px", display: "block", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  checkboxLabel: { marginLeft: "8px" },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  cancelButton: {
    marginTop: "10px",
    backgroundColor: "#f44336",
    color: "#fff",
    borderRadius: "6px",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  },
  footer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007BFF",
    fontSize: "14px",
    textDecoration: "underline",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    width: "400px",
  },
  modalHeader: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#333",
  },
  modalText: { marginBottom: "20px", color: "#555" },
  error: { color: "red", marginTop: "10px", textAlign: "center" },
};

export default Login;
