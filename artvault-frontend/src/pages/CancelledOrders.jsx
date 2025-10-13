import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { formatPrice } from "../utils/formatters.js";

const CancelledOrders = () => {
  const { } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("purchases"); // purchases or sales

  useEffect(() => {
    fetchCancelledOrders();
  }, [activeTab]);

  const fetchCancelledOrders = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "purchases" ? "/orders" : "/orders/sales";
      const response = await api.get(endpoint);

      if (response.data.success) {
        const allOrders = activeTab === "purchases" ? response.data.orders : response.data.sales;
        // Filter only cancelled orders
        const cancelledOrders = allOrders.filter(order => order.status === "cancelled");
        setOrders(cancelledOrders);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load cancelled orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    return "#dc3545"; // Red color for cancelled orders
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

  const handleReorder = (order) => {
    // Navigate to the artwork page for reordering
    if (order.artwork?._id) {
      navigate(`/artwork/${order.artwork._id}`);
    }
  };

  if (loading) return (
    <div className="super-orders-page">
      <div className="super-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cancelled orders...</p>
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
    <div className="super-orders-page cancelled">
      <div className="super-orders-header">
        <div className="orders-header-icon">❌</div>
        <div className="orders-header-content">
          <h1>Cancelled Orders</h1>
          <p>View your cancelled purchases and sales</p>
        </div>
        <button 
          className="super-btn super-btn-secondary compact refresh-btn"
          onClick={fetchCancelledOrders}
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
          <span className="tab-icon">🚫</span>
          <span className="tab-text">Cancelled Purchases</span>
        </button>
        <button
          className={`super-tab-btn ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          <span className="tab-icon">❌</span>
          <span className="tab-text">Cancelled Sales</span>
        </button>
      </div>

      <div className="super-orders-content">
        {orders.length === 0 ? (
          <div className="super-empty-state">
            <div className="empty-state-icon">
              {activeTab === "purchases" ? "🚫" : "❌"}
            </div>
            <h3>No cancelled {activeTab === "purchases" ? "purchases" : "sales"}</h3>
            <p>
              {activeTab === "purchases"
                ? "You haven't cancelled any purchases yet."
                : "No sales have been cancelled yet."}
            </p>
            <button 
              className="super-btn super-btn-primary compact"
              onClick={() => navigate("/orders")}
            >
              <span className="btn-icon">📦</span>
              <span className="btn-text">View Active Orders</span>
            </button>
          </div>
        ) : (
          <div className="super-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="super-order-card cancelled">
                <div className="super-order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      <span className="date-icon">❌</span>
                      Cancelled on {formatDate(order.updatedAt || order.createdAt)}
                    </p>
                    <p className="order-date">
                      <span className="date-icon">📅</span>
                      Originally placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status">
                    <span
                      className="super-status-badge cancelled"
                      style={{ backgroundColor: getStatusColor() }}
                    >
                      Cancelled
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
                        <div className="model-3d-placeholder order cancelled">
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
                        <span className="shipping-icon">🏠</span>
                        {activeTab === "purchases"
                          ? "Shipping Address:"
                          : "Customer Address:"}
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

                    <div className="super-cancellation-info">
                      <h5>
                        <span className="cancellation-icon">❌</span>
                        Cancellation Details:
                      </h5>
                      <div className="cancellation-note">
                        <p>This order was cancelled and the payment has been processed for refund.
                        {activeTab === "purchases" && " The artwork quantity has been restored."}</p>
                      </div>
                    </div>
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
                    {activeTab === "purchases" && order.artwork?._id && (
                      <button 
                        className="super-btn super-btn-primary compact"
                        onClick={() => handleReorder(order)}
                      >
                        <span className="btn-icon">🔄</span>
                        <span className="btn-text">Order Again</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelledOrders;