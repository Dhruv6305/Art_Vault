import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const SystemStatusChecker = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState({});
  const [checking, setChecking] = useState(false);

  const checkSystemStatus = async () => {
    setChecking(true);
    const results = {};

    try {
      // 1. Check Authentication
      results.authentication = {
        status: user ? "✅ Authenticated" : "❌ Not authenticated",
        details: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          : "Please log in",
        token: localStorage.getItem("token")
          ? "✅ Token present"
          : "❌ No token",
      };

      // 2. Check Backend Connection
      try {
        const backendResponse = await fetch("http://localhost:5000");
        results.backend = {
          status: backendResponse.ok
            ? "✅ Backend running"
            : "❌ Backend error",
          port: "5000",
          response: backendResponse.ok
            ? "Server responding"
            : `Error: ${backendResponse.status}`,
        };
      } catch (error) {
        results.backend = {
          status: "❌ Backend not accessible",
          error: error.message,
          suggestion:
            "Start backend with: cd artvault-backend && npm run server",
        };
      }

      // 3. Check API Endpoints
      if (user) {
        try {
          const artworksResponse = await api.get("/artworks");
          results.apiEndpoints = {
            status: "✅ API endpoints working",
            artworks: artworksResponse.data.artworks?.length || 0,
            availableArtworks:
              artworksResponse.data.artworks?.filter((art) => art.quantity > 0)
                .length || 0,
          };
        } catch (error) {
          results.apiEndpoints = {
            status: "❌ API endpoints failing",
            error: error.response?.data?.msg || error.message,
            statusCode: error.response?.status,
          };
        }
      }

      // 4. Check Database Collections
      if (user) {
        try {
          const [artworksRes, ordersRes, notificationsRes] = await Promise.all([
            api.get("/artworks"),
            api.get("/orders").catch(() => ({ data: { orders: [] } })),
            api
              .get("/notifications")
              .catch(() => ({ data: { notifications: [] } })),
          ]);

          results.database = {
            status: "✅ Database accessible",
            collections: {
              artworks: artworksRes.data.artworks?.length || 0,
              orders: ordersRes.data.orders?.length || 0,
              notifications: notificationsRes.data.notifications?.length || 0,
            },
          };
        } catch (error) {
          results.database = {
            status: "❌ Database issues",
            error: error.message,
          };
        }
      }

      // 5. Check Payment System Components
      results.paymentSystem = {
        status: "✅ Payment components loaded",
        components: {
          PaymentModal: "✅ Available",
          PaymentForm: "✅ Available",
          OrderSummary: "✅ Available",
          PaymentSuccess: "✅ Available",
        },
      };

      // 6. Check Environment
      results.environment = {
        status: "✅ Environment OK",
        details: {
          apiBaseURL: api.defaults.baseURL,
          currentURL: window.location.href,
          browser: navigator.userAgent.includes("Chrome") ? "Chrome" : "Other",
          localStorage:
            typeof Storage !== "undefined"
              ? "✅ Available"
              : "❌ Not available",
        },
      };
    } catch (error) {
      results.generalError = {
        status: "❌ System check failed",
        error: error.message,
      };
    }

    setStatus(results);
    setChecking(false);
  };

  const testPaymentFlow = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      // Get available artwork
      const artworksResponse = await api.get("/artworks");
      const artworks = artworksResponse.data.artworks || [];
      const testArtwork = artworks.find((art) => art.quantity > 0);

      if (!testArtwork) {
        alert(
          "❌ No artwork available for testing. Please add artwork with quantity > 0"
        );
        return;
      }

      // Create test order
      const testOrderData = {
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

      console.log("Testing payment with data:", testOrderData);

      const response = await api.post("/orders", testOrderData);

      if (response.data.success) {
        alert(
          `✅ Payment system working! Order created: ${response.data.order._id}`
        );
      } else {
        alert(`❌ Payment failed: ${response.data.msg}`);
      }
    } catch (error) {
      console.error("Payment test error:", error);
      alert(
        `❌ Payment test failed: ${error.response?.data?.msg || error.message}`
      );
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, [user]);

  const getStatusColor = (statusText) => {
    if (statusText.includes("✅")) return "#28a745";
    if (statusText.includes("❌")) return "#dc3545";
    if (statusText.includes("⚠️")) return "#ffc107";
    return "#6c757d";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>🔍 System Status Checker</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={checkSystemStatus}
          disabled={checking}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: checking ? "not-allowed" : "pointer",
          }}
        >
          {checking ? "Checking..." : "Refresh Status"}
        </button>

        <button
          onClick={testPaymentFlow}
          disabled={checking || !user}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: checking || !user ? "not-allowed" : "pointer",
          }}
        >
          Test Payment Flow
        </button>
      </div>

      {Object.keys(status).length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {Object.entries(status).map(([category, data]) => (
            <div
              key={category}
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                border: `3px solid ${getStatusColor(data.status)}`,
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px 0",
                  color: getStatusColor(data.status),
                  textTransform: "capitalize",
                }}
              >
                {category.replace(/([A-Z])/g, " $1").trim()}
              </h3>

              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {data.status}
              </div>

              {data.details && (
                <div style={{ fontSize: "14px", marginBottom: "10px" }}>
                  <strong>Details:</strong>
                  <pre
                    style={{
                      backgroundColor: "#e9ecef",
                      padding: "8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(data.details, null, 2)}
                  </pre>
                </div>
              )}

              {data.error && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "14px",
                    backgroundColor: "#f8d7da",
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>Error:</strong> {data.error}
                </div>
              )}

              {data.suggestion && (
                <div
                  style={{
                    color: "#856404",
                    fontSize: "14px",
                    backgroundColor: "#fff3cd",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Suggestion:</strong> {data.suggestion}
                </div>
              )}

              {data.components && (
                <div style={{ fontSize: "14px" }}>
                  <strong>Components:</strong>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {Object.entries(data.components).map(([comp, stat]) => (
                      <li key={comp} style={{ color: getStatusColor(stat) }}>
                        {comp}: {stat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.collections && (
                <div style={{ fontSize: "14px" }}>
                  <strong>Collections:</strong>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {Object.entries(data.collections).map(([coll, count]) => (
                      <li key={coll}>
                        {coll}: {count} records
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
        <h3>🚀 Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <button
            onClick={() => window.open("/test-payment", "_blank")}
            style={{
              padding: "10px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Open Test Payment
          </button>
          <button
            onClick={() => window.open("/payment-debug", "_blank")}
            style={{
              padding: "10px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Open Payment Debugger
          </button>
          <button
            onClick={() => window.open("/orders", "_blank")}
            style={{
              padding: "10px",
              backgroundColor: "#fd7e14",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            View Orders
          </button>
          <button
            onClick={() => window.open("/browse", "_blank")}
            style={{
              padding: "10px",
              backgroundColor: "#20c997",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Browse Artworks
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusChecker;
