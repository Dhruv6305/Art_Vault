import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ artwork, orderData, onClose }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="payment-success">
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <div className="order-confirmation-badge">
          Order #
          {orderData?.orderId?.slice(-8) || orderData?.transactionId?.slice(-8)}
        </div>
        <p className="success-message">
          Thank you for your purchase! The artist has been notified and will
          prepare your artwork for shipping.
        </p>
      </div>

      <div className="order-details">
        <div className="detail-section">
          <h3>Order Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Transaction ID:</span>
              <span className="value">{orderData?.transactionId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Order Date:</span>
              <span className="value">
                {formatDate(orderData?.processedAt)}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Payment Method:</span>
              <span className="value">{orderData?.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Artwork Details</h3>
          <div className="artwork-summary">
            <div className="artwork-image-small">
              {artwork.files?.[0] && (
                <img
                  src={
                    artwork.files[0].url.startsWith("http")
                      ? artwork.files[0].url
                      : `http://localhost:5000/${artwork.files[0].url}`
                  }
                  alt={artwork.title}
                />
              )}
            </div>
            <div className="artwork-info">
              <h4>{artwork.title}</h4>
              <p>by {artwork.artistName}</p>
              <p>Quantity: {orderData?.quantity}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Shipping Information</h3>
          <div className="shipping-details">
            <div className="shipping-address">
              <p>
                <strong>{orderData?.shippingInfo?.fullName}</strong>
              </p>
              <p>{orderData?.shippingInfo?.address}</p>
              <p>
                {orderData?.shippingInfo?.city},{" "}
                {orderData?.shippingInfo?.state}{" "}
                {orderData?.shippingInfo?.zipCode}
              </p>
              <p>{orderData?.shippingInfo?.country}</p>
            </div>
            <div className="shipping-method">
              <p>
                <strong>Shipping Method:</strong>
              </p>
              <p className="capitalize">{orderData?.shippingMethod} Shipping</p>
              <p>
                <strong>Estimated Delivery:</strong>
              </p>
              <p>{getEstimatedDelivery(orderData?.shippingMethod)}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Order Summary</h3>
          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${orderData?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax:</span>
              <span>${orderData?.tax?.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>${orderData?.shipping?.toFixed(2)}</span>
            </div>
            <div className="total-line final-total">
              <span>
                <strong>Total Paid:</strong>
              </span>
              <span>
                <strong>${orderData?.total?.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>You'll receive an email confirmation shortly</li>
          <li>We'll notify you when your artwork ships</li>
          <li>Track your order using the transaction ID above</li>
          <li>Contact us if you have any questions</li>
        </ul>
      </div>

      <div className="success-actions">
        <button className="primary-btn" onClick={onClose}>
          Continue Shopping
        </button>
        {orderData?.orderId && (
          <button 
            className="secondary-btn" 
            onClick={() => navigate(`/orders/${orderData.orderId}`)}
          >
            View Order Details
          </button>
        )}
        <button className="secondary-btn" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
