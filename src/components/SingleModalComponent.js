import React from "react";
import PropTypes from "prop-types";

const SingleModalComponent = ({
  show,
  onClose,
  title,
  children,
  onSave,
  onCancel,
}) => {
  if (!show) return null;

  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    transition: "background-color 0.3s ease",
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform 0.3s ease",
  };

  const modalContentStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowY: "auto",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px 8px 0 0",
    fontSize: "18px",
  };

  const footerStyle = {
    padding: "10px 15px",
    backgroundColor: "#f7f7f7",
    borderTop: "1px solid #eee",
    textAlign: "right",
    borderRadius: "0 0 8px 8px",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
  };

  const buttonCloseStyle = {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#fff",
    cursor: "pointer",
    transition: "color 0.3s ease",
  };

  return (
    <>
      <div style={modalBackdropStyle} onClick={onClose}></div>
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <div style={headerStyle}>
            <h3>{title}</h3>
            <button onClick={onClose} style={buttonCloseStyle}>
              ×
            </button>
          </div>
          <div style={{ flex: 1, padding: "20px" }}>{children}</div>
          <div style={footerStyle}>
            {/* {onCancel && (
              <button onClick={onCancel} style={cancelButtonStyle}>
                Cancel
              </button>
            )} */}
            {onSave && (
              <button onClick={onSave} style={buttonStyle}>
                Save
              </button>
            )}
            <button onClick={onClose} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SingleModalComponent.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default SingleModalComponent;
