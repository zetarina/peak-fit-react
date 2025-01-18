import React, { useState } from "react";

// Workout Page Component
const Mails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("oldest"); // State for sorting order
  const workoutsPerPage = 10;
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  // State to track edits
  const [editableWorkouts, setEditableWorkouts] = useState({});
  const [isEdited, setIsEdited] = useState({});
  // Initial Workouts Data
  const [workouts, setWorkouts] = useState([
    {
      id: 1, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/NfSB6sNFvO4/0.jpg",
      title: "---",
      date: "01/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/NfSB6sNFvO4",
    },
    {
      id: 2, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/q_kYnAShnnI/0.jpg",
      title: "---",
      date: "01/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/q_kYnAShnnI",
    },
    {
      id: 3, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/Pp44Y390Ffs/0.jpg",
      title: "---",
      date: "01/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/Pp44Y390Ffs?si=v0YImQobcShqGOM9",
    },
    {
      id: 4, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/SALxEARiMkw/0.jpg",
      title: "---",
      date: "01/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/SALxEARiMkw?si=yAUbizvm2OBn479h",
    },
    {
      id: 5, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/N5x5M1x1Gd0/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/N5x5M1x1Gd0?si=GNPotH8eKjnFWVV5",
    },
    {
      id: 6, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/BRVDS6HVR9Q/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/BRVDS6HVR9Q?si=xjIPC1pQQHK9scAD",
    },
    {
      id: 7, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/_g97w3QfD6E/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/_g97w3QfD6E?si=QyA072rDfxDsSSYX",
    },
    {
      id: 8, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/geNkbcZ6qDo/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/geNkbcZ6qDo?si=FNvxSvzGXyGg_cgc",
    },
    {
      id: 9, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/_RlRDWO2jfg/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/_RlRDWO2jfg?si=6X7B8yQYlZjHWZ5a",
    },
    {
      id: 10, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/XPPfnSEATJA/0.jpg",
      title: "---",
      date: "02/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/XPPfnSEATJA?si=IIr_A5nobyHST_nM",
    },
    {
      id: 11, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/xhk1JkbF2lg/0.jpg",
      title: "---",
      date: "03/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/xhk1JkbF2lg?si=iIpUDu3E--vJiWJM",
    },
    {
      id: 12, // Unique identifier
      thumbnail: "https://img.youtube.com/vi/s0kT80JLCfA/0.jpg",
      title: "---",
      date: "03/01/2025",
      level: "---",
      category: "---",
      videoUrl: "https://www.youtube.com/embed/s0kT80JLCfA?si=E6BY2l8svArnFnUx",
    }   
  ]);

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  // Derive workouts to display with sorting applied
  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Apply pagination after sorting
  const startIndex = (currentPage - 1) * workoutsPerPage;
  const endIndex = startIndex + workoutsPerPage;
  const currentWorkouts = sortedWorkouts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(workouts.length / workoutsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleThumbnailClick = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentVideoUrl("");
  };

  const handleApprove = (id) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.id !== id)
    );
  
    // Reset the isEdited state for all rows
    setIsEdited((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = false; // Reset edit status
        return acc;
      }, {})
    );
  };
  
  
  const handleDecline = (id) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.id !== id)
    );
  };

  const handleEdit = (index) => {
    setEditableWorkouts((prev) => ({
      ...prev,
      [index]: workouts[index], // Store the current values for the row being edited
    }));
  };
  
  const handleFieldChange = (index, field, value) => {
    setEditableWorkouts((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  
    // Check if all required fields are edited
    setIsEdited((prev) => {
      const editedWorkout = {
        ...editableWorkouts[index],
        [field]: value,
      };
      const allFieldsEdited =
        editedWorkout.title &&
        editedWorkout.level &&
        editedWorkout.category &&
        editedWorkout.title !== "---" &&
        editedWorkout.level !== "---" &&
        editedWorkout.category !== "---";
  
      return { ...prev, [index]: allFieldsEdited };
    });
  };
  
  
  const handleSave = (index) => {
    // Save the edited row to the main workouts array
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index] = editableWorkouts[index];
    setWorkouts(updatedWorkouts);
  
    // Exit edit mode
    setEditableWorkouts((prev) => ({ ...prev, [index]: null }));
    setIsEdited((prev) => ({ ...prev, [index]: true })); // Mark row as edited
  };

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>All Mails</h3>

      <div style={styles.sortingControls}>
        <button style={styles.sortButton} onClick={() => handleSort("newest")}>
          Sort by Newest
        </button>
        <button style={styles.sortButton} onClick={() => handleSort("oldest")}>
          Sort by Oldest
        </button>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>S/N</th>
            <th style={styles.tableHeader}>Video</th>
            <th style={styles.tableHeader}>Title</th>
            <th style={styles.tableHeader}>Level</th>
            <th style={styles.tableHeader}>Type</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentWorkouts.map((workout, index) => (
            <tr key={index} style={styles.tableRow}>
              <td style={styles.tableCell}>{workout.id}</td>
              <td style={styles.tableCell}>
                <div style={styles.thumbnailContainer}>
                  <img
                    src={workout.thumbnail}
                    alt={workout.title}
                    style={styles.thumbnail}
                    onClick={() => handleThumbnailClick(workout.videoUrl)}
                  />
                  <div
                    style={styles.playButton}
                    onClick={() => handleThumbnailClick(workout.videoUrl)}
                  >
                    ▶
                  </div>
                </div>
              </td>

              {/* Editable Title */}
              <td style={styles.tableCell}>
                {editableWorkouts[index] ? (
                  <input
                    type="text"
                    value={editableWorkouts[index].title}
                    onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                  />
                ) : (
                  workout.title
                )}
              </td>
              <td style={styles.tableCell}>
                {editableWorkouts[index] ? (
                  <select
                    value={editableWorkouts[index].level}
                    onChange={(e) => handleFieldChange(index, "level", e.target.value)}
                  >
                    <option value="Select level">Select Level</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                ) : (
                  workout.level
                )}
              </td>
              <td style={styles.tableCell}>
                {editableWorkouts[index] ? (
                  <select
                    value={editableWorkouts[index].category}
                    onChange={(e) => handleFieldChange(index, "category", e.target.value)}
                  >
                    <option value="Select Category">Select Category</option>
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Biceps">Biceps</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Core">Core</option>
                    <option value="Legs">Legs</option>
                    <option value="Glutes">Glutes</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                ) : (
                  workout.category
                )}
              </td>
              <td style={styles.tableCell}>{workout.date}</td>
              <td style={styles.tableCell}>
                <button
                  style={styles.editButton}
                  onClick={() => (editableWorkouts[index] ? handleSave(index) : handleEdit(index))}
                >
                  {editableWorkouts[index] ? "Save" : "Edit"}
                </button>
                <button
                  style={{
                    ...styles.approveButton,
                    cursor: isEdited[index] ? "pointer" : "not-allowed", // Change cursor style
                  }}
                  disabled={!isEdited[index]} // Disable until all fields are edited
                  onClick={() => handleApprove(workout.id)}
                >
                  Approve
                </button>
                <button
                  style={styles.declineButton}
                  onClick={() => handleDecline(workout.id)}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {modalVisible && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent}>
            <iframe
              width="560"
              height="315"
              src={currentVideoUrl}
              title="Workout Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button onClick={closeModal} style={styles.closeModalButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    overflow: "auto",    
    scrollbarWidth: "thin",  
    scrollbarColor: "#888 #ccc", 
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  sortingControls: {
    marginBottom: "15px",
    display: "flex", // Flexbox to align buttons side by side
    justifyContent: "flex-start",  // Align buttons to the left
    gap: "10px",  // Adds space between the buttons
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    verticalAlign: "middle",
  },
  thumbnailContainer: {
    position: "relative",
    display: "inline-block",
  },
  thumbnail: {
    width: "100px",
    height: "auto",
    cursor: "pointer",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
    background: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
    pointerEvents: "none",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#e0e0e0",
    color: "black",
    border: "none",
    cursor: "pointer",
    width: "70px", 
    marginRight: "10px", 
  },
  approveButton: {
    padding: "5px 10px",
    backgroundColor: "#AFE1AF",
    color: "black",
    border: "none",
    cursor: "pointer",
    width: "70px", 
    marginRight: "10px", 
  },
  declineButton: {
    padding: "5px 10px",
    backgroundColor: "#e57373",
    color: "black",
    border: "none",
    cursor: "pointer",
    width: "70px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    width: "80%",
    maxWidth: "560px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  closeModalButton: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    marginTop: "20px",
    alignSelf: "center",
  },
};

export default Mails;
