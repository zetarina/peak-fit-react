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
      try {
        const { uid } = await ApiService.safeGet("/auth/validate");

        if (!uid) {
          throw new Error("UID not found. Redirecting to login.");
        }

        // Step 2: Construct Firebase path
        const path = `business-users/${uid}/isApproveUser`;

        // Step 3: Listen to approval status in Firebase
        const unsubscribe = FirebaseService.listenToUserData(path, (data) => {
          if (data === null) {
            handleLogout();
            return;
          }

          // Step 4: Update state
          setIsApproved(data);
          setLoading(false);
        });

        // Step 5: Cleanup listener on unmount
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
