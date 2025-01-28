import React from "react";

const LoadingOverlay = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <>
      {/* Inject keyframes for animations */}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(5px)",
  },
  spinnerContainer: {
    textAlign: "center",
    color: "#fff",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #fff",
    borderTop: "5px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "10px",
  },
  message: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "500",
    color: "#fff",
  },
};

export default LoadingOverlay;
