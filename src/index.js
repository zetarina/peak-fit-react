import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
// Create the root using createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside the BrowserRouter
root.render(
  <BrowserRouter>
    <App />
    <ToastContainer />
  </BrowserRouter>
);
