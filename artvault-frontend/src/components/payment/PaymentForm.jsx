import { useState, useEffect } from "react";
import api from "../../api/axios.js";

const PaymentForm = ({
  artwork,
  orderData,
  totalAmount,
  onSuccess,
  onBack,
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      address: orderData?.shippingInfo?.address || "",
      city: orderData?.shippingInfo?.city || "",
      state: orderData?.shippingInfo?.state || "",
      zipCode: orderData?.shippingInfo?.zipCode || "",
      country: orderData?.shippingInfo?.country || "United States",
    },
    sameAsShipping: true,
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle keyboard events and body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onBack();
      }
    };

    // Prevent body scroll when modal is open
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBack]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("billing.")) {
      const field = name.split(".")[1];
      setPaymentData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }));
    } else if (type === "checkbox") {
      setPaymentData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "sameAsShipping" && checked
          ? {
            billingAddress: {
              address: orderData?.shippingInfo?.address || "",
              city: orderData?.shippingInfo?.city || "",
              state: orderData?.shippingInfo?.state || "",
              zipCode: orderData?.shippingInfo?.zipCode || "",
              country: orderData?.shippingInfo?.country || "United States",
            },
          }
          : {}),
      }));
    } else {
      // Format card number and expiry date
      let formattedValue = value;
      if (name === "cardNumber") {
        formattedValue = value
          .replace(/\s/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim();
        if (formattedValue.length > 19)
          formattedValue = formattedValue.slice(0, 19);
      } else if (name === "expiryDate") {
        formattedValue = value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "$1/$2");
        if (formattedValue.length > 5)
          formattedValue = formattedValue.slice(0, 5);
      } else if (name === "cvv") {
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
      }

      setPaymentData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
    if (!cardNumber || cardNumber.length < 13) {
      newErrors.cardNumber = "Valid card number is required";
    }

    if (
      !paymentData.expiryDate ||
      !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)
    ) {
      newErrors.expiryDate = "Valid expiry date is required (MM/YY)";
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }

    if (!paymentData.sameAsShipping) {
      if (!paymentData.billingAddress.address.trim()) {
        newErrors["billing.address"] = "Billing address is required";
      }
      if (!paymentData.billingAddress.city.trim()) {
        newErrors["billing.city"] = "Billing city is required";
      }
      if (!paymentData.billingAddress.state.trim()) {
        newErrors["billing.state"] = "Billing state is required";
      }
      if (!paymentData.billingAddress.zipCode.trim()) {
        newErrors["billing.zipCode"] = "Billing ZIP code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulatePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate payment processing - Always succeed for testing
        const success = true; // Changed from Math.random() > 0.1 to always succeed
        resolve({
          success,
          transactionId: success
            ? `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
            : null,
          message: success
            ? "Payment processed successfully"
            : "Payment failed. Please try again.",
        });
      }, 2000);
    });
  };

  const processOrder = async (paymentResult) => {
    try {
      console.log("Processing order with payload...");

      const orderPayload = {
        artworkId: artwork._id,
        quantity: orderData?.quantity || 1,
        shippingInfo: orderData?.shippingInfo,
        shippingMethod: orderData?.shippingMethod,
        paymentData: {
          transactionId: paymentResult.transactionId,
          paymentMethod: "Credit Card",
          processedAt: new Date().toISOString(),
        },
        subtotal: orderData?.subtotal,
        tax: orderData?.tax,
        shipping: orderData?.shipping,
        total: orderData?.total,
      };

      console.log("Order payload:", orderPayload);

      const response = await api.post("/orders", orderPayload);
      console.log("Backend response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          order: response.data.order,
          remainingQuantity: response.data.remainingQuantity,
        };
      } else {
        throw new Error(response.data.msg || "Order processing failed");
      }
    } catch (error) {
      console.error("Order processing error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        artwork: artwork._id,
        orderData: orderData,
      });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ general: "Please log in to complete your purchase." });
      return;
    }

    setProcessing(true);
    setErrors({}); // Clear previous errors

    try {
      console.log("Starting payment process...");

      // First simulate payment processing
      const paymentResult = await simulatePayment();
      console.log("Payment simulation result:", paymentResult);

      if (paymentResult.success) {
        console.log("Payment successful, processing order...");

        // Then process the order with backend
        const orderResult = await processOrder(paymentResult);
        console.log("Order processing result:", orderResult);

        if (orderResult.success) {
          console.log("Order created successfully:", orderResult.order._id);
          onSuccess({
            ...paymentData,
            transactionId: paymentResult.transactionId,
            paymentMethod: "Credit Card",
            processedAt: new Date().toISOString(),
            orderId: orderResult.order._id,
            remainingQuantity: orderResult.remainingQuantity,
          });
        } else {
          console.error("Order processing failed");
          setErrors({ general: "Order processing failed. Please try again." });
        }
      } else {
        console.error("Payment failed:", paymentResult.message);
        setErrors({ general: paymentResult.message });
      }
    } catch (error) {
      console.error("Payment processing error:", error);

      // Provide more specific error messages
      let errorMessage = "Payment processing failed. Please try again.";

      if (error.response) {
        // Backend returned an error response
        const status = error.response.status;
        const backendMessage = error.response.data?.msg;

        if (status === 401) {
          errorMessage = "Please log in to complete your purchase.";
        } else if (status === 404) {
          errorMessage = "Artwork not found. Please refresh and try again.";
        } else if (status === 400) {
          errorMessage =
            backendMessage ||
            "Invalid order data. Please check your information.";
        } else {
          errorMessage = backendMessage || errorMessage;
        }

        console.error("Backend error:", error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
        console.error("Network error:", error.request);
      } else {
        // Other error
        console.error("General error:", error.message);
      }

      setErrors({ general: errorMessage });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="super-payment-modal-overlay" onClick={onBack}>
      <div className="super-payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="super-payment-header">
          <div className="payment-header-icon">💳</div>
          <div className="payment-header-content">
            <h1>Payment Details</h1>
            <p>Complete your secure payment</p>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onBack}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="super-payment-content">
          <div className="super-order-summary-mini">
        <div className="mini-summary-header">
          <span className="summary-icon">📋</span>
          <h4>Order Summary</h4>
        </div>

        <div className="mini-artwork-display">
          <div className="mini-artwork-image">
            {(artwork.category === "3d_model" ||
              artwork.category === "3D Models" ||
              artwork.category === "3d_models" ||
              artwork.subcategory?.toLowerCase().includes("3d") ||
              artwork.medium?.toLowerCase().includes("3d")) ? (
              <div className="model-3d-placeholder mini">
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
                  className="mini-artwork-img"
                />
              )
            )}
          </div>

          <div className="mini-artwork-info">
            <span className="item-name">{artwork.title}</span>
            <span className="item-artist">by {artwork.artistName}</span>
            <span className="item-price">${orderData?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="super-payment-details-form">
        <div className="super-form-section">
          <div className="section-header">
            <span className="section-icon">💳</span>
            <h4>Payment Information</h4>
          </div>

          {errors.general && (
            <div className="super-error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <p>{errors.general}</p>
              </div>
            </div>
          )}

          <div className="super-form-group">
            <label className="super-label">
              <span className="label-text">Cardholder Name</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
                className={`super-form-input ${errors.cardholderName ? "error" : ""}`}
                placeholder="Enter full name as on card"
                required
              />
              <div className="input-icon">👤</div>
            </div>
            {errors.cardholderName && (
              <span className="super-field-error">{errors.cardholderName}</span>
            )}
          </div>

          <div className="super-form-group">
            <label className="super-label">
              <span className="label-text">Card Number</span>
              <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className={`super-form-input ${errors.cardNumber ? "error" : ""}`}
                placeholder="1234 5678 9012 3456"
                required
              />
              <div className="input-icon">💳</div>
            </div>
            {errors.cardNumber && (
              <span className="super-field-error">{errors.cardNumber}</span>
            )}
          </div>

          <div className="super-form-row">
            <div className="super-form-group">
              <label className="super-label">
                <span className="label-text">Expiry Date</span>
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  className={`super-form-input ${errors.expiryDate ? "error" : ""}`}
                  placeholder="MM/YY"
                  required
                />
                <div className="input-icon">📅</div>
              </div>
              {errors.expiryDate && (
                <span className="super-field-error">{errors.expiryDate}</span>
              )}
            </div>
            <div className="super-form-group">
              <label className="super-label">
                <span className="label-text">CVV</span>
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  className={`super-form-input ${errors.cvv ? "error" : ""}`}
                  placeholder="123"
                  required
                />
                <div className="input-icon">🔒</div>
              </div>
              {errors.cvv && <span className="super-field-error">{errors.cvv}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Billing Address</h4>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sameAsShipping"
                checked={paymentData.sameAsShipping}
                onChange={handleInputChange}
              />
              Same as shipping address
            </label>
          </div>

          {!paymentData.sameAsShipping && (
            <>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="billing.address"
                  value={paymentData.billingAddress.address}
                  onChange={handleInputChange}
                  className={errors["billing.address"] ? "error" : ""}
                  required
                />
                {errors["billing.address"] && (
                  <span className="field-error">
                    {errors["billing.address"]}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="billing.city"
                    value={paymentData.billingAddress.city}
                    onChange={handleInputChange}
                    className={errors["billing.city"] ? "error" : ""}
                    required
                  />
                  {errors["billing.city"] && (
                    <span className="field-error">
                      {errors["billing.city"]}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="billing.state"
                    value={paymentData.billingAddress.state}
                    onChange={handleInputChange}
                    className={errors["billing.state"] ? "error" : ""}
                    required
                  />
                  {errors["billing.state"] && (
                    <span className="field-error">
                      {errors["billing.state"]}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="billing.zipCode"
                    value={paymentData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    className={errors["billing.zipCode"] ? "error" : ""}
                    required
                  />
                  {errors["billing.zipCode"] && (
                    <span className="field-error">
                      {errors["billing.zipCode"]}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="super-payment-actions">
          <button
            type="button"
            className="back-btn"
            onClick={onBack}
            disabled={processing}
          >
            Back to Order
          </button>
          <button type="submit" className="pay-btn" disabled={processing}>
            {processing
              ? "Processing..."
              : `Pay $${orderData?.total?.toFixed(2)}`}
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
