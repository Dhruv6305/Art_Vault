import React, { useState } from "react";
import api from "../api/axios.js";

const TokenTest = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testCurrentToken = async () => {
    setTesting(true);
    const testResults = {};

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      testResults.tokenStatus = {
        exists: !!token,
        token: token ? `${token.substring(0, 50)}...` : "No token found",
      };

      if (token) {
        // Test if token works with /auth/me endpoint
        try {
          const response = await api.get("/auth/me");
          testResults.userDataTest = {
            success: true,
            user: response.data,
            message: "Token is valid and user data loaded successfully",
          };
        } catch (error) {
          testResults.userDataTest = {
            success: false,
            error: error.response?.data?.msg || error.message,
            status: error.response?.status,
            message: "Token validation failed",
          };
        }

        // Decode JWT token (basic decode, not verification)
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            testResults.tokenDecoded = {
              success: true,
              payload: payload,
              userId: payload.user?.id,
              issuedAt: new Date(payload.iat * 1000).toLocaleString(),
              expiresAt: new Date(payload.exp * 1000).toLocaleString(),
              isExpired: payload.exp * 1000 < Date.now(),
            };
          }
        } catch (error) {
          testResults.tokenDecoded = {
            success: false,
            error: "Failed to decode token",
          };
        }
      }

      // Test API connectivity
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            "x-auth-token": token,
          },
        });
        testResults.apiConnectivity = {
          success: response.ok,
          status: response.status,
          message: response.ok
            ? "API is accessible"
            : `API returned ${response.status}`,
        };
      } catch (error) {
        testResults.apiConnectivity = {
          success: false,
          error: error.message,
          message: "Cannot connect to API",
        };
      }
    } catch (error) {
      testResults.generalError = {
        error: error.message,
      };
    }

    setResults(testResults);
    setTesting(false);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setResults({});
    alert("Token cleared from localStorage");
  };

  const redirectToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔍 Token & Authentication Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testCurrentToken}
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
          {testing ? "Testing..." : "Test Current Token"}
        </button>

        <button
          onClick={clearToken}
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
          Clear Token
        </button>

        <button
          onClick={redirectToDashboard}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "monospace",
          }}
        >
          <h3>Test Results:</h3>
          {Object.entries(results).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  color:
                    value.success === false
                      ? "#dc3545"
                      : value.success === true
                      ? "#28a745"
                      : "#007bff",
                  textTransform: "capitalize",
                  marginBottom: "10px",
                }}
              >
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </h4>

              <div
                style={{
                  backgroundColor:
                    value.success === false
                      ? "#f8d7da"
                      : value.success === true
                      ? "#d4edda"
                      : "#e9ecef",
                  padding: "15px",
                  borderRadius: "4px",
                  border: `1px solid ${
                    value.success === false
                      ? "#f5c6cb"
                      : value.success === true
                      ? "#c3e6cb"
                      : "#dee2e6"
                  }`,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {JSON.stringify(value, null, 2)}
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
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
        }}
      >
        <h3>🔧 Troubleshooting Steps</h3>
        <ol>
          <li>
            <strong>Test Token:</strong> Click "Test Current Token" to verify
            authentication
          </li>
          <li>
            <strong>Check Expiry:</strong> Look at token expiration time in
            results
          </li>
          <li>
            <strong>API Connection:</strong> Verify backend is running and
            accessible
          </li>
          <li>
            <strong>Clear & Retry:</strong> If token is invalid, clear it and
            login again
          </li>
          <li>
            <strong>Dashboard Access:</strong> Try accessing dashboard directly
          </li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#e7f3ff",
          borderRadius: "8px",
        }}
      >
        <h3>📋 Expected Flow After Google Login</h3>
        <ol>
          <li>
            Google redirects to <code>/auth/success?token=...</code>
          </li>
          <li>AuthSuccess component extracts token</li>
          <li>Token saved to localStorage</li>
          <li>loadUser() called to get user data</li>
          <li>Redirect to dashboard</li>
        </ol>

        <p>
          <strong>If stuck on auth/success page:</strong> The loadUser()
          function might be failing. Check the test results above.
        </p>
      </div>
    </div>
  );
};

export default TokenTest;
