import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";
import FirebaseService from "@/services/FirebaseService";

const useUserApprovalStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndListenUserData = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        console.warn("No token found. Redirecting to login.");
        return;
      }

      try {
        const { uid } = await ApiService.safeGet("/auth/validate");

        if (!uid) {
          throw new Error("UID not found. Redirecting to login.");
        }

        const path = `business-users/${uid}/isApproveUser`;

        const unsubscribe = FirebaseService.listenToUserData(path, (data) => {
          if (data === null) {
            console.error("Approval data is null. Redirecting to login.");
            handleLogout();
            return;
          }

          setIsApproved(data);
          setLoading(false);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error in fetchAndListenUserData:", error.message);
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      navigate("/login");
    };

    fetchAndListenUserData();
  }, [navigate]);

  return { isApproved, loading };
};

export default useUserApprovalStatus;
