import React from "react";
// import ProtectedContent from "../components/ProtectedContent.jsx"; // Disabled for now

const Marketplace = () => {
  return (
    <div className="page-container">
      {/* ProtectedContent wrapper disabled - to enable, uncomment the import and wrap content */}
      <h2>Art Marketplace</h2>
      <p>Browse, buy, and sell amazing digital creations.</p>

      {/* Example art gallery */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Sample art cards */}
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            style={{
              background: "var(--card-color)",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                background: `linear-gradient(135deg, #${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}, #${Math.floor(
                  Math.random() * 16777215
                ).toString(16)})`,
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              Digital Art #{id}
            </div>
            <h3 style={{ color: "var(--text-accent)", margin: "0 0 0.5rem 0" }}>
              Digital Masterpiece #{id}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                margin: "0 0 1rem 0",
              }}
            >
              This is a beautiful digital artwork available for purchase.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ color: "var(--primary-color)", fontWeight: "bold" }}
              >
                {(Math.random() * 10 + 0.1).toFixed(2)} ETH
              </span>
              <button
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
