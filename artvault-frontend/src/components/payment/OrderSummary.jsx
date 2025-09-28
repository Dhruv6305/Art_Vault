import React, { useState } from "react";
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

  return (
    <div className="order-summary">
      <div className="order-content">
        <div className="artwork-summary">
          <div className="artwork-image-container">
            {artwork.files?.[0] && (
              <img
                src={
                  artwork.files[0].url.startsWith("http")
                    ? artwork.files[0].url
                    : `http://localhost:5000/${artwork.files[0].url}`
                }
                alt={artwork.title}
                className="summary-artwork-image"
              />
            )}
          </div>

          <div className="artwork-details">
            <h3>{artwork.title}</h3>
            <p className="artist-name">by {artwork.artistName}</p>
            <p className="artwork-medium">{artwork.medium}</p>
            <div className="price-info">
              <span className="unit-price">
                {formatPrice(artwork.price)} each
              </span>
              {artwork.quantity > 1 && (
                <span className="availability">
                  {artwork.quantity} available
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button
              type="button"
              onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
              disabled={orderQuantity <= 1}
            >
              -
            </button>
            <span className="quantity-display">{orderQuantity}</span>
            <button
              type="button"
              onClick={() =>
                setOrderQuantity(Math.min(artwork.quantity, orderQuantity + 1))
              }
              disabled={orderQuantity >= artwork.quantity}
            >
              +
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="shipping-form">
          <h4>Shipping Information</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={shippingInfo.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="shipping-options">
            <h4>Shipping Method</h4>
            <div className="shipping-methods">
              <label className="shipping-option">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div className="shipping-details">
                  <span className="shipping-name">Standard Shipping</span>
                  <span className="shipping-time">5-7 business days</span>
                  <span className="shipping-cost">
                    ${shippingCosts.standard}
                  </span>
                </div>
              </label>

              <label className="shipping-option">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div className="shipping-details">
                  <span className="shipping-name">Express Shipping</span>
                  <span className="shipping-time">2-3 business days</span>
                  <span className="shipping-cost">
                    ${shippingCosts.express}
                  </span>
                </div>
              </label>

              <label className="shipping-option">
                <input
                  type="radio"
                  name="shipping"
                  value="overnight"
                  checked={shippingMethod === "overnight"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div className="shipping-details">
                  <span className="shipping-name">Overnight Shipping</span>
                  <span className="shipping-time">Next business day</span>
                  <span className="shipping-cost">
                    ${shippingCosts.overnight}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="order-total">
            <div className="total-line">
              <span>
                Subtotal ({orderQuantity} item{orderQuantity > 1 ? "s" : ""}):
              </span>
              <span>${(totalAmount * orderQuantity).toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="total-line final-total">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="proceed-btn"
              disabled={!isFormValid}
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderSummary;
