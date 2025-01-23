import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  PaginationModule,
  RowSelectionModule,
  TextFilterModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme CSS
import ApiService from "@/services/ApiService";
import getYouTubeThumbnailUrl from "../../utils/youtube";
const Mails = () => {
  const [rowData, setRowData] = useState([]);
  const [editableData, setEditableData] = useState({}); // Tracks changes

  const handleFieldChange = (id, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (id) => {
    const updatedWorkout =
      editableData[id] || rowData.find((row) => row.id === id);
    console.log(updatedWorkout);
    console.log(editableData[id]);

    if (!updatedWorkout) return;
    const workout = {
      id,
      level:
        editableData[id].level || rowData.find((row) => row.id === id).level,
      type: editableData[id].type || rowData.find((row) => row.id === id).type,
      title:
        editableData[id].title ||
        rowData.find((row) => row.id === id)["content-name"],
      videoUrl: rowData.find((row) => row.id === id)["content-url"],
      thumbnailUrl: getYouTubeThumbnailUrl(
        rowData.find((row) => row.id === id)["content-url"]
      ),
    };
    console.log(workout);
    try {
      const response = await ApiService.post(`/workouts/approve`, { workout });
      console.log(response);
      if (response.success) {
        setRowData((prev) => prev.filter((workout) => workout.id !== id));
        setEditableData((prev) => {
          const newEditableData = { ...prev };
          delete newEditableData[id];
          return newEditableData;
        });
        console.log("Workout approved successfully");
      } else {
        console.error("Failed to approve workout:", response.message);
      }
    } catch (error) {
      console.error("Error approving workout:", error.message);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await ApiService.delete(`/workouts/pending/${id}`);

      if (response.success) {
        setRowData((prev) => prev.filter((workout) => workout.id !== id));
        setEditableData((prev) => {
          const newEditableData = { ...prev };
          delete newEditableData[id];
          return newEditableData;
        });
        console.log("Workout declined successfully");
      } else {
        console.error("Failed to decline workout:", response.message);
      }
    } catch (error) {
      console.error("Error declining workout:", error.message);
    }
  };

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Title",
      field: "title",
      cellRenderer: (params) => (
        <input
          type="text"
          value={editableData[params.data.id]?.title || params.value}
          onChange={(e) =>
            handleFieldChange(params.data.id, "title", e.target.value)
          }
          style={styles.input}
        />
      ),
      flex: 2,
    },
    {
      headerName: "Video",
      field: "videoUrl",
      cellRenderer: (params) => {
        if (params.value) {
          const thumbnailUrl = getYouTubeThumbnailUrl(params.value);
          return (
            <a href={params.value} target="_blank" rel="noopener noreferrer">
              <img
                src={thumbnailUrl}
                alt="YouTube Thumbnail"
                style={{ width: "100px", height: "auto", cursor: "pointer" }}
              />
            </a>
          );
        }
        return "No Video";
      },
      flex: 2,
    },

    {
      headerName: "Level",
      field: "level",
      cellRenderer: (params) => (
        <select
          value={editableData[params.data.id]?.level || params.value}
          onChange={(e) =>
            handleFieldChange(params.data.id, "level", e.target.value)
          }
          style={styles.select}
        >
          <option value="Select Level">Select Level</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      ),
      flex: 1,
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: (params) => (
        <select
          value={editableData[params.data.id]?.type || params.value}
          onChange={(e) =>
            handleFieldChange(params.data.id, "type", e.target.value)
          }
          style={styles.select}
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
      ),
      flex: 1,
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params) => {
        const data = params.data;
        const editableEntry = editableData[data.id] || data;

        // Check if level or type is not selected
        const isDisabled =
          editableEntry.level === "Select Level" ||
          editableEntry.type === "Select Category" ||
          !editableEntry.level ||
          !editableEntry.type;

        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                ...styles.approveButton,
                opacity: isDisabled ? 0.6 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
              onClick={() => handleApprove(params.value)}
              disabled={isDisabled}
            >
              Approve
            </button>
            <button
              style={styles.declineButton}
              onClick={() => handleDecline(params.value)}
            >
              Decline
            </button>
          </div>
        );
      },
      flex: 2,
    },
  ];

  useEffect(() => {
    const fetchPendingWorkouts = async () => {
      try {
        const response = await ApiService.get("/workouts/pending");
        const normalizedData = response.data.map((workout) => ({
          ...workout,
          title: workout["content-name"] || workout.title,
          videoUrl: workout["content-url"] || workout.videoUrl,
        }));
        setRowData(normalizedData);
      } catch (error) {
        console.error("Error fetching workouts:", error.message);
      }
    };

    fetchPendingWorkouts();
  }, []);

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>All Mails</h3>
      <div
        className="ag-theme-alpine"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          modules={[
            ClientSideRowModelModule,
            PaginationModule,
            RowSelectionModule,
            TextFilterModule,
            TextEditorModule,
            ValidationModule,
          ]}
          animateRows={true}
          rowSelection="single"
        />
      </div>
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
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "5px",
  },
  select: {
    width: "100%",
    padding: "5px",
  },
  approveButton: {
    padding: "5px 10px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  declineButton: {
    padding: "5px 10px",
    backgroundColor: "#e57373",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Mails;
