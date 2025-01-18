import React, { useState, useEffect } from "react";
import profile from "@/images/profile.png";
import upload from "@/images/upload.png";
import bin from "@/images/bin.png";
import ApiService from "@/services/ApiService";
import { toast } from "react-toastify";
import LoadingOverlay from "@/components/LoadingOverlay";
import PasswordInput from "@/components/PasswordInput";
import Input from "@/components/Input";
import ProfilePictureUploader from "@/components/ProfilePictureUploader";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [certifications, setCertifications] = useState([]);
  const [profileImage, setProfileImage] = useState(profile);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.safeGet("/me/my-account");
        console.log(response);
        setUserData(response.user);
        setFormData({
          username: response.user.username || "",
          email: response.user.email || "",
          password: "",
          confirmPassword: "",
        });
        setProfileImage(response.user.profileImage || profile);
        setCertifications(response.user.businessCertification || []);
      } catch (err) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        username: userData?.username || "",
        email: userData?.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleFileChange = async (event) => {
    const input = event.target;
    const files = Array.from(input.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const response = await ApiService.safePostMultipart(
        "/me/upload-certifications",
        formData
      );

      if (response.certifications) {
        setCertifications(response.certifications);
        toast.success("Certifications uploaded successfully.");
      } else {
        toast.error("Failed to upload certifications.");
      }

      input.value = "";
    } catch (err) {
      toast.error("Failed to upload certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertification = async (certification) => {
    setLoading(true);
    try {
      const response = await ApiService.safePut("/me/delete-certification", {
        data: { certification },
      });

      if (response.certifications) {
        setCertifications(response.certifications);
        toast.success("Certification deleted successfully.");
      } else {
        toast.error("Failed to delete certification. No certifications found.");
      }
    } catch (err) {
      toast.error("Failed to delete certification.");
    } finally {
      setLoading(false);
    }
  };
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0]; // Safely access the first file
    console.log(file);
    if (!file) {
      toast.error("No file selected. Please choose a file to upload.");
      return;
    }

    // Ensure the file type is valid (optional)
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Invalid file type. Only PNG and JPEG are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    setLoading(true);
    try {
      const response = await ApiService.safePostMultipart(
        "/me/upload-profile-picture",
        formData
      );
      console.log(response);
      if (response.user) {
        setFormData({
          username: response.user.username || "",
          email: response.user.email || "",
          password: "",
          confirmPassword: "",
        });
        setProfileImage(response.user.profileImage || profile);
        setCertifications(response.user.businessCertification || []);
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to update profile picture.");
      }
    } catch (err) {
      toast.error("Error uploading profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.safePut("/me/update-profile", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setUserData(response.user);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.container}>
        <LoadingOverlay isLoading={loading} message="Loading..." />
        <h1 style={styles.title}>My Profile</h1>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <div style={styles.personalInfoContainer}>
              <ProfilePictureUploader
                currentImage={profileImage ? profileImage : profile}
                onFileChange={handleProfilePictureChange}
              />

              <div style={styles.fieldGroup}>
                <div style={styles.fieldRow}>
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div style={styles.fieldRow}>
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div style={styles.btnBox}>
              <button
                type="button"
                style={styles.editButton}
                onClick={handleEditToggle}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button type="submit" style={styles.saveButton}>
                  Save
                </button>
              )}
            </div>
          </form>
        </section>
        <section style={styles.section}>
          <h3 style={styles.subTitle}>
            Business Certifications
            <label htmlFor="file-upload" style={styles.uploadIcon}>
              <img src={upload} alt="Upload" style={styles.uploadImage} />
            </label>
          </h3>
          <input
            id="file-upload"
            type="file"
            style={styles.fileInput}
            multiple
            onChange={handleFileChange}
          />
          <div style={styles.certificationContainer}>
            {certifications?.map((certification, index) => (
              <div key={index} style={styles.certificationItem}>
                <a
                  href={certification}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.certificationLink}
                >
                  View Certification
                </a>
                <button
                  onClick={() => handleDeleteCertification(certification)}
                  style={styles.deleteButton}
                >
                  <img src={bin} alt="Delete" style={styles.binImage} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#eaf6f6",
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  section: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "40px",
  },
  personalInfoContainer: {
    display: "flex",
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "50%",

    margin: "0 20px 0 0",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileOverlay: {
    position: "absolute",
    bottom: "0",
    right: "0",
  },
  profileButton: {
    backgroundColor: "#007bff",
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
  fieldGroup: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  fieldColumn: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    display: "block",
    marginLeft: "20px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    width: "300px",
    marginLeft: "50px",
  },
  btnBox: {
    top: "35px",
    right: "20px",
    position: "absolute",
    display: "flex",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },

  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  inputcontainer: {
    position: "relative",
    width: "100%",
  },
  toggleButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
  },
  eyeIcon: {
    width: "20px",
    height: "20px",
  },
  subTitle: {
    fontSize: "18px",
    marginTop: "40px",
    marginBottom: "40px",
  },
  certificationContainer: {
    display: "flex",
    gap: "10px",
  },
  certificationItem: {
    padding: "10px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
    textAlign: "center",
    flex: "1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  uploadIcon: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  uploadImage: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
  fileInput: {
    display: "none",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  binImage: {
    width: "20px",
    height: "20px",
  },
};

export default Profile;
