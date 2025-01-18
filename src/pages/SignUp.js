import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";
import Running from "@/images/running.png";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "react-toastify";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [businessCertification, setBusinessCertification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setBusinessCertification(file);
      toast.dismiss(); // Dismiss any lingering errors
    } else {
      toast.error("Only PDF files are allowed for business certification.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (!businessCertification) {
      return toast.error("Business certification file is required.");
    }

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("businessCertification", businessCertification);

    setLoading(true);

    try {
      const response = await ApiService.postMultipart("/auth/signup", formData);
      toast.success("Sign up successful! Please verify your account.");
      setVerificationEmail(form.email);
      setShowVerifyModal(true);
    } catch (err) {
      toast.error(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    setLoading(true);

    try {
      const { authToken } = await ApiService.post("/auth/verify-signup", {
        email: verificationEmail,
        code: verificationCode,
      });
      localStorage.setItem("authToken", authToken);
      toast.success("Account verified successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to verify. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      await ApiService.post("/auth/resend-code", { email: verificationEmail });
      toast.success(
        "Verification code resent successfully. Please check your email."
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Sign Up</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username *</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <PasswordInput
              label="Password *"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
              style={styles.input} // Make sure it's using the same style as other inputs
            />
            <p style={styles.passwordGuideline}>
              Password must be at least 8 characters long, including a number, an uppercase letter, and a special character.
            </p>
          </div>
          <div style={styles.formGroup}>
            <PasswordInput
              label="Confirm Password *"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              required
              style={styles.input} // Ensure the confirm password box is consistent
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Certification (PDF) *</label>
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted((prev) => !prev)}
              style={{ marginRight: "10px" }}
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms-and-conditions" style={styles.link}>Terms & Conditions</a> and <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>.
            </label>
          </div>
          <button type="submit" style={styles.button} disabled={loading || !termsAccepted}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Links Below */}
        <div style={styles.linkContainer}>
          <p>
            Already have an account?{" "}
            <a href="/login" style={styles.link}>Login</a>
          </p>
        </div>
      </div>

      {showVerifyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Verify Your Account</h3>
            <p>
              Enter the verification code sent to your email or click the link
              in the email.
            </p>
            <div style={styles.formGroup}>
              <label>Verification Code *</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={styles.input}
              />
            </div>
            <button
              onClick={handleCodeVerification}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              onClick={handleResendCode}
              style={styles.resendButton}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend Code"}
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
  formContainer: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: { textAlign: "center", marginBottom: "20px" },
  formGroup: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resendButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  passwordGuideline: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#777",
  },
  linkContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
};

export default SignUp;