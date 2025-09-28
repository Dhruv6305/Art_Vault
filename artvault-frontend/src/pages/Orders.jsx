import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { formatPrice } from "../utils/formatters.js";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("purchases"); // purchases or sales

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "purchases" ? "/orders" : "/orders/sales";
      const response = await api.get(endpoint);

      if (response.data.success) {
        setOrders(
          activeTab === "purchases" ? response.data.orders : response.data.sales
        );
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

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === "purchases" ? "active" : ""}`}
            onClick={() => setActiveTab("purchases")}
          >
            My Purchases
          </button>
          <button
            className={`tab-btn ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            My Sales
          </button>
        </div>
      </div>

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">
              {activeTab === "purchases" ? "🛒" : "💰"}
            </div>
            <h3>No {activeTab === "purchases" ? "purchases" : "sales"} yet</h3>
            <p>
              {activeTab === "purchases"
                ? "Start exploring artworks to make your first purchase!"
                : "Upload your artworks to start selling!"}
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="artwork-info">
                    {order.artwork?.files?.[0] && (
                      <img
                        src={
                          order.artwork.files[0].url.startsWith("http")
                            ? order.artwork.files[0].url
                            : `http://localhost:5000/${order.artwork.files[0].url}`
                        }
                        alt={order.artwork.title}
                        className="order-artwork-image"
                      />
                    )}
                    <div className="artwork-details">
                      <h4>{order.artwork?.title}</h4>
                      <p className="artist-name">
                        by{" "}
                        {activeTab === "purchases"
                          ? order.artist?.name
                          : order.buyer?.name}
                      </p>
                      <p className="order-quantity">
                        Quantity: {order.quantity}
                      </p>
                      <p className="order-price">
                        {formatPrice({
                          amount: order.pricing.total,
                          currency: "USD",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="shipping-info">
                      <h5>
                        {activeTab === "purchases"
                          ? "Shipping To:"
                          : "Shipping From:"}
                      </h5>
                      <p>{order.shippingInfo.fullName}</p>
                      <p>{order.shippingInfo.address}</p>
                      <p>
                        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                        {order.shippingInfo.zipCode}
                      </p>
                    </div>

                    {order.trackingNumber && (
                      <div className="tracking-info">
                        <h5>Tracking Number:</h5>
                        <p className="tracking-number">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </button>
                    {activeTab === "purchases" &&
                      order.status === "delivered" && (
                        <button className="review-btn">Leave Review</button>
                      )}
                    {activeTab === "sales" && order.status === "confirmed" && (
                      <button className="update-status-btn">
                        Update Status
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

export default Orders;
