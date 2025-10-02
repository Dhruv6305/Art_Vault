import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Standard3DCanvas from "../components/3d/Standard3DCanvas.jsx";
import ThreeDModelModal from "../components/3d/ThreeDModelModal.jsx";
// import ProtectedContent from "../components/ProtectedContent.jsx"; // Disabled for now

const Marketplace = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedThreeDModel, setSelectedThreeDModel] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/artworks", {
        params: {
          availability: "available",
          limit: 8, // Show first 8 artworks
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      if (response.data.success) {
        setArtworks(response.data.artworks);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load artworks");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(price.amount);
  };

  const getFilePreview = (artwork) => {
    const primaryFile =
      artwork.files?.find((file) => file.isPrimary) || artwork.files?.[0];

    if (!primaryFile) {
      return (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          🎨 {artwork.title}
        </div>
      );
    }

    const fileUrl = primaryFile.url.startsWith("http")
      ? primaryFile.url
      : `http://localhost:5000/${primaryFile.url}`;

    // Check if it's a 3D model by file type OR file extension OR artwork category
    const is3DModel =
      primaryFile.type === "3d_model" ||
      artwork.category === "3d_model" ||
      (primaryFile.filename &&
        /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(
          primaryFile.filename
        ));

    if (is3DModel) {
      return (
        <div style={{ width: "100%", height: "200px", position: "relative" }}>
          <Standard3DCanvas
            fileUrl={fileUrl}
            fileName={primaryFile.filename}
            width={300}
            height={200}
            showControls={true}
            autoRotate={false}
            backgroundColor="#1a1a1a"
            showInfo={true}
            preventDownload={true}
            onModelClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedThreeDModel({
                fileUrl,
                fileName: primaryFile.filename,
                artworkTitle: artwork.title,
                artworkArtist: artwork.artistName,
              });
            }}
            style={{
              cursor: "grab",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      );
    }

    switch (primaryFile.type) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={artwork.title}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        );
      case "video":
        return (
          <video
            src={fileUrl}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            muted
            poster={`${fileUrl}#t=1`}
          />
        );
      case "audio":
        return (
          <div
            style={{
              width: "100%",
              height: "200px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎵</div>
            <div>{artwork.title}</div>
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "100%",
              height: "200px",
              background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            📄 {artwork.title}
          </div>
        );
    }
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  return (
    <div className="page-container">
      {/* ProtectedContent wrapper disabled - to enable, uncomment the import and wrap content */}
      <h2>Art Marketplace</h2>
      <p>Browse, buy, and sell amazing digital creations.</p>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--error-color)",
            borderRadius: "8px",
            padding: "1rem",
            margin: "1rem 0",
            color: "var(--error-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Art gallery */}
      <div
        className="artwork-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 320px)",
          gap: "2rem",
          marginTop: "2rem",
          justifyContent: "center",
          padding: "0 1rem",
        }}
      >
        {loading ? (
          // Loading placeholders
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`loading-${index}`}
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
                  background: "var(--surface-color)",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <div className="spinner"></div>
              </div>
              <div
                style={{
                  height: "1.5rem",
                  background: "var(--surface-color)",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              ></div>
              <div
                style={{
                  height: "1rem",
                  background: "var(--surface-color)",
                  borderRadius: "4px",
                  width: "70%",
                }}
              ></div>
            </div>
          ))
        ) : artworks.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
            <h3>No artworks available</h3>
            <p>Check back later for new amazing creations!</p>
          </div>
        ) : (
          // Real artwork cards
          artworks.map((artwork) => (
            <div
              key={artwork._id}
              style={{
                background: "var(--card-color)",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              onClick={() => handleArtworkClick(artwork._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {getFilePreview(artwork)}
                {/* Fallback div for failed images */}
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                    borderRadius: "8px",
                    display: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  🎨 {artwork.title}
                </div>
              </div>

              <h3
                style={{ color: "var(--text-accent)", margin: "0 0 0.5rem 0" }}
              >
                {artwork.title}
              </h3>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                by {artwork.artistName}
              </p>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  margin: "0 0 1rem 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {artwork.description ||
                  "Beautiful artwork available for purchase."}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {formatPrice(artwork.price)}
                  </span>
                  {artwork.price.negotiable && (
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        marginLeft: "0.5rem",
                      }}
                    >
                      Negotiable
                    </span>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    pointerEvents: "none", // Prevent button click from interfering with card click
                  }}
                >
                  View Details
                </button>
              </div>

              {artwork.quantity > 1 && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  📦 {artwork.quantity} available
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {artworks.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/browse")}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
            }}
          >
            Browse All Artworks →
          </button>
        </div>
      )}

      {/* 3D Model Modal */}
      <ThreeDModelModal
        isOpen={!!selectedThreeDModel}
        onClose={() => setSelectedThreeDModel(null)}
        fileUrl={selectedThreeDModel?.fileUrl}
        fileName={selectedThreeDModel?.fileName}
        artworkTitle={selectedThreeDModel?.artworkTitle}
        artworkArtist={selectedThreeDModel?.artworkArtist}
      />
    </div>
  );
};

export default Marketplace;
