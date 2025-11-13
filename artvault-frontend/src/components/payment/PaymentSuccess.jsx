import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ artwork, orderData, onClose }) => {
  const navigate = useNavigate();
  const [showOrderPopup, setShowOrderPopup] = useState(true);
  const printRef = useRef();

  // Get currency from artwork
  const currency = artwork.price?.currency || 'USD';
  
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Handle keyboard events and body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
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

  const handlePrintOrder = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Confirmation - ${orderData?.orderId?.slice(-8) || orderData?.transactionId?.slice(-8)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.6;
            }
            .print-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .print-header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 28px;
            }
            .order-badge {
              background: #2563eb;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              display: inline-block;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section h3 {
              margin-top: 0;
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .detail-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 15px 0;
            }
            .detail-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dotted #ccc;
            }
            .label {
              font-weight: bold;
              color: #4b5563;
            }
            .value {
              color: #1f2937;
            }
            .artwork-info {
              display: flex;
              align-items: center;
              gap: 15px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .artwork-image {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 8px;
              border: 2px solid #e5e7eb;
            }
            .totals {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin-top: 15px;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .final-total {
              border-top: 2px solid #333;
              margin-top: 10px;
              padding-top: 10px;
              font-weight: bold;
              font-size: 18px;
            }
            .print-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>🎨 ArtVault</h1>
            <div class="order-badge">Order #${orderData?.orderId?.slice(-8) || orderData?.transactionId?.slice(-8)}</div>
            <p><strong>Order Confirmation</strong></p>
          </div>
          ${printContent}
          <div class="print-footer">
            <p>Thank you for your purchase! For questions, contact support@artvault.com</p>
            <p>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const OrderConfirmationPopup = () => (
    <div className="order-popup-overlay" onClick={() => setShowOrderPopup(false)}>
      <div className="order-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="success-icon-large">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <div className="order-number">
            Order #{orderData?.orderId?.slice(-8) || orderData?.transactionId?.slice(-8)}
          </div>
          <button 
            className="popup-close" 
            onClick={() => setShowOrderPopup(false)}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>
        
        <div className="popup-content">
          <div className="confirmation-message">
            <p>🎨 Your artwork order has been confirmed and the artist has been notified!</p>
            <p>📧 You'll receive an email confirmation shortly with tracking details.</p>
          </div>
          
          <div className="quick-order-summary">
            <div className="artwork-preview">
              <div className="popup-artwork-image-container">
                {(artwork.category === "3d_model" || 
                  artwork.category === "3D Models" || 
                  artwork.category === "3d_models" ||
                  artwork.subcategory?.toLowerCase().includes("3d") ||
                  artwork.medium?.toLowerCase().includes("3d")) ? (
                  <div className="model-3d-placeholder popup">
                    <div className="model-3d-icon">🎮</div>
                    <div className="model-3d-text">
                      <span className="model-title">3D Model</span>
                    </div>
                  </div>
                ) : (
                  artwork.files?.[0] && (
                    <img
                      src={
                        artwork.files[0].url.startsWith("http")
                          ? artwork.files[0].url
                          : `http://localhost:5000/${artwork.files[0].url}`
                      }
                      alt={artwork.title}
                      className="popup-artwork-image"
                    />
                  )
                )}
              </div>
              <div className="artwork-details">
                <h4>{artwork.title}</h4>
                <p>by {artwork.artistName}</p>
                <p className="artwork-price">{formatCurrency(orderData?.total)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="popup-actions">
          <button 
            className="btn-print" 
            onClick={handlePrintOrder}
          >
            🖨️ Print Order Details
          </button>
          <button 
            className="btn-continue" 
            onClick={() => {
              setShowOrderPopup(false);
              onClose();
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showOrderPopup && <OrderConfirmationPopup />}
      
      <div className="super-success-modal-overlay" onClick={onClose}>
        <div className="super-success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="super-success-header">
            <div className="success-header-icon">✅</div>
            <div className="success-header-content">
              <h1>Order Confirmed!</h1>
              <p>Your payment was successful</p>
            </div>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="super-success-content">
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

      <div className="order-details" ref={printRef}>
        <div className="section">
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

        <div className="section">
          <h3>Artwork Details</h3>
          <div className="artwork-info">
            <div className="artwork-image-container">
              {(artwork.category === "3d_model" || 
                artwork.category === "3D Models" || 
                artwork.category === "3d_models" ||
                artwork.subcategory?.toLowerCase().includes("3d") ||
                artwork.medium?.toLowerCase().includes("3d")) ? (
                <div className="model-3d-placeholder success">
                  <div className="model-3d-icon">🎮</div>
                  <div className="model-3d-text">
                    <span className="model-title">3D Model</span>
                  </div>
                </div>
              ) : (
                artwork.files?.[0] && (
                  <img
                    src={
                      artwork.files[0].url.startsWith("http")
                        ? artwork.files[0].url
                        : `http://localhost:5000/${artwork.files[0].url}`
                    }
                    alt={artwork.title}
                    className="artwork-image"
                  />
                )
              )}
            </div>
            <div>
              <h4>{artwork.title}</h4>
              <p><strong>Artist:</strong> {artwork.artistName}</p>
              <p><strong>Quantity:</strong> {orderData?.quantity}</p>
              <p><strong>Medium:</strong> {artwork.medium}</p>
              <p><strong>Category:</strong> {artwork.category}</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Shipping Information</h3>
          <div className="detail-grid">
            <div>
              <h4>Delivery Address</h4>
              <div className="shipping-address">
                <p><strong>{orderData?.shippingInfo?.fullName}</strong></p>
                <p>{orderData?.shippingInfo?.address}</p>
                <p>
                  {orderData?.shippingInfo?.city}, {orderData?.shippingInfo?.state} {orderData?.shippingInfo?.zipCode}
                </p>
                <p>{orderData?.shippingInfo?.country}</p>
              </div>
            </div>
            <div>
              <h4>Shipping Details</h4>
              <div className="detail-item">
                <span className="label">Method:</span>
                <span className="value capitalize">{orderData?.shippingMethod} Shipping</span>
              </div>
              <div className="detail-item">
                <span className="label">Estimated Delivery:</span>
                <span className="value">{getEstimatedDelivery(orderData?.shippingMethod)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Order Summary</h3>
          <div className="totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(orderData?.subtotal)}</span>
            </div>
            <div className="total-line">
              <span>Tax:</span>
              <span>{formatCurrency(orderData?.tax)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>{formatCurrency(orderData?.shipping)}</span>
            </div>
            <div className="total-line final-total">
              <span><strong>Total Paid:</strong></span>
              <span><strong>{formatCurrency(orderData?.total)}</strong></span>
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
        <button 
          className="btn-print-detailed" 
          onClick={handlePrintOrder}
        >
          🖨️ Print Order Details
        </button>
        <button 
          className="btn-show-popup" 
          onClick={() => setShowOrderPopup(true)}
        >
          🎉 Show Order Confirmation
        </button>
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
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;