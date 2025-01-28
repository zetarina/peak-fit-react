import { createContext, useContext, useState, useEffect } from "react";
import ApiService from "@/services/ApiService";
import useUserApprovalStatus from "@/hooks/useUserApprovalStatus";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isApproved, loading: approvalLoading } = useUserApprovalStatus();

  const fetchUserData = async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      console.warn("No auth token found. Skipping user fetch.");
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.safeGet("/me/my-account");
      setUser({
        ...response.user,
        isApproveUser: response.user?.isApproveUser ?? isApproved,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && isApproved !== undefined) {
      setUser((prevUser) => ({
        ...prevUser,
        isApproveUser: isApproved,
      }));
    }
  }, [isApproved]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading, // Handles user data loading only
        refetchUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
