import React, { useState, useEffect } from "react";
import excel from "../../images/excel.png";
import * as XLSX from "xlsx"; // Import the xlsx package
import ApiService from "@/services/ApiService";
import LoadingOverlay from "@/components/LoadingOverlay";
const WorkoutTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [workoutsList, setWorkoutsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [updatedWorkout, setUpdatedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [workoutToDelete, setWorkoutToDelete] = useState(null); // Workout to delete

  const [goalFilter, setgoalFilter] = useState(null); // Goal filter
  const [isgoalDropdownOpen, setIsgoalDropdownOpen] = useState(false); // Dropdown Goal

  const [limitationFilter, setlimitationFilter] = useState(null); // Limitation filter
  const [islimitationDropdownOpen, setIslimitationDropdownOpen] =
    useState(false); // Dropdown Limitation

  const [levelFilter, setLevelFilter] = useState(null); // Lvel filter
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false); // Level state

  const [durationFilter, setdurationFilter] = useState(null); // Limitation filter
  const [isdurationDropdownOpen, setIsdurationDropdownOpen] = useState(false); // Dropdown Limitation

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Workout modal state
  const [modalType, setModalType] = useState(null);
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false); // Level state
  const [newWorkout, setNewWorkout] = useState({
    id: Date.now(),
    thumbnail: "",
    title: "",
    date: "",
    level: "",
    goal: "",
    limitations: "",
    duration: "",
    videoUrl: "",
  });

  const workoutsPerPage = 10;
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const response = await ApiService.safeGet("/personalized-workout");
        console.log(response.data);
        setWorkoutsList(response.data || []);
      } catch (err) {
        console.error("Failed to fetch workouts:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Filter workouts by category and search query
  const filteredWorkouts = (
    Array.isArray(workoutsList) ? workoutsList : []
  ).filter((workout) => {
    const matchesSearch = workout.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || workout.level === levelFilter;
    const matchesGoal = !goalFilter || workout.goal === goalFilter;
    const matchesLimitation =
      !limitationFilter || workout.limitations === limitationFilter;
    const matchesDuration =
      !durationFilter || workout.duration === durationFilter;

    return (
      matchesSearch &&
      matchesGoal &&
      matchesLimitation &&
      matchesLevel &&
      matchesDuration
    );
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
    setIsgoalDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setIsAddDropdownOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.safeDelete(`/personalized-workout/${workoutToDelete}`);
      setWorkoutsList((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutToDelete)
      );
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete workout:", err.message);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWorkoutToDelete(null);
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setUpdatedWorkout(workout);
    setIsgoalDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setIsAddDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await ApiService.safePut(
        `/personalized-workout/${updatedWorkout.id}`,
        updatedWorkout
      );
      setWorkoutsList((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        )
      );
      setEditingWorkout(null);
    } catch (err) {
      console.error("Failed to update workout:", err.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const toggleGoalDropdown = () => {
    setIsgoalDropdownOpen((prev) => !prev);
    setIsLevelDropdownOpen(false);
    setIsAddDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setEditingWorkout(false);
  };

  const toggleLimitationDropdown = () => {
    setIslimitationDropdownOpen((prev) => !prev);
    setIsLevelDropdownOpen(false);
    setIsAddDropdownOpen(false);
    setIsgoalDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setEditingWorkout(false);
  };

  const toggleLevelDropdown = () => {
    setIsLevelDropdownOpen((prev) => !prev);
    setIsgoalDropdownOpen(false);
    setIsAddDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setEditingWorkout(false);
  };

  const toggleDurationDropdown = () => {
    setIsdurationDropdownOpen((prev) => !prev);
    setIsgoalDropdownOpen(false);
    setIsAddDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setEditingWorkout(false);
  };

  const closeDropdown = () => {
    setIsgoalDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setIsAddDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
  };

  const selectGoal = (goal) => {
    setgoalFilter(goal);
    setIsgoalDropdownOpen(false);
    setCurrentPage(1); // Reset to the first page
  };

  const selectLimitation = (limitation) => {
    setlimitationFilter(limitation);
    setIslimitationDropdownOpen(false);
    setCurrentPage(1);
  };

  const selectLevel = (limitation) => {
    setLevelFilter(limitation);
    setIsLevelDropdownOpen(false);
    setCurrentPage(1); // Reset to the first page
  };

  const selectDuration = (duration) => {
    setdurationFilter(duration);
    setIsdurationDropdownOpen(false);
    setCurrentPage(1); // Reset to the first page
  };

  // Add Workout
  const toggleAddDropdown = () => {
    setIsAddDropdownOpen((prev) => !prev);
    setIsgoalDropdownOpen(false);
    setIsLevelDropdownOpen(false);
    setIslimitationDropdownOpen(false);
    setIsdurationDropdownOpen(false);
    setEditingWorkout(false);
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
    try {
      const response = await ApiService.safePost(
        "/personalized-workout",
        newWorkout
      );
      setWorkoutsList((prevWorkouts) => [...prevWorkouts, response.data]);
      setNewWorkout({
        id: Date.now(),
        thumbnail: "",
        title: "",
        date: "",
        level: "",
        goal: "",
        limitations: "",
        duration: "",
        videoUrl: "",
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add workout:", err.message);
    }
  };

  // Add Bulk Workouts
  const handleBulkUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Assume data is in the first sheet
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Map the data to match the workout structure and add to the workouts list
        const newWorkouts = jsonData.map((workout) => ({
          id: Date.now(),
          thumbnail: workout.videoUrl
            ? `https://img.youtube.com/vi/${getVideoId(
                workout.videoUrl
              )}/hqdefault.jpg`
            : "",
          title: workout.title,
          date: workout.date,
          level: workout.level,
          goal: workout.goal,
          limitations: workout.limitations,
          duration: workout.duration,
          videoUrl: workout.videoUrl,
        }));

        // Add the new workouts to the list
        setWorkoutsList([...workoutsList, ...newWorkouts]);

        // Close the modal
        setIsAddModalOpen(false);
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
    <div style={styles.page}>
      <LoadingOverlay isLoading={loading} message="Loading..." />
      <header style={styles.header}>
        <h3>All Personalised Workouts</h3>
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

          <button style={styles.filters.button} onClick={toggleGoalDropdown}>
            Goal ▼
          </button>
          {isgoalDropdownOpen && (
            <div style={styles.goaldropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectGoal(null)}
              >
                All Goals
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectGoal("Build Muscle")}
              >
                Build Muscle
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectGoal("Lose Weight")}
              >
                Lose Weight
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectGoal("Endurance/Get Healthy")}
              >
                Endurance/Get Healthy
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
            onClick={toggleLimitationDropdown}
          >
            Limitation ▼
          </button>
          {islimitationDropdownOpen && (
            <div style={styles.limitationdropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLimitation(null)}
              >
                All Limitations
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLimitation("Sensitive Back")}
              >
                Sensitive Back
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLimitation("Sensitive Knees")}
              >
                Sensitive Knees
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectLimitation("No Limitation")}
              >
                No Limitation
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
            onClick={toggleDurationDropdown}
          >
            Duration ▼
          </button>
          {isdurationDropdownOpen && (
            <div style={styles.durationdropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => selectDuration(null)}
              >
                All Duration
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectDuration("30 Minutes")}
              >
                30 Minutes
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectDuration("1 Hour")}
              >
                1 Hour
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectDuration("1 Hour 30 Minutes")}
              >
                1 Hour 30 Minutes
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => selectDuration("2 Hours")}
              >
                2 Hour
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
            <div style={styles.editForm}>
              <h2 style={{ textAlign: "center" }}>Add New Goal Workout</h2>
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
                      videoUrl,
                    }));
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
                          thumbnail: "",
                        }));
                      }
                    } catch {
                      setNewWorkout((prevWorkout) => ({
                        ...prevWorkout,
                        thumbnail: "",
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

                {/* Level */}
                <label style={styles.Addlabel}>Difficulty Level</label>
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

                {/* Goal */}
                <label style={styles.Addlabel}>Workout Goals</label>
                <select
                  name="goal"
                  value={newWorkout.goal}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                >
                  <option value="">Select Goal</option>
                  <option value="Build Muscle">Build Muscle</option>
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Endurance/Get Healthy">
                    Endurance/Get Healthy
                  </option>
                </select>

                {/* Limitation */}
                <label style={styles.Addlabel}>Workout Limitations</label>
                <select
                  name="limitations"
                  value={newWorkout.limitations}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                >
                  <option value="">Select Limitation</option>
                  <option value="Sensitive Knees">Sensitive Knees</option>
                  <option value="Sensitive Back">Sensitive Back</option>
                  <option value="No Limitation">No Limitation</option>
                </select>

                {/* Limitation */}
                <label style={styles.Addlabel}>Workout Duration</label>
                <select
                  name="duration"
                  value={newWorkout.duration}
                  onChange={handleNewWorkoutChange}
                  style={styles.Addinput}
                >
                  <option value="">Select Duration</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="1 Hour 30 Minutes">1 Hour 30 Minutes</option>
                  <option value="2 Hour">2 Hour</option>
                </select>

                {/* Auto-updated Date */}
                <label style={styles.Addlabel}>Date Added</label>
                <input
                  type="text"
                  name="date"
                  value={new Date().toISOString().split("T")[0]}
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
              <th style={styles.headerCell}>Goals</th>
              <th style={styles.headerCell}>Limitations</th>
              <th style={styles.headerCell}>Duration</th>
              <th style={styles.headerCell}>Date Published</th>
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
                <td style={styles.cell}>{workout.goal}</td>
                <td style={styles.cell}>{workout.limitations}</td>
                <td style={styles.cell}>{workout.duration}</td>
                <td style={styles.cell}>
                  {new Date(workout.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>

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
              Video URL:
            </label>
            <input
              id="videoUrl"
              type="text"
              name="videoUrl"
              value={updatedWorkout.videoUrl}
              onChange={(e) => {
                const videoUrl = e.target.value;
                setUpdatedWorkout((prevWorkout) => ({
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
                    setUpdatedWorkout((prevWorkout) => ({
                      ...prevWorkout,
                      thumbnail: thumbnailUrl,
                    }));
                  } else {
                    setUpdatedWorkout((prevWorkout) => ({
                      ...prevWorkout,
                      thumbnail: "", // Clear thumbnail if URL is invalid
                    }));
                  }
                } catch {
                  setUpdatedWorkout((prevWorkout) => ({
                    ...prevWorkout,
                    thumbnail: "", // Clear thumbnail in case of an error
                  }));
                }
              }}
              style={styles.input}
            />

            {/* Thumbnail Preview */}
            {updatedWorkout.thumbnail && (
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <p>Video Thumbnail Preview:</p>
                <img
                  src={updatedWorkout.thumbnail}
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
          <div style={styles.formGroup}>
            <label htmlFor="goal" style={styles.label}>
              Goal:
              <select
                id="goal"
                name="goal"
                value={updatedWorkout.goal}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Build Muscle">Build Muscle</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Endurance/Get Healthy">
                  Endurance/Get Healthy
                </option>
              </select>
            </label>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="limitations" style={styles.label}>
              Limitation:
              <select
                id="limitations"
                name="limitations"
                value={updatedWorkout.limitations}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Sensitive Knees">Sensitive Knees</option>
                <option value="Sensitive Back">Sensitive Back</option>
                <option value="No Limitation">No Limitation</option>
              </select>
            </label>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="duration" style={styles.label}>
              Duration:
              <select
                id="duration"
                name="duration"
                value={updatedWorkout.duration}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="30 Minutes">30 Minutes</option>
                <option value="1 Hour">1 Hour</option>
                <option value="1 Hour 30 Minutes">1 Hour 30 Minutes</option>
                <option value="2 Hour">2 Hour</option>
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
      width: "120px", // Set a specific width
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
      marginBottom: "20px",
      width: "100%",
    },
    deleteBtn: {
      backgroundColor: "#e57373",
      color: "white",
      width: "100%",
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
    width: "450px",
    maxWidth: "90%",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto", // Enables vertical scrolling
    maxHeight: "80vh", // Restricts maximum height for scrolling
  },
  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginBottom: "8px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
  typedropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    width: "100px",
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
  goaldropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "130px",
  },
  limitationdropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "250px",
  },
  durationdropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "380px",
  },
  adddropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "5px",
    zIndex: 1000,
    marginLeft: "520px",
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
