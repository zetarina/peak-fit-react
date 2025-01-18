import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const authToken =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  if (!authToken) {
    console.log("No token found");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Expired token");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
