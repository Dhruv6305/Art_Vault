import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const PaymentDebugger = () => {
  const { user } = useAuth();
  const [debugResults, setDebugResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Check authentication
      results.auth = {
        status: user ? "✅ Authenticated" : "❌ Not authenticated",
        user: user ? { id: user.id, name: user.name, email: user.email } : null,
        token: localStorage.getItem("token")
          ? "✅ Token present"
          : "❌ No token",
      };

      // Test 2: Check backend connectivity
      try {
        const response = await api.get("/artworks");
        results.backend = {
          status: "✅ Backend connected",
          artworks: response.data.artworks?.length || 0,
        };
      } catch (error) {
        results.backend = {
          status: "❌ Backend connection failed",
          error: error.message,
        };
      }

      // Test 3: Test order creation with mock data
      if (user) {
        try {
          const mockOrderData = {
            artworkId: "507f1f77bcf86cd799439011", // Mock ID
            quantity: 1,
            shippingInfo: {
              fullName: "Test User",
              email: "test@example.com",
              address: "123 Test St",
              city: "Test City",
              state: "TS",
              zipCode: "12345",
              country: "United States",
            },
            shippingMethod: "standard",
            paymentData: {
              transactionId: "TEST_TXN_123",
              paymentMethod: "Credit Card",
              processedAt: new Date().toISOString(),
            },
            subtotal: 100,
            tax: 8,
            shipping: 15.99,
            total: 123.99,
          };

          const orderResponse = await api.post("/orders", mockOrderData);
          results.orderCreation = {
            status: "✅ Order creation works",
            response: orderResponse.data,
          };
        } catch (error) {
          results.orderCreation = {
            status: "❌ Order creation failed",
            error: error.response?.data?.msg || error.message,
            details: error.response?.data,
          };
        }
      }

      // Test 4: Check if artwork exists for testing
      try {
        const artworkResponse = await api.get("/artworks");
        const artworks = artworkResponse.data.artworks || [];
        const availableArtwork = artworks.find((art) => art.quantity > 0);

        results.testArtwork = {
          status: availableArtwork
            ? "✅ Test artwork available"
            : "❌ No artwork with quantity > 0",
          artwork: availableArtwork
            ? {
                id: availableArtwork._id,
                title: availableArtwork.title,
                quantity: availableArtwork.quantity,
                price: availableArtwork.price,
              }
            : null,
          totalArtworks: artworks.length,
        };
      } catch (error) {
        results.testArtwork = {
          status: "❌ Failed to fetch artworks",
          error: error.message,
        };
      }

      // Test 5: Check environment
      results.environment = {
        apiBaseURL: api.defaults.baseURL,
        currentURL: window.location.href,
        userAgent: navigator.userAgent.includes("Chrome")
          ? "✅ Chrome"
          : "⚠️ Other browser",
      };
    } catch (error) {
      results.generalError = {
        status: "❌ General error",
        error: error.message,
      };
    }

    setDebugResults(results);
    setTesting(false);
  };

  const testPaymentFlow = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    setTesting(true);
    try {
      // Get first available artwork
      const artworkResponse = await api.get("/artworks");
      const artworks = artworkResponse.data.artworks || [];
      const testArtwork = artworks.find((art) => art.quantity > 0);

      if (!testArtwork) {
        alert("No artwork available for testing");
        setTesting(false);
        return;
      }

      // Create test order
      const testOrder = {
        artworkId: testArtwork._id,
        quantity: 1,
        shippingInfo: {
          fullName: user.name || "Test User",
          email: user.email || "test@example.com",
          address: "123 Test Street",
          city: "Test City",
          state: "CA",
          zipCode: "90210",
          country: "United States",
        },
        shippingMethod: "standard",
        paymentData: {
          transactionId: `TEST_${Date.now()}`,
          paymentMethod: "Credit Card",
          processedAt: new Date().toISOString(),
        },
        subtotal: testArtwork.price,
        tax: testArtwork.price * 0.08,
        shipping: 15.99,
        total: testArtwork.price + testArtwork.price * 0.08 + 15.99,
      };

      const response = await api.post("/orders", testOrder);

      if (response.data.success) {
        alert(
          `✅ Payment test successful! Order ID: ${response.data.order._id}`
        );
      } else {
        alert(`❌ Payment test failed: ${response.data.msg}`);
      }
    } catch (error) {
      alert(
        `❌ Payment test error: ${error.response?.data?.msg || error.message}`
      );
    }
    setTesting(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔧 Payment System Debugger</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runDiagnostics}
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
          {testing ? "Running Diagnostics..." : "Run Diagnostics"}
        </button>

        <button
          onClick={testPaymentFlow}
          disabled={testing || !user}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: testing || !user ? "not-allowed" : "pointer",
          }}
        >
          {testing ? "Testing..." : "Test Payment Flow"}
        </button>
      </div>

      {Object.keys(debugResults).length > 0 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "monospace",
          }}
        >
          <h3>Diagnostic Results:</h3>
          {Object.entries(debugResults).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "15px" }}>
              <strong>{key.toUpperCase()}:</strong>
              <pre
                style={{
                  backgroundColor: "#e9ecef",
                  padding: "10px",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(value, null, 2)}
              </pre>
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
        <h3>🚨 Common Payment Issues & Solutions:</h3>
        <ul>
          <li>
            <strong>Authentication Error:</strong> Make sure you're logged in
            and have a valid token
          </li>
          <li>
            <strong>Backend Connection:</strong> Ensure backend server is
            running on port 5000
          </li>
          <li>
            <strong>CORS Issues:</strong> Check if CORS is properly configured
            in backend
          </li>
          <li>
            <strong>Missing Artwork:</strong> Ensure there are artworks with
            quantity > 0
          </li>
          <li>
            <strong>Database Connection:</strong> Verify MongoDB is running and
            connected
          </li>
          <li>
            <strong>Missing Dependencies:</strong> Check if all npm packages are
            installed
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#d1ecf1",
          borderRadius: "8px",
        }}
      >
        <h3>📋 Quick Fixes:</h3>
        <ol>
          <li>
            Restart backend server:{" "}
            <code>cd artvault-backend && npm run server</code>
          </li>
          <li>Clear browser cache and localStorage</li>
          <li>Check browser console for errors</li>
          <li>Verify .env file has JWT_SECRET</li>
          <li>Ensure MongoDB is running</li>
          <li>
            Check if nodemailer is installed: <code>npm list nodemailer</code>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PaymentDebugger;
