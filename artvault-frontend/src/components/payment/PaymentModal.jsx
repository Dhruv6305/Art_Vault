import { useState } from "react";
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
    <div className="super-payment-modal-overlay" onClick={handleClose}>
      <div className="super-payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="super-payment-header">
          <div className="payment-header-icon">
            {currentStep === "summary" && "📋"}
            {currentStep === "payment" && "💳"}
            {currentStep === "success" && "✅"}
          </div>
          <div className="payment-header-content">
            <h2>
              {currentStep === "summary" && "Order Summary"}
              {currentStep === "payment" && "Payment Details"}
              {currentStep === "success" && "Order Confirmed"}
            </h2>
            <div className="payment-progress">
              <div className={`progress-dot ${currentStep === "summary" ? "active" : "completed"}`}>1</div>
              <div className="progress-line"></div>
              <div className={`progress-dot ${currentStep === "payment" ? "active" : currentStep === "success" ? "completed" : ""}`}>2</div>
              <div className="progress-line"></div>
              <div className={`progress-dot ${currentStep === "success" ? "active" : ""}`}>3</div>
            </div>
          </div>
          <button className="super-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="super-payment-content">
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
