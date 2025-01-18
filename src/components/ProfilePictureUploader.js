import React, { useRef } from "react";

const ProfilePictureUploader = ({ currentImage, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Check if the current image is a data URL
  const isDataURL = currentImage.startsWith("data:image/");
  const uniqueImageUrl = isDataURL
    ? currentImage
    : `${currentImage}?timestamp=${new Date().getTime()}`;

  return (
    <div style={styles.profilePictureContainer}>
      <img src={uniqueImageUrl} alt="Profile" style={styles.profilePicture} />
      <div style={styles.profileOverlay}>
        <button
          type="button"
          style={styles.profileButton}
          onClick={handleButtonClick}
        >
          Edit
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
};

export default ProfilePictureUploader;

const styles = {
  profilePictureContainer: {
    position: "relative",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    margin: "0 20px 0 0",
  },
  profilePicture: {
    width: "90%",
    height: "90%",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid black",
  },
  profileOverlay: {
    position: "absolute",
    bottom: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
  },
  profileButton: {
    backgroundColor: "#2b2b2b",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
};
