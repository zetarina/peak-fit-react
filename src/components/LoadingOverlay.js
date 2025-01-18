import React from "react";

const LoadingOverlay = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.spinnerContainer}>
        <div className="spinner"></div>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  spinnerContainer: {
    textAlign: "center",
    color: "#fff",
  },
  message: {
    marginTop: "10px",
    fontSize: "16px",
  },
};

export default LoadingOverlay;
