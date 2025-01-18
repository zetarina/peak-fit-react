import React from "react";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  required = false,
}) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
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
    color: "#555",
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
    fontSize: "14px",
    color: "#333",
  },
};

export default Input;
