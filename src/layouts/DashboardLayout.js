import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import home from "@/images/home.png";
import user from "@/images/user.png";
import mail from "@/images/mail.png";
import workout from "@/images/workout.png";
import limitation from "@/images/limitation.png";
import goal from "@/images/goal.png";
import exit from "@/images/exit.png";

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
  // {
  //   label: "Manage Goal Workouts",
  //   link: "/dashboard/goalpersonalisedworkout",
  //   icon: goal,
  // },
];

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    navigate("/login");
  };

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
