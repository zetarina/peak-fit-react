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
      console.log("Starting fetchAndListenUserData...");

      try {
        // Step 1: Validate user and get UID
        console.log("Calling /auth/validate to get UID...");
        const { uid } = await ApiService.safeGet("/auth/validate");
        console.log("UID fetched:", uid);

        if (!uid) {
          throw new Error("UID not found. Redirecting to login.");
        }

        // Step 2: Construct Firebase path
        const path = `business-users/${uid}/isApproveUser`;
        console.log("Firebase path constructed:", path);

        // Step 3: Listen to approval status in Firebase
        console.log("Setting up Firebase listener...");
        const unsubscribe = FirebaseService.listenToUserData(path, (data) => {
          console.log("Firebase listener triggered. Data received:", data);

          if (data === null) {
            console.error("Account not found in Firebase. Redirecting to login.");
            handleLogout();
            return;
          }

          // Step 4: Update state
          setIsApproved(data);
          setLoading(false);
        });

        // Step 5: Cleanup listener on unmount
        return () => {
          console.log("Cleaning up Firebase listener...");
          unsubscribe();
        };
      } catch (error) {
        console.error("Error in fetchAndListenUserData:", error.message);
        handleLogout();
      }
    };

    const handleLogout = () => {
      console.log("Logging out user. Clearing tokens...");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      console.log("Redirecting to login...");
      navigate("/login");
    };

    fetchAndListenUserData();
  }, [navigate]);

  return { isApproved, loading };
};

export default useUserApprovalStatus;
