import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { formatPrice } from "../utils/formatters.js";

const Orders = () => {
  const { } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("purchases"); // purchases or sales
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "purchases" ? "/orders" : "/orders/sales";
      const response = await api.get(endpoint);

      if (response.data.success) {
        const allOrders = activeTab === "purchases" ? response.data.orders : response.data.sales;
        // Filter out cancelled orders - show only active orders
        const activeOrders = allOrders.filter(order => order.status !== "cancelled");
        setOrders(activeOrders);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "processing":
        return "#ffc107";
      case "shipped":
        return "#17a2b8";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      case "refunded":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleCancelOrder = (order) => {
    setCancellingOrder(order);
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancellingOrder) return;

    try {
      console.log("🚫 Attempting to cancel order:", cancellingOrder._id);

      // Make the API call with a timeout
      const response = await api.put(`/orders/${cancellingOrder._id}/cancel`, {}, {
        timeout: 10000 // 10 second timeout
      });

      console.log("📋 Full response object:", response);
      console.log("📋 Response status:", response.status);
      console.log("📋 Response data:", response.data);

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        console.log("✅ HTTP request successful");

        // Update the order in the local state immediately
        setOrders(prevOrders =>
          prevOrders.filter(order => order._id !== cancellingOrder._id)
        );

        // Show success message
        alert('Order cancelled successfully');

        // Close modal
        setShowCancelConfirm(false);
        setCancellingOrder(null);

        return; // Exit early on success
      }

      // If we get here, something unexpected happened
      throw new Error(`Unexpected status code: ${response.status}`);

    } catch (err) {
      console.error("❌ Cancel order error:", err);
      console.error("📋 Error name:", err.name);
      console.error("📋 Error message:", err.message);
      console.error("📋 Error response:", err.response);

      // Special handling for timeout or network errors
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        console.log("⏰ Request timed out - checking if order was actually cancelled");

        // Wait a moment then refresh orders to see if it was cancelled
        setTimeout(async () => {
          try {
            await fetchOrders();
            // Check if the order is no longer in the list (was cancelled)
            const orderStillExists = orders.some(order => order._id === cancellingOrder._id);
            if (!orderStillExists) {
              alert('Order was cancelled successfully (confirmed after timeout)');
            }
          } catch (refreshError) {
            console.error("Failed to refresh orders:", refreshError);
          }
        }, 2000);

        alert('Request timed out. Please refresh the page to see if the order was cancelled.');
      }
      // Check if the error is actually a success (sometimes axios throws on certain status codes)
      else if (err.response && err.response.status >= 200 && err.response.status < 300) {
        console.log("🤔 Error thrown but status indicates success");

        // Update the order state
        setOrders(prevOrders =>
          prevOrders.filter(order => order._id !== cancellingOrder._id)
        );

        alert('Order cancelled successfully');
      } else {
        // It's a real error - but let's also check if the order might have been cancelled anyway
        console.log("🔍 Real error occurred, but checking if order was cancelled anyway...");

        // Wait a moment then refresh to see if order was actually cancelled
        setTimeout(async () => {
          try {
            await fetchOrders();

            // If orders list is shorter or the specific order is missing, it was probably cancelled
            const orderStillExists = orders.some(order => order._id === cancellingOrder._id);
            if (!orderStillExists) {
              alert('Order was actually cancelled successfully (despite the error message)');
              return;
            }
          } catch (refreshError) {
            console.error("Failed to refresh orders:", refreshError);
          }
        }, 1500);

        let errorMsg = 'Failed to cancel order';

        if (err.response?.data?.msg) {
          errorMsg = err.response.data.msg;
        } else if (err.response?.data?.error) {
          errorMsg = err.response.data.error;
        } else if (err.message) {
          errorMsg = err.message;
        }

        console.error("📋 Final error message:", errorMsg);
        alert(`Error: ${errorMsg}. Please refresh the page to check if the order was cancelled.`);
      }
    } finally {
      // Always close the modal
      setShowCancelConfirm(false);
      setCancellingOrder(null);
    }
  };

  const cancelCancelOrder = () => {
    setShowCancelConfirm(false);
    setCancellingOrder(null);
  };

  if (loading) return (
    <div className="super-orders-page">
      <div className="super-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="super-orders-page">
      <div className="super-error-container">
        <div className="error-icon">⚠️</div>
        <p>Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="super-orders-page">
      <div className="super-orders-header">
        <div className="orders-header-icon">📦</div>
        <div className="orders-header-content">
          <h1>Active Orders</h1>
          <p>Manage your purchases and sales</p>
        </div>
        <button
          className="super-btn super-btn-secondary compact refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >
          <span className="btn-icon">{loading ? "🔄" : "↻"}</span>
          <span className="btn-text">Refresh</span>
        </button>
      </div>

      <div className="super-orders-tabs">
        <button
          className={`super-tab-btn ${activeTab === "purchases" ? "active" : ""}`}
          onClick={() => setActiveTab("purchases")}
        >
          <span className="tab-icon">🛒</span>
          <span className="tab-text">My Purchases</span>
        </button>
        <button
          className={`super-tab-btn ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-text">My Sales</span>
        </button>
      </div>

      <div className="super-orders-content">
        {orders.length === 0 ? (
          <div className="super-empty-state">
            <div className="empty-state-icon">
              {activeTab === "purchases" ? "🛒" : "💰"}
            </div>
            <h3>No active {activeTab === "purchases" ? "purchases" : "sales"}</h3>
            <p>
              {activeTab === "purchases"
                ? "Start exploring artworks to make your first purchase!"
                : "Upload your artworks to start selling!"}
            </p>
            <button
              className="super-btn super-btn-primary compact"
              onClick={() => navigate(activeTab === "purchases" ? "/browse" : "/add-artwork")}
            >
              <span className="btn-icon">{activeTab === "purchases" ? "🎨" : "➕"}</span>
              <span className="btn-text">
                {activeTab === "purchases" ? "Browse Artworks" : "Add Artwork"}
              </span>
            </button>
          </div>
        ) : (
          <div className="super-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="super-order-card">
                <div className="super-order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      <span className="date-icon">📅</span>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status">
                    <span
                      className="super-status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="super-order-body">
                  <div className="super-artwork-info">
                    <div className="artwork-image-container">
                      {(order.artwork?.category === "3d_model" ||
                        order.artwork?.category === "3D Models" ||
                        order.artwork?.category === "3d_models" ||
                        order.artwork?.subcategory?.toLowerCase().includes("3d") ||
                        order.artwork?.medium?.toLowerCase().includes("3d")) ? (
                        <div className="model-3d-placeholder order">
                          <div className="model-3d-icon">🎮</div>
                          <div className="model-3d-text">
                            <span className="model-title">3D Model</span>
                          </div>
                        </div>
                      ) : (
                        order.artwork?.files?.[0] && (
                          <img
                            src={
                              order.artwork.files[0].url.startsWith("http")
                                ? order.artwork.files[0].url
                                : `http://localhost:5000/${order.artwork.files[0].url}`
                            }
                            alt={order.artwork.title}
                            className="order-artwork-image"
                          />
                        )
                      )}
                    </div>
                    <div className="super-artwork-details">
                      <h4>{order.artwork?.title}</h4>
                      <p className="artist-name">
                        <span className="artist-icon">👨‍🎨</span>
                        by{" "}
                        {activeTab === "purchases"
                          ? order.artist?.name
                          : order.buyer?.name}
                      </p>
                      <p className="order-quantity">
                        <span className="quantity-icon">📦</span>
                        Quantity: {order.quantity}
                      </p>
                      <p className="order-price">
                        <span className="price-icon">💰</span>
                        {formatPrice({
                          amount: order.pricing.total,
                          currency: "USD",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="super-order-details">
                    <div className="super-shipping-info">
                      <h5>
                        <span className="shipping-icon">🚚</span>
                        {activeTab === "purchases"
                          ? "Shipping To:"
                          : "Shipping From:"}
                      </h5>
                      <div className="shipping-address">
                        <p>{order.shippingInfo.fullName}</p>
                        <p>{order.shippingInfo.address}</p>
                        <p>
                          {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                          {order.shippingInfo.zipCode}
                        </p>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="super-tracking-info">
                        <h5>
                          <span className="tracking-icon">📍</span>
                          Tracking Number:
                        </h5>
                        <p className="tracking-number">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="super-order-footer">
                  <div className="super-order-actions">
                    <button
                      className="super-btn super-btn-secondary compact"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      <span className="btn-icon">👁️</span>
                      <span className="btn-text">View Details</span>
                    </button>
                    {activeTab === "purchases" &&
                      ["confirmed", "processing"].includes(order.status) && (
                        <button
                          className="super-btn super-btn-draft compact"
                          onClick={() => handleCancelOrder(order)}
                        >
                          <span className="btn-icon">❌</span>
                          <span className="btn-text">Cancel Order</span>
                        </button>
                      )}
                    {activeTab === "purchases" &&
                      order.status === "delivered" && (
                        <button className="super-btn super-btn-primary compact">
                          <span className="btn-icon">⭐</span>
                          <span className="btn-text">Leave Review</span>
                        </button>
                      )}
                    {activeTab === "sales" && order.status === "confirmed" && (
                      <button className="super-btn super-btn-primary compact">
                        <span className="btn-icon">📝</span>
                        <span className="btn-text">Update Status</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="super-modal-overlay" onClick={cancelCancelOrder}>
          <div className="super-modal" onClick={(e) => e.stopPropagation()}>
            <div className="super-modal-header">
              <div className="modal-header-icon">❌</div>
              <div className="modal-header-content">
                <h3>Cancel Order</h3>
                <p>Confirm order cancellation</p>
              </div>
              <button
                className="modal-close-btn"
                onClick={cancelCancelOrder}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="super-modal-content">
              <div className="super-modal-body">
                <p>Are you sure you want to cancel this order?</p>
                {cancellingOrder && (
                  <div className="super-order-summary">
                    <div className="summary-item">
                      <span className="summary-label">Order:</span>
                      <span className="summary-value">#{cancellingOrder._id.slice(-8)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Artwork:</span>
                      <span className="summary-value">{cancellingOrder.artwork?.title}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total:</span>
                      <span className="summary-value">{formatPrice({
                        amount: cancellingOrder.pricing.total,
                        currency: "USD",
                      })}</span>
                    </div>
                  </div>
                )}
                <div className="super-warning-message">
                  <div className="warning-icon">⚠️</div>
                  <div className="warning-content">
                    <p>This action cannot be undone. The artwork quantity will be restored and you will receive a cancellation confirmation.</p>
                  </div>
                </div>
              </div>
              <div className="super-modal-actions">
                <div className="actions-container">
                  <button
                    className="super-btn super-btn-secondary compact"
                    onClick={cancelCancelOrder}
                  >
                    <span className="btn-icon">↩️</span>
                    <span className="btn-text">Keep Order</span>
                  </button>
                  <button
                    className="super-btn super-btn-draft compact"
                    onClick={confirmCancelOrder}
                  >
                    <span className="btn-icon">❌</span>
                    <span className="btn-text">Yes, Cancel Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
