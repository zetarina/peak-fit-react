import React from "react";
import Mail from "@/images/gmail.png";

function Contact() {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h1 style={styles.header.h1}>Get in Touch</h1>
        <p style={styles.header.p}>
          Want to get in touch? We'd love to hear from you. Here's how you can
          reach us.
        </p>
      </div>
      <div style={styles.cards}>
        {/* Sales Section */}
        <div style={styles.card}>
          <div style={styles.icon}>
            <img
              src={Mail} // Ensure this image path is correct
              alt="Mail Icon"
              style={styles.icon.img}
            />
          </div>
          <h2 style={styles.cardHeader}>Talk to Us</h2>
          <p style={styles.cardText}>
            Interested in PeakFit's services? Just send us an email to chat with a member of our admin team.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=peakfit06@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            peakfit06@gmail.com
          </a>
        </div>

        {/* Location and Contact Section */}
        <div style={styles.card}>
          {/* Google Maps Embed */}
          <div style={styles.map}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.09281008662!2d103.77419305689548!3d1.2925723824883238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a1b9a76f8f7%3A0x2dbb3f56480eb02d!2sSingapore%20Institute%20of%20Management!5e0!3m2!1sen!2ssg!4v1614593687716!5m2!1sen!2ssg"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="SIM Location"
            ></iframe>
          </div>

          {/* Contact Details */}
          <div style={styles.contactInfo}>
            <h2 style={styles.cardHeader}>Global Headquarters</h2>
            <p style={styles.cardText}>
              Singapore Institute of Management <br />
              461 Clementi Rd, Singapore 599491 <br />
            </p>
            <p style={styles.cardText}>
              <strong>Email:</strong> <br />
              <a
                href="mailto:peakfit06@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                peakfit06@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  header: {
    h1: { fontSize: "2.5rem", color: "#333" },
    p: { fontSize: "1.1rem", color: "#555", marginTop: "10px" },
  },
  cards: {
    display: "flex",
    flexDirection: "column", // Stack items in a column
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "800px",
    textAlign: "center",
  },
  icon: {
    img: { width: "40px", height: "40px" },
  },
  cardHeader: { fontSize: "1.5rem", color: "#333", margin: "15px 0" },
  cardText: { fontSize: "1rem", color: "#666", marginBottom: "20px" },
  link: {
    display: "block",
    fontSize: "1rem",
    color: "#0073e6",
    textDecoration: "none",
    marginBottom: "10px",
  },
  map: { marginBottom: "20px" },
};

export default Contact;
