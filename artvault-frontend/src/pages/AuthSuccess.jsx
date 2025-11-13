import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getAndClearPostLoginIntent } from "../utils/postLoginIntent.js";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [status, setStatus] = useState("Processing authentication...");
  const [error, setError] = useState(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) {
      console.log("AuthSuccess: Already processed, skipping");
      return;
    }

    const handleAuth = async () => {
      hasProcessedRef.current = true;
      try {
        console.log("AuthSuccess: Processing OAuth callback");
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        console.log("AuthSuccess: Token received:", token ? "Yes" : "No");

        if (token) {
          setStatus("Saving authentication token...");
          localStorage.setItem("token", token);
          console.log("AuthSuccess: Token saved to localStorage");

          setStatus("Loading user data...");
          await loadUser();

          // Get and clear post-login intent using utility function
          const intent = getAndClearPostLoginIntent();

          setStatus("Redirecting...");
          setTimeout(() => {
            // Handle buy action with triggerBuyNow flag
            if (intent?.returnTo && intent?.action === "buy") {
              navigate(intent.returnTo, { state: { triggerBuyNow: true }, replace: true });
            } else if (intent?.returnTo) {
              // Handle other actions or simple return navigation
              navigate(intent.returnTo, { replace: true });
            } else {
              // No intent found, redirect to default dashboard
              navigate("/dashboard");
            }
          }, 500);
        } else {
          console.error("AuthSuccess: No token found in URL");
          setError("No authentication token received");
          setTimeout(() => {
            navigate("/login?error=no_token");
          }, 2000);
        }
      } catch (err) {
        console.error("AuthSuccess: Error during authentication:", err);
        setError("Authentication failed: " + err.message);
        setTimeout(() => {
          navigate("/login?error=auth_processing_failed");
        }, 3000);
      }
    };

    handleAuth();
  }, [location, navigate, loadUser]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>
          {error ? "❌ Authentication Error" : "🔐 Authenticating..."}
        </h2>
        <p style={{ color: error ? "#dc3545" : "#666", fontSize: "16px" }}>
          {error || status}
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            maxWidth: "400px",
            marginTop: "20px",
          }}
        >
          <strong>Error:</strong> {error}
          <br />
          <small>Redirecting to login page...</small>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;
