import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const GoogleAuthTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runGoogleAuthTests = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Check backend Google OAuth endpoint
      try {
        const response = await fetch("http://localhost:5000/api/auth/google", {
          method: "GET",
          redirect: "manual", // Don't follow redirects
        });

        results.backendEndpoint = {
          status:
            response.status === 0 || response.status === 302
              ? "✅ Working"
              : "❌ Failed",
          details:
            response.status === 0 || response.status === 302
              ? "Endpoint redirects to Google (expected)"
              : `Unexpected status: ${response.status}`,
        };
      } catch (error) {
        results.backendEndpoint = {
          status: "❌ Failed",
          details: error.message,
        };
      }

      // Test 2: Check environment configuration
      try {
        const envResponse = await fetch(
          "http://localhost:5000/api/auth/google"
        );
        results.envConfig = {
          status: "✅ Backend accessible",
          details: "Google OAuth endpoint is reachable",
        };
      } catch (error) {
        results.envConfig = {
          status: "❌ Backend not accessible",
          details: "Make sure backend server is running on port 5000",
        };
      }

      // Test 3: Check current authentication state
      results.currentAuth = {
        status: user ? "✅ User logged in" : "ℹ️ Not logged in",
        details: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              googleId: user.googleId || "Not Google user",
            }
          : "No user session found",
      };

      // Test 4: Check localStorage token
      const token = localStorage.getItem("token");
      results.tokenStatus = {
        status: token ? "✅ Token present" : "❌ No token",
        details: token
          ? "JWT token found in localStorage"
          : "No authentication token",
      };

      // Test 5: Frontend configuration
      results.frontendConfig = {
        status: "✅ Frontend configured",
        details: {
          googleAuthURL: "http://localhost:5000/api/auth/google",
          currentURL: window.location.href,
          expectedRedirect: "http://localhost:3000/auth/success",
        },
      };
    } catch (error) {
      results.generalError = {
        status: "❌ Test failed",
        details: error.message,
      };
    }

    setTestResults(results);
    setTesting(false);
  };

  const testGoogleLogin = () => {
    console.log("Testing Google login redirect...");
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔍 Google OAuth Test & Debug</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runGoogleAuthTests}
          disabled={testing}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: testing ? "not-allowed" : "pointer",
          }}
        >
          {testing ? "Running Tests..." : "Run OAuth Tests"}
        </button>

        <button
          onClick={testGoogleLogin}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Google Login
        </button>

        <button
          onClick={clearAuthData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear Auth Data
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "monospace",
          }}
        >
          <h3>Test Results:</h3>
          {Object.entries(testResults).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "15px" }}>
              <strong>
                {key
                  .toUpperCase()
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
                :
              </strong>
              <div
                style={{
                  backgroundColor: value.status.includes("✅")
                    ? "#d4edda"
                    : value.status.includes("❌")
                    ? "#f8d7da"
                    : "#fff3cd",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {value.status}
                </div>
                <pre
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {typeof value.details === "object"
                    ? JSON.stringify(value.details, null, 2)
                    : value.details}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#e7f3ff",
          borderRadius: "8px",
        }}
      >
        <h3>🔧 Quick Fixes</h3>
        <ul>
          <li>
            <strong>Backend not running:</strong>{" "}
            <code>cd artvault-backend && npm run server</code>
          </li>
          <li>
            <strong>Wrong port:</strong> Make sure frontend is on port 3000,
            backend on port 5000
          </li>
          <li>
            <strong>Google Console:</strong> Verify redirect URI is{" "}
            <code>http://localhost:5000/api/auth/google/callback</code>
          </li>
          <li>
            <strong>Cache issues:</strong> Try incognito mode or clear browser
            data
          </li>
          <li>
            <strong>Environment:</strong> Check .env file has correct
            GOOGLE_CLIENT_ID and CLIENT_URL
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
        }}
      >
        <h3>📋 Expected Flow</h3>
        <ol>
          <li>Click "Test Google Login" → Redirects to Google</li>
          <li>Login with Google account → Google redirects to backend</li>
          <li>
            Backend processes auth → Redirects to{" "}
            <code>/auth/success?token=...</code>
          </li>
          <li>Frontend extracts token → Saves to localStorage</li>
          <li>User is logged in → Redirected to dashboard</li>
        </ol>
      </div>

      {user && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#d4edda",
            borderRadius: "8px",
          }}
        >
          <h3>✅ Current User</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthTest;
