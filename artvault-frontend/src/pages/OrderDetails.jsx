import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { formatPrice } from "../utils/formatters.js";
import "../styles/OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getEstimatedDelivery = (shippingMethod) => {
    const today = new Date();
    let deliveryDays;

    switch (shippingMethod) {
      case "standard":
        deliveryDays = 7;
        break;
      case "express":
        deliveryDays = 3;
        break;
      case "overnight":
        deliveryDays = 1;
        break;
      default:
        deliveryDays = 7;
    }

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToOrders = () => {
    navigate("/orders");
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details-page">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .order-details-page {
            background: white !important;
            color: black !important;
          }
          .order-header {
            border-bottom: 2px solid #000 !important;
            margin-bottom: 20px !important;
          }
          .order-content {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>

      <div className="order-details-container">
        <div className="order-details-header no-print">
          <button className="back-btn" onClick={handleBackToOrders}>
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
          <button className="print-btn" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>

        <div className="order-content">
          {/* Order Header */}
          <div className="order-header">
            <div className="order-title">
              <h2>Order #{order._id.slice(-8)}</h2>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="order-meta">
              <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
              {order.updatedAt !== order.createdAt && (
                <p><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</p>
              )}
            </div>
          </div>

          {/* Order Information Grid */}
          <div className="order-info-grid">
            {/* Transaction Information */}
            <div className="info-section">
              <h3>Transaction Information</h3>
              <div className="info-content">
                <div className="info-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{order.paymentData?.transactionId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">{order.paymentData?.paymentMethod}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Date:</span>
                  <span className="value">{formatDate(order.paymentData?.processedAt)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Total:</span>
                  <span className="value total-amount">${order.pricing?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Artwork Information */}
            <div className="info-section">
              <h3>Artwork Details</h3>
              <div className="artwork-details">
                <div className="artwork-image">
                  {order.artwork?.files?.[0] && (
                    <img
                      src={
                        order.artwork.files[0].url.startsWith("http")
                          ? order.artwork.files[0].url
                          : `http://localhost:5000/${order.artwork.files[0].url}`
                      }
                      alt={order.artwork.title}
                    />
                  )}
                </div>
                <div className="artwork-info">
                  <h4>{order.artwork?.title}</h4>
                  <p><strong>Artist:</strong> {order.artist?.name}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Unit Price:</strong> {formatPrice(order.artwork?.price)}</p>
                  <p><strong>Category:</strong> {order.artwork?.category?.replace('_', ' ')}</p>
                  {order.artwork?.medium && (
                    <p><strong>Medium:</strong> {order.artwork.medium}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="info-section">
              <h3>Shipping Information</h3>
              <div className="shipping-details">
                <div className="shipping-address">
                  <h4>Delivery Address</h4>
                  <p><strong>{order.shippingInfo?.fullName}</strong></p>
                  <p>{order.shippingInfo?.address}</p>
                  <p>
                    {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                  </p>
                  <p>{order.shippingInfo?.country}</p>
                  {order.shippingInfo?.email && (
                    <p><strong>Email:</strong> {order.shippingInfo.email}</p>
                  )}
                  {order.shippingInfo?.phone && (
                    <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                  )}
                </div>
                <div className="shipping-method">
                  <h4>Shipping Method</h4>
                  <p><strong>Method:</strong> {order.shippingMethod?.charAt(0).toUpperCase() + order.shippingMethod?.slice(1)} Shipping</p>
                  <p><strong>Estimated Delivery:</strong> {getEstimatedDelivery(order.shippingMethod)}</p>
                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <p><strong>Tracking Number:</strong></p>
                      <p className="tracking-number">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="info-section">
              <h3>Order Summary</h3>
              <div className="order-summary">
                <div className="summary-line">
                  <span>Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''}):</span>
                  <span>${order.pricing?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax:</span>
                  <span>${order.pricing?.tax?.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>${order.pricing?.shipping?.toFixed(2)}</span>
                </div>
                <div className="summary-line total-line">
                  <span><strong>Total:</strong></span>
                  <span><strong>${order.pricing?.total?.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="order-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Order Placed</h4>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
              </div>
              
              {order.status === 'processing' && (
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Your order is being prepared</p>
                  </div>
                </div>
              )}
              
              {order.status === 'shipped' && (
                <>
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Processing</h4>
                      <p>Your order was prepared</p>
                    </div>
                  </div>
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Shipped</h4>
                      <p>Your order is on its way</p>
                    </div>
                  </div>
                </>
              )}
              
              {order.status === 'delivered' && (
                <>
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Processing</h4>
                      <p>Your order was prepared</p>
                    </div>
                  </div>
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Shipped</h4>
                      <p>Your order was shipped</p>
                    </div>
                  </div>
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Delivered</h4>
                      <p>Your order has been delivered</p>
                    </div>
                  </div>
                </>
              )}
              
              {order.status === 'cancelled' && (
                <div className="timeline-item cancelled">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Order Cancelled</h4>
                    <p>This order has been cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h3>Need Help?</h3>
            <p>If you have any questions about this order, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> support@artvault.com</li>
              <li><strong>Phone:</strong> 1-800-ART-VAULT</li>
              <li><strong>Order Reference:</strong> #{order._id.slice(-8)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
