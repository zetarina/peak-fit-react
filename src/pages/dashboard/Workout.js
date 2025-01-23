import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  PaginationModule,
  RowSelectionModule,
  TextFilterModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme CSS
import SingleModalComponent from "../../components/SingleModalComponent";
import ApiService from "@/services/ApiService";
import getYouTubeThumbnailUrl from "../../utils/youtube";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "react-toastify";

const WorkoutsPage = () => {
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [selectedBulkFile, setSelectedBulkFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    id: "",
    title: "",
    type: "",
    level: "",
    thumbnail: "",
    videoUrl: "",
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const responase2 = await ApiService.safeGet("/workouts/approved");
      console.log(responase2.data); // Check the data structure in the console

      const responase = await ApiService.safeGet("/workouts/approved");

      setRowData(responase.data); // Make sure the state is updated with correct data
    } catch (error) {
      console.error("Error fetching workouts:", error);
      toast.error("Failed to fetch workouts");
    } finally {
      setLoading(false);
    }
  };
  const saveWorkout = async () => {
    try {
      setLoading(true);
      // Ensure the thumbnail is properly set before saving
      const workoutToSave = {
        ...newWorkout,
        thumbnail:
          newWorkout.thumbnail || getYouTubeThumbnailUrl(newWorkout.videoUrl), // Fallback to generating thumbnail from video URL
      };

      if (newWorkout.id) {
        // Update existing workout
        await ApiService.safePut(
          `/workouts/approved/${newWorkout.id}`,
          workoutToSave
        );
      } else {
        // Create new workout
        await ApiService.safePost("/workouts/createApproved", workoutToSave);
      }

      // Refresh the workouts list
      fetchWorkouts();
      setEditModalOpen(false);
      resetNewWorkout();
      toast.success(
        `Workout successfully ${newWorkout.id ? "updated" : "created"}`
      );
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error(`Failed to ${newWorkout.id ? "update" : "create"} workout`);
    } finally {
      setLoading(false);
    }
  };
  const deleteWorkout = async (id) => {
    try {
      setLoading(true);
      if (!id) {
        console.error("No workout ID provided for deletion.");
        return;
      }

      // Delete the workout from the API
      await ApiService.safeDelete(`/workouts/approved/${id}`);

      fetchWorkouts();
      setEditModalOpen(false);
      resetNewWorkout();
      toast.success(`Workout successfully deleted`);
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error(`Failed to delete workout`);
    } finally {
      setLoading(false);
    }
  };

  const resetNewWorkout = () => {
    setNewWorkout({
      id: "",
      title: "",
      type: "",
      level: "",
      thumbnail: "",
      videoUrl: "",
    });
  };
  const columnDefs = [
    {
      headerName: "Thumbnail",
      field: "thumbnail",
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        const thumbnailUrl = getYouTubeThumbnailUrl(params.data.videoUrl);
        return (
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );
      },
    },
    { headerName: "Title", field: "title", sortable: true, filter: true },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { headerName: "Level", field: "level", sortable: true, filter: true },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <button
            onClick={() => handleViewWorkout(params.data)}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              marginRight: "5px",
              borderRadius: "4px",
            }}
          >
            View
          </button>
          <button
            onClick={() => handleEditWorkout(params.data)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              marginRight: "5px",
              borderRadius: "4px",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => deleteWorkout(params.data.id)} // Call delete with workout data
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
    setViewModalOpen(true);
  };

  const handleEditWorkout = (workout) => {
    setNewWorkout(workout);
    setEditModalOpen(true);
  };

  const handleCreateNewWorkout = () => {
    resetNewWorkout();
    setEditModalOpen(true);
  };
  const handleBulkUpload = async () => {
    setLoading(true);
    if (!selectedBulkFile) {
      console.error("No file selected for bulk upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedBulkFile);

    try {
      ///// NEED TO FIX HAVENT TOUCHED

      // Make an API call to upload the bulk file
      const response = await ApiService.safePost(
        "/personalized-workout/bulk-upload",
        formData
      );

      // After successful upload, refresh the workouts list
      fetchWorkouts();
      setBulkModalOpen(false); // Close the modal after upload
      setSelectedBulkFile(null); // Reset the file input state
      console.log("Bulk upload successful:", response.data);
      toast.success(`BULK uploaded`);
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error(`Failed. Could not create workouts.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>General Workouts</h2>

      <div>
        <button
          onClick={handleCreateNewWorkout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "15px",
            marginRight: "20px",
          }}
        >
          Create New Workout
        </button>
        <button
          onClick={() => setBulkModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          Bulk Upload Workouts
        </button>
      </div>

      <div style={{ width: "100%" }}>
        <div
          className="ag-theme-alpine"
          style={{ height: "500px", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ resizable: true }}
            rowHeight={200}
            modules={[
              ClientSideRowModelModule,
              PaginationModule,
              RowSelectionModule,
              TextFilterModule,
            ]}
            animateRows={true}
            rowSelection="single"
          />
        </div>
      </div>

      {/* View Workout Modal */}
      <SingleModalComponent
        show={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Workout Details - ${selectedWorkout?.title}`}
      >
        <p>
          <strong>Title:</strong> {selectedWorkout?.title}
        </p>
        <p>
          <strong>Type:</strong> {selectedWorkout?.type}
        </p>
        <p>
          <strong>Level:</strong> {selectedWorkout?.level}
        </p>
        {selectedWorkout?.thumbnail && (
          <img
            src={selectedWorkout?.thumbnail}
            alt={selectedWorkout?.title}
            style={{ width: "100%", marginBottom: "10px", borderRadius: "4px" }}
          />
        )}
        {selectedWorkout?.videoUrl && (
          <a
            href={selectedWorkout?.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Watch Video
          </a>
        )}
      </SingleModalComponent>

      {/* Edit/Create Workout Modal */}
      <SingleModalComponent
        show={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={saveWorkout}
        onCancel={() => setEditModalOpen(false)}
        title={newWorkout.id ? "Edit Workout" : "Create Workout"}
      >
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="title"
              style={{ marginBottom: "5px", fontWeight: "600" }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newWorkout.title}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, title: e.target.value })
              }
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="type"
              style={{ marginBottom: "5px", fontWeight: "600" }}
            >
              Type
            </label>
            <select
              id="type"
              value={newWorkout.type}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, type: e.target.value })
              }
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              <option value="">Select Type</option>
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
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="level"
              style={{ marginBottom: "5px", fontWeight: "600" }}
            >
              Level
            </label>
            <select
              id="level"
              value={newWorkout.level}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, level: e.target.value })
              }
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              <option value="">Select Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="videoUrl"
              style={{ marginBottom: "5px", fontWeight: "600" }}
            >
              Video URL (YouTube)
            </label>
            <img
              src={newWorkout.thumbnail}
              alt="Thumbnail"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <input
              type="text"
              id="videoUrl"
              value={newWorkout.videoUrl}
              onChange={(e) => {
                const videoUrl = e.target.value;
                const thumbnail = getYouTubeThumbnailUrl(videoUrl);
                setNewWorkout({ ...newWorkout, videoUrl, thumbnail });
              }}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </form>
      </SingleModalComponent>

      {/* BULK Workout Modal */}
      <SingleModalComponent
        show={isBulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSave={handleBulkUpload} // Upload file on Save
        onCancel={() => setBulkModalOpen(false)}
        title="Bulk Upload Workouts"
      >
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Bulk Upload Section */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="bulkUpload"
              style={{ marginBottom: "5px", fontWeight: "600" }}
            >
              Upload Bulk CSV or XLSX
            </label>
            <input
              type="file"
              id="bulkUpload"
              accept=".xlsx, .csv"
              onChange={(e) => setSelectedBulkFile(e.target.files[0])}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            />
            <span style={{ fontSize: "12px", color: "#777" }}>
              Upload a CSV or XLSX file with workout data to add multiple
              workouts.
            </span>
          </div>
        </form>
      </SingleModalComponent>
      <LoadingOverlay isLoading={loading} message="Loading..." />
    </div>
  );
};

export default WorkoutsPage;
