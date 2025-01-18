import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ApiService from "@/services/ApiService";

const VerifyWithLink = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    const verify = async () => {
      try {
        const { authToken } = await ApiService.post("/auth/verify-signup", {
          email,
          code,
        });
        localStorage.setItem("authToken", authToken);
        navigate("/dashboard");
      } catch (error) {
        console.error("Verification failed:", error.message);
        navigate("/verify");
      }
    };

    if (email && code) {
      verify();
    } else {
      navigate("/verify");
    }
  }, [searchParams, navigate]);

  return <div>Verifying...</div>;
};

export default VerifyWithLink;
