import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import home from "@/images/home.png";
import user from "@/images/user.png";
import mail from "@/images/mail.png";
import workout from "@/images/workout.png";
import limitation from "@/images/limitation.png";
import exit from "@/images/exit.png";

const sidebarItems = [
  { label: "Home Page", link: "/dashboard", icon: home },
  { label: "User Profile", link: "/dashboard/profile", icon: user },
  { label: "Manage Mails", link: "/dashboard/mails", icon: mail },
  { label: "Manage Workouts", link: "/dashboard/workouts", icon: workout },
  {
    label: "Manage Personalized Workouts",
    link: "/dashboard/personalizedworkout",
    icon: limitation,
  },
];

const DashboardLayout = () => {
  const { user, loading } = useUser(); // Get user data and user loading state from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  // If user data is still loading, show the loading screen
  if (loading) {
    return (
      <>
        {/* Injecting animations with a style tag */}
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
  
            @keyframes fade-in {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}
        </style>
  
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f0f8ff", // Soft blue background
            color: "#007bff", // Primary blue for text
            fontFamily: "'Arial', sans-serif",
            textAlign: "center",
            animation: "fade-in 1s ease-in-out", // Smooth fade-in
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
            Loading your data...
          </h1>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #007bff", // Spinner border color
              borderTop: "5px solid transparent", // Transparent top for spin effect
              borderRadius: "50%", // Circular shape
              animation: "spin 1s linear infinite", // Infinite spin animation
            }}
          />
          <p style={{ marginTop: "20px", fontSize: "1rem", color: "#555" }}>
            Please wait, we're preparing everything for you!
          </p>
        </div>
      </>
    );
  }
  

  // If the user is not approved, show the "under review" message
  if (!user?.isApproveUser) {
    return (
      <div style={styles.fullPageContainer}>
        <h1>Your profile is under review.</h1>
        <p>
          Once your account is approved, you'll be able to access the dashboard.
        </p>
      </div>
    );
  }

  const Header = () => (
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>
        PEAK FIT <span style={styles.hseparator}>|</span>
        <span style={styles.partnerText}>Partners</span>
      </h1>
    </header>
  );

  const Sidebar = ({ onLogout }) => (
    <aside style={styles.sidebar}>
      <nav>
        <ul style={styles.sidebarNav}>
          {sidebarItems.map((item, index) => (
            <li key={index} style={styles.sidebarNavItem}>
              <a href={item.link} style={styles.linkStyle}>
                <img src={item.icon} alt={item.label} style={styles.icon} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <hr style={styles.separator} />
        <ul style={styles.sidebarFooter}>
          <li
            style={{ ...styles.sidebarNavItem, color: "#d9534f" }}
            onClick={onLogout}
          >
            <a href="#" style={styles.linkStyle}>
              <img src={exit} alt="Logout" style={styles.icon} />
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );

  return (
    <div style={styles.dashboard}>
      <Header />
      <Sidebar onLogout={handleLogout} />
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  fullPageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    textAlign: "center",
  },
  verifyingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f7f7f7",
    color: "#333",
  },
  dashboard: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gridTemplateRows: "auto 1fr",
    minHeight: "100vh",
  },
  header: {
    gridColumn: "1 / -1",
    backgroundColor: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "20px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "24px",
    display: "inline",
  },
  hseparator: {
    margin: "30px",
  },
  partnerText: {
    fontWeight: "normal",
    marginLeft: "5px",
  },
  sidebar: {
    backgroundColor: "#f2f2f2",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    maxHeight: "calc(100vh - 70px)",
    overflowY: "auto",
  },

  sidebarNav: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  sidebarNavItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "10px",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
    color: "black",
  },
  sidebarNavItemHover: {
    backgroundColor: "#e0e0e0",
  },
  sidebarFooter: {
    listStyle: "none",
    padding: 0,
    marginTop: "auto",
  },
  separator: {
    border: "none",
    borderTop: "1px solid #7f8c8d",
    margin: "20px 0",
  },
  icon: {
    width: "24px",
    height: "24px",
    marginRight: "15px",
  },
  linkStyle: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
    fontWeight: "500",
    width: "100%",
    transition: "color 0.3s ease",
  },
  linkStyleHover: {
    color: "#1abc9c",
  },
  content: {
    backgroundColor: "#eaf6f6",
    overflowY: "auto",
    height: "100%",
    minHeight: "calc(100vh - 70px)",
    maxHeight: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
  },
};

export default DashboardLayout;
