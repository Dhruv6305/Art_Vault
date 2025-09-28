import React, { useState } from "react";
import PaymentModal from "./payment/PaymentModal.jsx";

const TestPayment = () => {
  const [showModal, setShowModal] = useState(false);

  // Real artwork data from database for testing
  const mockArtwork = {
    _id: "68d41712e41f7f98cb0cccac", // Real artwork ID from database
    title: "Audioo",
    artistName: "Aarya Bhansali",
    medium: "oil",
    price: {
      amount: 300.0,
      currency: "USD",
      negotiable: false,
    },
    quantity: 18,
    files: [
      {
        url: "http://localhost:5000/uploads/audio/files-1758729999815-530002978.mp3",
        type: "audio",
        filename: "reliable-safe-327618.mp3",
      },
    ],
    dimensions: {
      width: null,
      height: null,
      unit: "cm",
    },
    category: "music",
    subcategory: "Sound Effect",
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Payment System Test</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          margin: "20px auto",
          maxWidth: "400px",
          borderRadius: "8px",
        }}
      >
        <img
          src={mockArtwork.files[0].url}
          alt={mockArtwork.title}
          style={{
            width: "200px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
        <h3>{mockArtwork.title}</h3>
        <p>by {mockArtwork.artistName}</p>
        <p>
          <strong>${mockArtwork.price.amount}</strong>
        </p>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Test Buy Now
        </button>
      </div>

      <PaymentModal
        artwork={mockArtwork}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        quantity={1}
      />
    </div>
  );
};

export default TestPayment;
