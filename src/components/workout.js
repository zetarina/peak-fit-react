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

const Mails = () => {
  const [rowData, setRowData] = useState([]);

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, flex: 1 },
    { headerName: "Title", field: "title", editable: true, flex: 2 },
    {
      headerName: "Video",
      field: "videoUrl",
      cellRenderer: (params) =>
        params.value
          ? `<a href="${params.value}" target="_blank">Watch Video</a>`
          : "No Video",
      flex: 2,
    },
    {
      headerName: "Level",
      field: "level",
      sortable: true,
      filter: true,
      flex: 1,
      editable: true,
    },
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: true,
      flex: 1,
      editable: true,
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params) => {
        const id = params.value;
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#AFE1AF",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleApprove(id)} // Use JSX's onClick
            >
              Approve
            </button>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#e57373",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleDecline(id)} // Use JSX's onClick
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

  const handleApprove = async (id) => {
    const workoutToApprove = rowData.find((workout) => workout.id === id);

    if (!workoutToApprove) return;

    try {
      const response = await ApiService.post("/workouts/approve", {
        workout: {
          ...workoutToApprove,
          "content-name": workoutToApprove.title,
          "content-url": workoutToApprove.videoUrl,
        },
      });

      if (response.success) {
        setRowData((prev) => prev.filter((workout) => workout.id !== id));
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
        console.log("Workout declined successfully");
      } else {
        console.error("Failed to decline workout:", response.message);
      }
    } catch (error) {
      console.error("Error declining workout:", error.message);
    }
  };

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
};

export default Mails;
