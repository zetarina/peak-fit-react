import React, { useState } from "react";
import eyeOpen from "@/images/view.png";
import eyeClosed from "@/images/hide.png";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "Enter your password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        {!disabled && (
          <button
            type="button"
            style={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle Password"
              style={styles.eyeIcon}
            />
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  toggleButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  eyeIcon: {
    width: "20px",
    height: "20px",
  },
};

export default PasswordInput;
