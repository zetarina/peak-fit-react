import React, { useState, useEffect } from "react";
import excel from "@/images/excel.png";
import * as XLSX from "xlsx"; // Import the xlsx package
import ApiService from "@/services/ApiService";

const WorkoutTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [workoutsList, setWorkoutsList] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [updatedWorkout, setUpdatedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [workoutToDelete, setWorkoutToDelete] = useState(null); // Workout to delete
  const [categoryFilter, setCategoryFilter] = useState(null); // Category filter
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false); // Dropdown Category
  const [levelFilter, setLevelFilter] = useState(null); // Lvel filter
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false); // Level state
  const [typeFilter, setTypeFilter] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Workout modal state
  const [modalType, setModalType] = useState(null);
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false); // Level state
  const [newWorkout, setNewWorkout] = useState({
    id: Date.now(),
    thumbnail: "",
    title: "",
    date: "",
    level: "",
    type: "",
    videoUrl: "",
  });

  const workoutsPerPage = 10;

  useEffect(() => {
    const fetchApprovedWorkouts = async () => {
      try {
        const response = await ApiService.get("/workouts/approved");
        setWorkoutsList(response.data);
      } catch (error) {
        console.error("Error fetching approved workouts:", error.message);
      }
    };

    fetchApprovedWorkouts();
  }, []);
  // Filter workouts by category and search query
  const filteredWorkouts = workoutsList.filter((workout) => {
    const matchesSearch = workout.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchestype = !categoryFilter || workout.type === categoryFilter;
    const matchesLevel = !levelFilter || workout.level === levelFilter;
    const matchesType = !typeFilter || workout.type === typeFilter;

    return matchesSearch && matchestype && matchesLevel && matchesType;
  });

  const totalPages = Math.ceil(filteredWorkouts.length / workoutsPerPage);

  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = filteredWorkouts.slice(
    indexOfFirstWorkout,
    indexOfLastWorkout
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = (id) => {
    setWorkoutToDelete(id);
    setIsDeleteModalOpen(true); // Open modal
  };

  const confirmDelete = async () => {
    try {
      // Call the delete API
      const response = await ApiService.delete(
        `/workouts/approved/${workoutToDelete}`
      );

      if (response.success) {
        console.log("Workout deleted successfully:", response.message);

        // Update the local state to remove the deleted workout
        const updatedWorkouts = workoutsList.filter(
          (workout) => workout.id !== workoutToDelete
        );
        setWorkoutsList(updatedWorkouts);
        setIsDeleteModalOpen(false);

        // Adjust the current page if needed
        if (updatedWorkouts.length % workoutsPerPage === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        console.error("Failed to delete workout:", response.message);
      }
    } catch (error) {
      console.error("Error deleting workout:", error.message);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWorkoutToDelete(null);
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setUpdatedWorkout(workout);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the video URL is being updated, generate the new thumbnail
    if (name === "videoUrl") {
      let videoId = null;
      if (value.includes("v=")) {
        videoId = value.split("v=")[1]?.split("&")[0];
      } else if (value.includes("youtu.be/")) {
        videoId = value.split("youtu.be/")[1]?.split("?")[0];
      }

      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "";

      setUpdatedWorkout((prev) => ({
        ...prev,
        [name]: value,
        thumbnail, // Update thumbnail
      }));
    } else {
      setUpdatedWorkout((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Call the update API
      const response = await ApiService.put(
        `/workouts/approved/${updatedWorkout.id}`,
        updatedWorkout
      );

      if (response.success) {
        console.log("Workout updated successfully:", response.message);

        // Update the local state with the updated workout
        const updatedWorkouts = workoutsList.map((workout) =>
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        );
        setWorkoutsList(updatedWorkouts);
        setEditingWorkout(null); // Exit edit mode
      } else {
        console.error("Failed to update workout:", response.message);
      }
    } catch (error) {
      console.error("Error updating workout:", error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen((prev) => !prev);
    setIsLevelDropdownOpen(false);
    setIsAddDropdownOpen(false); // Close the Add Workout dropdown
  };

  const toggleLevelDropdown = () => {
    setIsLevelDropdownOpen((prev) => !prev);
    setIsCategoryDropdownOpen(false);
    setIsAddDropdownOpen(false); // Close the Add Workout dropdown
  };

  const closeDropdown = () => {
    setIsCategoryDropdownOpen(false);
    setIsLevelDropdownOpen(false); // Explicitly closes the dropdown
    setIsAddDropdownOpen(false); // Close dropdown
  };

  const selectCategory = (category) => {
    setCategoryFilter(category);
    setIsCategoryDropdownOpen(false);
    setCurrentPage(1); // Reset to the first page
  };

  const selectLevel = (level) => {
    setLevelFilter(level);
    setIsLevelDropdownOpen(false);
    setCurrentPage(1); // Reset to the first page
  };

  // Add Workout
  const toggleAddDropdown = () => {
    setIsCategoryDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setIsAddDropdownOpen((prev) => !prev);
  };

  // Add Individual Workout
  const selectAdd = (type) => {
    setModalType(type); // Set modal type based on dropdown selection
    setIsAddDropdownOpen(false); // Close dropdown
    setIsAddModalOpen(true); // Open modal
  };

  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);

  const handleNewWorkoutChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorkout = async () => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;

    const newWorkoutData = {
      ...newWorkout,
      date: formattedDate, // Set the current date
    };

    try {
      const response = await ApiService.post(
        "/workouts/createApproved",
        newWorkoutData
      );

      if (response.success) {
        console.log("Workout added successfully:", response.data);
        setWorkoutsList([...workoutsList, response.data]);
        setIsAddModalOpen(false);

        // Reset the form for the next workout
        setNewWorkout({
          id: Date.now(),
          thumbnail: "",
          title: "",
          date: "",
          level: "",
          type: "",
          videoUrl: "",
        });
      } else {
        console.error("Failed to add workout:", response.message);
      }
    } catch (error) {
      console.error("Error adding workout:", error.message);
    }
  };

  // Add Bulk Workouts
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Assume data is in the first sheet
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Map the data to match the workout structure
        const newWorkouts = jsonData.map((workout) => ({
          thumbnail: workout.videoUrl
            ? `https://img.youtube.com/vi/${getVideoId(
                workout.videoUrl
              )}/hqdefault.jpg`
            : "",
          title: workout.title,
          date: workout.date || "",
          level: workout.level,
          type: workout.type,
          videoUrl: workout.videoUrl,
        }));

        try {
          // Bulk upload new workouts via API
          const uploadPromises = newWorkouts.map((workout) =>
            ApiService.post("/workouts/createApproved", workout)
          );
          const responses = await Promise.all(uploadPromises);

          // Update local state with successfully added workouts
          const successfulWorkouts = responses
            .filter((response) => response.success)
            .map((response) => response.data);
          setWorkoutsList([...workoutsList, ...successfulWorkouts]);

          setIsAddModalOpen(false); // Close the modal
        } catch (error) {
          console.error("Error uploading workouts:", error.message);
        }
      };

      reader.readAsBinaryString(file); // Read the file as binary string
    }
  };

  // Helper function to extract video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : "";
  };

  return (
    <div>
      <header style={styles.header}>
        <h1>All Workouts</h1>
        <div>
          <button style={styles.filters.button} onClick={toggleLevelDropdown}>
            Level ▼
          </button>
          {isLevelDropdownOpen && (
            <div style={styles.leveldropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLevel(null)}
              >
                All Level
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLevel("Easy")}
              >
                Easy
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLevel("Medium")}
              >
                Medium
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLevel("Hard")}
              >
                Hard
              </button>
              <button
                style={styles.filters.closebutton}
                onClick={closeDropdown}
              >
                Close
              </button>
            </div>
          )}

          <button
            style={styles.filters.button}
            onClick={toggleCategoryDropdown}
          >
            Type ▼
          </button>
          {isCategoryDropdownOpen && (
            <div style={styles.categorydropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory(null)}
              >
                All Types
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Chest")}
              >
                Chest
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Back")}
              >
                Back
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Biceps")}
              >
                Biceps
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Triceps")}
              >
                Triceps
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Shoulders")}
              >
                Shoulders
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Core")}
              >
                Core
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectCategory("Legs")}
              >
                Legs
              </button>
              <button
                style={styles.filters.closebutton}
                onClick={closeDropdown}
              >
                Close
              </button>
            </div>
          )}

          {/* Button to open dropdown */}
          <button style={styles.filters.button} onClick={toggleAddDropdown}>
            + Add Workout
          </button>

          {/* Dropdown menu */}
          {isAddDropdownOpen && (
            <div style={styles.adddropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectAdd("Add Workout")}
              >
                Add Workout
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectAdd("Add Bulk Workouts")}
              >
                Add Bulk Workouts
              </button>
              <button
                style={styles.filters.closebutton}
                onClick={closeDropdown}
              >
                Close
              </button>
            </div>
          )}

          {/* Modal for Add Workout */}
          {isAddModalOpen && modalType === "Add Workout" && (
            <div style={styles.modal}>
              <h2 style={{ textAlign: "center" }}>Add New Workout</h2>
              <form style={styles.form}>
                {/* Title */}
                <label style={styles.Addlabel}>Workout Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter workout title"
                  value={newWorkout.title}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                />

                {/* Level */}
                <label style={styles.Addlabel}>Workout Level</label>
                <select
                  name="level"
                  value={newWorkout.level}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                >
                  <option value="">Select Level</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Category */}
                <label style={styles.Addlabel}>Workout Type</label>
                <select
                  name="type"
                  value={newWorkout.type}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                >
                  <option value="">Select Type</option>
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Biceps">Biceps</option>
                  <option value="Triceps">Triceps</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Core">Core</option>
                  <option value="Leg">Leg</option>
                </select>

                {/* Video URL */}
                <label style={styles.Addlabel}>Video URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  placeholder="Enter video URL"
                  value={newWorkout.videoUrl}
                  onChange={(e) => {
                    const videoUrl = e.target.value;
                    setNewWorkout((prevWorkout) => ({
                      ...prevWorkout,
                      videoUrl, // Update the video URL
                    }));

                    // Extract video ID and set thumbnail
                    try {
                      let videoId = null;
                      if (videoUrl.includes("v=")) {
                        videoId = videoUrl.split("v=")[1]?.split("&")[0];
                      } else if (videoUrl.includes("youtu.be/")) {
                        videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
                      }

                      if (videoId) {
                        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        setNewWorkout((prevWorkout) => ({
                          ...prevWorkout,
                          thumbnail: thumbnailUrl,
                        }));
                      } else {
                        setNewWorkout((prevWorkout) => ({
                          ...prevWorkout,
                          thumbnail: "", // Clear thumbnail if URL is invalid
                        }));
                      }
                    } catch {
                      setNewWorkout((prevWorkout) => ({
                        ...prevWorkout,
                        thumbnail: "", // Clear thumbnail in case of an error
                      }));
                    }
                  }}
                  style={styles.Addinput}
                />

                {/* Thumbnail Preview */}
                {newWorkout.thumbnail && (
                  <div style={{ marginTop: "0", textAlign: "center" }}>
                    <p>Video Thumbnail Preview:</p>
                    <img
                      src={newWorkout.thumbnail}
                      alt="Video Thumbnail"
                      style={{
                        width: "80%",
                        maxWidth: "150px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                      }}
                    />
                  </div>
                )}

                {/* Auto-updated Date */}
                <label style={styles.Addlabel}>Date Added</label>
                <input
                  type="text"
                  name="date"
                  value={new Date().toISOString().split("T")[0]} // Today's date in YYYY-MM-DD
                  readOnly
                  style={{ ...styles.Addinput, backgroundColor: "#f0f0f0" }}
                />
              </form>

              {/* Buttons */}
              <div style={styles.buttonGroup}>
                <button onClick={handleAddWorkout} style={styles.saveButton}>
                  Save Workout
                </button>
                <button onClick={toggleAddModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Modal for Add Bulk Workouts */}
          {isAddModalOpen && modalType === "Add Bulk Workouts" && (
            <div style={styles.bulkmodal}>
              <h2 style={{ textAlign: "center" }}>Add Bulk Workouts</h2>

              {/* Template Section */}
              <div style={styles.templateContainer}>
                <div style={styles.templateItem}>
                  <p>Template for bulk upload</p>
                  <img
                    src={excel}
                    alt="CSV Template"
                    style={styles.templateImage}
                  />
                  <a
                    href="/template/bulk workouts.csv"
                    download
                    style={styles.downloadLink}
                  >
                    Download Bulk Upload Template.csv
                  </a>
                </div>
              </div>

              {/* Upload Section */}
              <form style={styles.bulkform}>
                <label style={styles.bulklabel}>Mass Upload:</label>
                <div style={styles.container}>
                  <input
                    type="file"
                    accept=".xlsx, .csv, .json"
                    onChange={handleBulkUpload}
                    style={styles.fileInput}
                  />
                </div>
              </form>

              {/* Action Buttons */}
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => console.log("Bulk Workouts Added")}
                  style={styles.saveButton}
                >
                  Upload Workouts
                </button>
                <button onClick={toggleAddModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Search workouts..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </header>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerCell}>Workout Video</th>
              <th style={styles.headerCell}>Title</th>
              <th style={styles.headerCell}>Level</th>
              <th style={styles.headerCell}>Type</th>
              <th style={styles.headerCell}>Date Added</th>
              <th style={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentWorkouts.map((workout, index) => (
              <tr key={index}>
                <td style={styles.thumbnailCell}>
                  <div style={styles.thumbnailWrapper}>
                    <a
                      href={workout.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={workout.thumbnail}
                        alt={workout.title}
                        style={styles.thumbnail}
                      />
                      <div style={styles.playButton}>▶</div>
                    </a>
                  </div>
                </td>
                <td style={styles.cell}>{workout.title}</td>
                <td style={styles.cell}>{workout.level}</td>
                <td style={styles.cell}>{workout.type}</td>
                <td style={styles.cell}>{workout.date}</td>
                <td style={styles.cell}>
                  <button
                    style={{
                      ...styles.actions.button,
                      ...styles.actions.editBtn,
                    }}
                    onClick={() => handleEdit(workout)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      ...styles.actions.button,
                      ...styles.actions.deleteBtn,
                    }}
                    onClick={() => handleDelete(workout.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={styles.modal}>
          <div>
            <h4>Are you sure you want to delete this workout?</h4>
            <div style={styles.modalActions}>
              <button onClick={confirmDelete} style={styles.modalButton}>
                Confirm
              </button>
              <button onClick={cancelDelete} style={styles.modalButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workout Form */}
      {editingWorkout && (
        <div style={styles.editForm}>
          <h2>Edit Workout</h2>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title:
              <input
                id="title"
                type="text"
                name="title"
                value={updatedWorkout.title}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="videoUrl" style={styles.label}>
              Video:
              <input
                id="videoUrl"
                type="text"
                name="videoUrl"
                value={updatedWorkout.videoUrl}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="type" style={styles.label}>
              Type:
              <select
                id="type"
                name="type"
                value={updatedWorkout.type}
                onChange={handleChange}
                style={styles.input}
              >
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
            </label>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="level" style={styles.label}>
              Level:
              <select
                id="level"
                name="level"
                value={updatedWorkout.level}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>
          <button onClick={handleSave} style={styles.saveButton}>
            Save Changes
          </button>
          <button
            onClick={() => setEditingWorkout(null)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  tableContainer: {
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse", // Ensures no gaps between table cells
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  filters: {
    button: {
      marginRight: "10px",
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      position: "relative",
      width: "120px",
      backgroundColor: "#818589",
      color: "white",
    },
    closebutton: {
      marginRight: "20px",
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginLeft: "20px",
      marginTop: "20px",
      display: "block",
      margin: "20px auto",
    },
  },
  searchInput: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  headerCell: {
    padding: "10px",
    textAlign: "left",
    border: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
  },
  cell: {
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fafafa",
  },
  thumbnailCell: {
    position: "relative",
    textAlign: "center",
    border: "1px solid #ddd",
    width: "120px",
    height: "80px",
  },
  thumbnailWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "24px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  actions: {
    button: {
      marginRight: "10px",
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    editBtn: {
      backgroundColor: "#e0e0e0",
    },
    deleteBtn: {
      backgroundColor: "#e57373",
      color: "white",
    },
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  paginationButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
  },
  editForm: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#e0e0e0",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    width: "500px",
    maxWidth: "90%",
    fontFamily: "Arial, sans-serif",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    width: "100%",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#5F9EA0",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "10px 10px 10px 0",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "10px 0",
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalActions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  leveldropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    width: "100px",
  },
  categorydropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "130px",
  },
  adddropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "260px",
  },
  dropdownItem: {
    padding: "5px 10px",
    cursor: "pointer",
    display: "block",
    textAlign: "center",
    border: "none",
    background: "none",
    width: "100%",
  },
  dropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "420px",
    backgroundColor: "#D3D3D3",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  Addlabel: {
    fontWeight: "bold",
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    width: "100%",
  },
  Addinput: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
  },
  bulkmodal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    backgroundColor: "#D3D3D3",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  templateContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "20px",
  },
  templateItem: {
    display: "flex",
    alignItems: "center",
  },
  templateImage: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
    marginRight: "10px",
  },
  downloadLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "6px 12px",
    borderRadius: "4px",
    backgroundColor: "#f0f8ff",
    transition: "background-color 0.3s ease, color 0.3s ease",
    alignSelf: "center",
  },
  bulkform: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  bulklabel: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    width: "100%",
  },
  fileInput: {
    padding: "8px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    borderRadius: "4px",
    outline: "none",
    width: "100%",
    marginBottom: "10px",
  },
};

export default WorkoutTable;
