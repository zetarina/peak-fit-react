import { Link, Outlet } from "react-router-dom";
const MainLayout = () => (
  <div className="container">
    <header className="header">
      <div className="logo">PEAK FIT</div>
      <nav className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/benefits">Benefits of Partnership</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>
      <div className="authButtons">
        <Link to="/login">
          <button className="loginButton">Login</button>
        </Link>
        <Link to="/SignUp">
          <button className="signUpButton">Sign Up</button>
        </Link>
      </div>
    </header>

    {/* Main Content */}
    <Outlet />

    {/* Footer */}
    <footer className="footer">
      <div className="footerContent">
        <div className="footerSection">
          <h3>MENU</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/benefits">Benefits of Partnership</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footerSection">
          <h3 className="followText">FOLLOW</h3>
          <div className="socialIcons">
            <a
              href="https://www.facebook.com/profile.php?id=61571267324956&mibextid=ZbWKwL"
              className="socialIcon facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/peakfit_app?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="socialIcon instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://x.com/PeakFit_App?t=ThN4wxWdqvY6Je_LiasMUA&s=09"
              className="socialIcon twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-x"></i>
            </a>
          </div>
        </div>

        <div className="footerSection">
          <h3>GET STARTED</h3>
          <Link to="/SignUp">Sign Up</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className="footerBottom">
        <p>© 2025 Peak Fit, Inc. All rights reserved.</p>
        <Link to="/privacypolicy">Privacy Policy</Link>
        <Link to="/terms">Terms & Conditions</Link>
      </div>
    </footer>
  </div>
);

export default MainLayout;
