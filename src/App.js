import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Components
import Home from "./pages/Home";
import About from "./pages/About";
import Benefits from "./pages/Benefits";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/Term";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProfilePage from "./pages/dashboard/Profile";
import Mails from "./pages/dashboard/Mails";
import Workout from "./pages/dashboard/Workout";
import PersonalisedWorkout from "./pages/dashboard/PersonalisedWorkout";
import Approval from "./pages/dashboard/Approval";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import VerifyWithLink from "./pages/Verify";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<VerifyWithLink />} />
        <Route path="/about" element={<About />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsOfService />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Approval />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="mails" element={<Mails />} />
        <Route path="workouts" element={<Workout />} />
        <Route path="personalizedworkout" element={<PersonalisedWorkout />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>

      {/* Fallback Route */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default App;
