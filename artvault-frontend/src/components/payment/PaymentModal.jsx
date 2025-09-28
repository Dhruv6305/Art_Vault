import React, { useState } from "react";
import OrderSummary from "./OrderSummary.jsx";
import PaymentForm from "./PaymentForm.jsx";
import PaymentSuccess from "./PaymentSuccess.jsx";

const PaymentModal = ({
  artwork,
  isOpen,
  onClose,
  quantity = 1,
  onOrderComplete,
}) => {
  const [currentStep, setCurrentStep] = useState("summary"); // summary, payment, success
  const [orderData, setOrderData] = useState(null);

  const handleProceedToPayment = (data) => {
    setOrderData(data);
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = (paymentData) => {
    setOrderData((prev) => ({ ...prev, ...paymentData }));
    setCurrentStep("success");

    // Notify parent component about the order completion
    if (onOrderComplete && paymentData.remainingQuantity !== undefined) {
      onOrderComplete(paymentData.remainingQuantity);
    }
  };

  const handleClose = () => {
    setCurrentStep("summary");
    setOrderData(null);
    onClose();
  };

  if (!isOpen || !artwork) return null;

  const totalAmount = artwork.price.amount * quantity;

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>
            {currentStep === "summary" && "Order Summary"}
            {currentStep === "payment" && "Payment Details"}
            {currentStep === "success" && "Order Confirmed"}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="payment-modal-content">
          {currentStep === "summary" && (
            <OrderSummary
              artwork={artwork}
              quantity={quantity}
              totalAmount={totalAmount}
              onProceed={handleProceedToPayment}
              onCancel={handleClose}
            />
          )}

          {currentStep === "payment" && (
            <PaymentForm
              artwork={artwork}
              orderData={orderData}
              totalAmount={totalAmount}
              onSuccess={handlePaymentSuccess}
              onBack={() => setCurrentStep("summary")}
            />
          )}

          {currentStep === "success" && (
            <PaymentSuccess
              artwork={artwork}
              orderData={orderData}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
