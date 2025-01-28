import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/contexts/UserContext"; // Import your UserProvider

// Create the root using createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

// Wrap your app with UserProvider
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </BrowserRouter>
);
