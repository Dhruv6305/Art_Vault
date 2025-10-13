import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { formatPrice } from "../utils/formatters.js";
import "../styles/OrderDetails.css"
import "../styles/SuperOrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { } = useAuth();
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

  if (loading) return (
    <div className="super-order-details-page">
      <div className="super-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="super-order-details-page">
      <div className="super-error-container">
        <div className="error-icon">⚠️</div>
        <p>Error: {error}</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="super-order-details-page">
      <div className="super-error-container">
        <div className="error-icon">❓</div>
        <p>Order not found</p>
      </div>
    </div>
  );

  return (
    <div className="super-order-details-page">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .super-order-details-page {
            background: white !important;
            color: black !important;
            padding: 20px !important;
          }
          .super-order-header {
            border-bottom: 2px solid #000 !important;
            margin-bottom: 20px !important;
            background: white !important;
          }
          .super-order-content {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>

      <div className="super-order-header">
        <div className="order-header-icon">📋</div>
        <div className="order-header-content">
          <h1>Order Details</h1>
          <p>Complete order information and status</p>
        </div>
        <div className="order-header-actions no-print">
          <button
            className="super-btn super-btn-secondary compact"
            onClick={handleBackToOrders}
          >
            <span className="btn-icon">←</span>
            <span className="btn-text">Back to Orders</span>
          </button>
          <button
            className="super-btn super-btn-primary compact"
            onClick={handlePrint}
          >
            <span className="btn-icon">🖨️</span>
            <span className="btn-text">Print</span>
          </button>
        </div>
      </div>

      <div className="super-order-content">
        {/* Order Summary Card */}
        <div className="super-order-summary-card">
          <div className="order-title-section">
            <div className="order-title-info">
              <h2>Order #{order._id.slice(-8)}</h2>
              <div className="order-meta">
                <p>
                  <span className="meta-icon">📅</span>
                  <strong>Order Date:</strong> {formatDate(order.createdAt)}
                </p>
                {order.updatedAt !== order.createdAt && (
                  <p>
                    <span className="meta-icon">🔄</span>
                    <strong>Last Updated:</strong> {formatDate(order.updatedAt)}
                  </p>
                )}
              </div>
            </div>
            <div className="order-status-section">
              <span
                className="super-status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Information Grid */}
        <div className="super-order-info-grid">
          {/* Transaction Information */}
          <div className="super-info-section">
            <div className="section-header">
              <span className="section-icon">💳</span>
              <h3>Transaction Information</h3>
            </div>
            <div className="super-info-content">
              <div className="super-info-item">
                <span className="info-label">
                  <span className="label-icon">🔢</span>
                  Transaction ID:
                </span>
                <span className="info-value">{order.paymentData?.transactionId}</span>
              </div>
              <div className="super-info-item">
                <span className="info-label">
                  <span className="label-icon">💳</span>
                  Payment Method:
                </span>
                <span className="info-value">{order.paymentData?.paymentMethod}</span>
              </div>
              <div className="super-info-item">
                <span className="info-label">
                  <span className="label-icon">📅</span>
                  Payment Date:
                </span>
                <span className="info-value">{formatDate(order.paymentData?.processedAt)}</span>
              </div>
              <div className="super-info-item total-item">
                <span className="info-label">
                  <span className="label-icon">💰</span>
                  Order Total:
                </span>
                <span className="info-value total-amount">${order.pricing?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Artwork Information */}
          <div className="super-info-section">
            <div className="section-header">
              <span className="section-icon">🎨</span>
              <h3>Artwork Details</h3>
            </div>
            <div className="super-artwork-details">
              <div className="artwork-image-container">
                {(order.artwork?.category === "3d_model" ||
                  order.artwork?.category === "3D Models" ||
                  order.artwork?.category === "3d_models" ||
                  order.artwork?.subcategory?.toLowerCase().includes("3d") ||
                  order.artwork?.medium?.toLowerCase().includes("3d")) ? (
                  <div className="model-3d-placeholder details">
                    <div className="model-3d-icon">🎮</div>
                    <div className="model-3d-text">
                      <span className="model-title">3D Model</span>
                      <span className="model-subtitle">Click to view</span>
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
                      className="artwork-image"
                    />
                  )
                )}
              </div>
              <div className="super-artwork-info">
                <h4>{order.artwork?.title}</h4>
                <div className="artwork-info-grid">
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">👨‍🎨</span>
                      Artist:
                    </span>
                    <span className="info-value">{order.artist?.name}</span>
                  </div>
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">📦</span>
                      Quantity:
                    </span>
                    <span className="info-value">{order.quantity}</span>
                  </div>
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">💰</span>
                      Unit Price:
                    </span>
                    <span className="info-value">{formatPrice(order.artwork?.price)}</span>
                  </div>
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">🏷️</span>
                      Category:
                    </span>
                    <span className="info-value">{order.artwork?.category?.replace('_', ' ')}</span>
                  </div>
                  {order.artwork?.medium && (
                    <div className="super-info-item">
                      <span className="info-label">
                        <span className="label-icon">🎭</span>
                        Medium:
                      </span>
                      <span className="info-value">{order.artwork.medium}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="super-info-section">
            <div className="section-header">
              <span className="section-icon">🚚</span>
              <h3>Shipping Information</h3>
            </div>
            <div className="super-shipping-details">
              <div className="super-shipping-address">
                <h4>
                  <span className="address-icon">🏠</span>
                  Delivery Address
                </h4>
                <div className="address-content">
                  <p className="recipient-name">{order.shippingInfo?.fullName}</p>
                  <p>{order.shippingInfo?.address}</p>
                  <p>
                    {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                  </p>
                  <p>{order.shippingInfo?.country}</p>
                  {order.shippingInfo?.email && (
                    <p>
                      <span className="contact-icon">📧</span>
                      <strong>Email:</strong> {order.shippingInfo.email}
                    </p>
                  )}
                  {order.shippingInfo?.phone && (
                    <p>
                      <span className="contact-icon">📱</span>
                      <strong>Phone:</strong> {order.shippingInfo.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="super-shipping-method">
                <h4>
                  <span className="method-icon">📦</span>
                  Shipping Method
                </h4>
                <div className="method-content">
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">🚚</span>
                      Method:
                    </span>
                    <span className="info-value">{order.shippingMethod?.charAt(0).toUpperCase() + order.shippingMethod?.slice(1)} Shipping</span>
                  </div>
                  <div className="super-info-item">
                    <span className="info-label">
                      <span className="label-icon">📅</span>
                      Estimated Delivery:
                    </span>
                    <span className="info-value">{getEstimatedDelivery(order.shippingMethod)}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="super-tracking-info">
                      <div className="super-info-item">
                        <span className="info-label">
                          <span className="label-icon">📍</span>
                          Tracking Number:
                        </span>
                        <span className="info-value tracking-number">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="super-info-section">
            <div className="section-header">
              <span className="section-icon">💰</span>
              <h3>Order Summary</h3>
            </div>
            <div className="super-order-summary">
              <div className="summary-line">
                <span className="summary-label">
                  <span className="summary-icon">🛒</span>
                  Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''}):
                </span>
                <span className="summary-value">${order.pricing?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">
                  <span className="summary-icon">🧾</span>
                  Tax:
                </span>
                <span className="summary-value">${order.pricing?.tax?.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">
                  <span className="summary-icon">🚚</span>
                  Shipping:
                </span>
                <span className="summary-value">${order.pricing?.shipping?.toFixed(2)}</span>
              </div>
              <div className="summary-line total-line">
                <span className="summary-label">
                  <span className="summary-icon">💎</span>
                  <strong>Total:</strong>
                </span>
                <span className="summary-value"><strong>${order.pricing?.total?.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="super-order-timeline">
          <div className="section-header">
            <span className="section-icon">📈</span>
            <h3>Order Timeline</h3>
          </div>
          <div className="super-timeline">
            <div className="super-timeline-item completed">
              <div className="timeline-marker">
                <span className="marker-icon">📝</span>
              </div>
              <div className="timeline-content">
                <h4>Order Placed</h4>
                <p>{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {order.status === 'processing' && (
              <div className="super-timeline-item completed">
                <div className="timeline-marker">
                  <span className="marker-icon">⚙️</span>
                </div>
                <div className="timeline-content">
                  <h4>Processing</h4>
                  <p>Your order is being prepared</p>
                </div>
              </div>
            )}

            {order.status === 'shipped' && (
              <>
                <div className="super-timeline-item completed">
                  <div className="timeline-marker">
                    <span className="marker-icon">⚙️</span>
                  </div>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Your order was prepared</p>
                  </div>
                </div>
                <div className="super-timeline-item completed">
                  <div className="timeline-marker">
                    <span className="marker-icon">🚚</span>
                  </div>
                  <div className="timeline-content">
                    <h4>Shipped</h4>
                    <p>Your order is on its way</p>
                  </div>
                </div>
              </>
            )}

            {order.status === 'delivered' && (
              <>
                <div className="super-timeline-item completed">
                  <div className="timeline-marker">
                    <span className="marker-icon">⚙️</span>
                  </div>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Your order was prepared</p>
                  </div>
                </div>
                <div className="super-timeline-item completed">
                  <div className="timeline-marker">
                    <span className="marker-icon">🚚</span>
                  </div>
                  <div className="timeline-content">
                    <h4>Shipped</h4>
                    <p>Your order was shipped</p>
                  </div>
                </div>
                <div className="super-timeline-item completed">
                  <div className="timeline-marker">
                    <span className="marker-icon">✅</span>
                  </div>
                  <div className="timeline-content">
                    <h4>Delivered</h4>
                    <p>Your order has been delivered</p>
                  </div>
                </div>
              </>
            )}

            {order.status === 'cancelled' && (
              <div className="super-timeline-item cancelled">
                <div className="timeline-marker">
                  <span className="marker-icon">❌</span>
                </div>
                <div className="timeline-content">
                  <h4>Order Cancelled</h4>
                  <p>This order has been cancelled</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="super-contact-info">
          <div className="section-header">
            <span className="section-icon">💬</span>
            <h3>Need Help?</h3>
          </div>
          <div className="contact-content">
            <p>If you have any questions about this order, please contact us:</p>
            <div className="contact-methods">
              <div className="contact-method">
                <span className="contact-icon">📧</span>
                <div className="contact-details">
                  <strong>Email:</strong>
                  <span>support@artvault.com</span>
                </div>
              </div>
              <div className="contact-method">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <strong>Phone:</strong>
                  <span>1-800-ART-VAULT</span>
                </div>
              </div>
              <div className="contact-method">
                <span className="contact-icon">🔢</span>
                <div className="contact-details">
                  <strong>Order Reference:</strong>
                  <span>#{order._id.slice(-8)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
