import { useState, useEffect } from "react";
import { formatPrice } from "../../utils/formatters.js";

const OrderSummary = ({
  artwork,
  quantity,
  totalAmount,
  onProceed,
  onCancel,
}) => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [orderQuantity, setOrderQuantity] = useState(quantity);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const shippingCosts = {
    standard: 15.99,
    express: 29.99,
    overnight: 49.99,
  };

  const tax = totalAmount * orderQuantity * 0.08; // 8% tax
  const shipping = shippingCosts[shippingMethod];
  const finalTotal = totalAmount * orderQuantity + tax + shipping;

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProceed({
      shippingInfo,
      quantity: orderQuantity,
      shippingMethod,
      subtotal: totalAmount * orderQuantity,
      tax,
      shipping,
      total: finalTotal,
    });
  };

  const isFormValid = Object.values(shippingInfo).every(
    (value) => value.trim() !== ""
  );

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    // Prevent body scroll when modal is open
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="super-order-modal-overlay" onClick={onCancel}>
      <div className="super-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="super-order-header">
          <div className="order-header-icon">🛒</div>
          <div className="order-header-content">
            <h1>Order Summary</h1>
            <p>Review your purchase and complete your order</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="super-order-content">
          {/* Artwork Summary Section */}
          <div className="super-form-section">
            <div className="section-header">
              <span className="section-icon">🎨</span>
              <h4>Artwork Details</h4>
              <span className="section-subtitle">Your selected masterpiece</span>
            </div>

            <div className="super-artwork-summary">
              <div className="artwork-image-container">
                {(artwork.category === "3d_model" ||
                  artwork.category === "3D Models" ||
                  artwork.category === "3d_models" ||
                  artwork.subcategory?.toLowerCase().includes("3d") ||
                  artwork.medium?.toLowerCase().includes("3d")) ? (
                  <div className="model-3d-placeholder">
                    <div className="model-3d-icon">🎮</div>
                    <div className="model-3d-text">
                      <span className="model-title">3D Model</span>
                      <span className="model-subtitle">Click to view</span>
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
                      className="summary-artwork-image"
                    />
                  )
                )}
                <div className="image-overlay">
                  <span className="overlay-icon">
                    {(artwork.category === "3d_model" ||
                      artwork.category === "3D Models" ||
                      artwork.category === "3d_models" ||
                      artwork.subcategory?.toLowerCase().includes("3d") ||
                      artwork.medium?.toLowerCase().includes("3d")) ? "🎮" : "🖼️"}
                  </span>
                </div>
              </div>

              <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artist-name">
                  <span className="artist-icon">👨‍🎨</span>
                  by {artwork.artistName}
                </p>
                <p className="artwork-medium">
                  <span className="medium-icon">🎭</span>
                  {artwork.medium}
                </p>
                <div className="price-info">
                  <span className="unit-price">
                    <span className="price-icon">💰</span>
                    {formatPrice(artwork.price)} each
                  </span>
                  {artwork.quantity > 1 && (
                    <span className="availability">
                      <span className="stock-icon">📦</span>
                      {artwork.quantity} available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="super-form-group">
              <label className="super-label">
                <span className="label-text">Quantity</span>
              </label>
              <div className="super-quantity-wrapper">
                <button
                  type="button"
                  className="quantity-btn decrease"
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  disabled={orderQuantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={orderQuantity}
                  readOnly
                  className="super-quantity-input"
                  min="1"
                  max={artwork.quantity}
                />
                <button
                  type="button"
                  className="quantity-btn increase"
                  onClick={() =>
                    setOrderQuantity(Math.min(artwork.quantity, orderQuantity + 1))
                  }
                  disabled={orderQuantity >= artwork.quantity}
                >
                  +
                </button>
              </div>
              <div className="help-text">
                <span className="help-icon">📦</span>
                Maximum {artwork.quantity} items available
              </div>
            </div>
          </div>

          {/* Shipping Information Section */}
          <form onSubmit={handleSubmit} className="super-order-form">
            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">📮</span>
                <h4>Shipping Information</h4>
                <span className="section-subtitle">Where should we deliver your artwork?</span>
              </div>

              <div className="super-form-row">
                <div className="super-form-group">
                  <label htmlFor="fullName" className="super-label">
                    <span className="label-text">Full Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="Enter your full name..."
                      required
                    />
                    <div className="input-icon">👤</div>
                  </div>
                </div>

                <div className="super-form-group">
                  <label htmlFor="email" className="super-label">
                    <span className="label-text">Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="your.email@example.com"
                      required
                    />
                    <div className="input-icon">📧</div>
                  </div>
                </div>
              </div>

              <div className="super-form-group">
                <label htmlFor="phone" className="super-label">
                  <span className="label-text">Phone Number</span>
                  <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="super-form-input"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                  <div className="input-icon">📱</div>
                </div>
              </div>

              <div className="super-form-group">
                <label htmlFor="address" className="super-label">
                  <span className="label-text">Street Address</span>
                  <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="super-form-input"
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                  <div className="input-icon">🏠</div>
                </div>
              </div>

              <div className="super-form-row">
                <div className="super-form-group">
                  <label htmlFor="city" className="super-label">
                    <span className="label-text">City</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="New York"
                      required
                    />
                    <div className="input-icon">🏙️</div>
                  </div>
                </div>

                <div className="super-form-group">
                  <label htmlFor="state" className="super-label">
                    <span className="label-text">State</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="NY"
                      required
                    />
                    <div className="input-icon">🗺️</div>
                  </div>
                </div>

                <div className="super-form-group">
                  <label htmlFor="zipCode" className="super-label">
                    <span className="label-text">ZIP Code</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="10001"
                      required
                    />
                    <div className="input-icon">📮</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">🚚</span>
                <h4>Shipping Method</h4>
                <span className="section-subtitle">Choose your preferred delivery speed</span>
              </div>

              <div className="super-shipping-methods">
                <label className="super-shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="super-radio"></span>
                  <div className="shipping-content">
                    <div className="shipping-header">
                      <span className="shipping-icon">📦</span>
                      <span className="shipping-name">Standard Shipping</span>
                      <span className="shipping-cost">${shippingCosts.standard}</span>
                    </div>
                    <span className="shipping-time">5-7 business days</span>
                    <span className="shipping-desc">Most economical option</span>
                  </div>
                </label>

                <label className="super-shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="super-radio"></span>
                  <div className="shipping-content">
                    <div className="shipping-header">
                      <span className="shipping-icon">⚡</span>
                      <span className="shipping-name">Express Shipping</span>
                      <span className="shipping-cost">${shippingCosts.express}</span>
                    </div>
                    <span className="shipping-time">2-3 business days</span>
                    <span className="shipping-desc">Faster delivery</span>
                  </div>
                </label>

                <label className="super-shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="overnight"
                    checked={shippingMethod === "overnight"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="super-radio"></span>
                  <div className="shipping-content">
                    <div className="shipping-header">
                      <span className="shipping-icon">🚀</span>
                      <span className="shipping-name">Overnight Shipping</span>
                      <span className="shipping-cost">${shippingCosts.overnight}</span>
                    </div>
                    <span className="shipping-time">Next business day</span>
                    <span className="shipping-desc">Fastest delivery</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Total Section */}
            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">💰</span>
                <h4>Order Total</h4>
                <span className="section-subtitle">Final pricing breakdown</span>
              </div>

              <div className="super-order-total">
                <div className="total-line">
                  <span className="total-label">
                    <span className="total-icon">🛒</span>
                    Subtotal ({orderQuantity} item{orderQuantity > 1 ? "s" : ""})
                  </span>
                  <span className="total-value">${(totalAmount * orderQuantity).toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span className="total-label">
                    <span className="total-icon">🧾</span>
                    Tax (8%)
                  </span>
                  <span className="total-value">${tax.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span className="total-label">
                    <span className="total-icon">🚚</span>
                    Shipping
                  </span>
                  <span className="total-value">${shipping.toFixed(2)}</span>
                </div>
                <div className="total-line final-total">
                  <span className="total-label">
                    <span className="total-icon">💎</span>
                    Total Amount
                  </span>
                  <span className="total-value">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="super-order-actions">
              <div className="actions-container">
                <button
                  type="button"
                  className="super-btn super-btn-secondary compact"
                  onClick={onCancel}
                >
                  <span className="btn-icon">←</span>
                  <span className="btn-text">Cancel Order</span>
                </button>

                <button
                  type="submit"
                  className={`super-btn super-btn-primary compact ${!isFormValid ? "disabled" : ""}`}
                  disabled={!isFormValid}
                >
                  <span className="btn-icon">💳</span>
                  <span className="btn-text">Proceed to Payment</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
