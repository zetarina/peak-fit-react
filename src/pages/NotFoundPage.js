import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.subheading}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <button style={styles.button} onClick={() => navigate("/")}>
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "96px",
    color: "#343a40",
    fontWeight: "bold",
    margin: "0",
  },
  subheading: {
    fontSize: "20px",
    color: "#6c757d",
    margin: "10px 0 20px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
};
