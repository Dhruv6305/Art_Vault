import React, { useState, useEffect } from "react";
import ThreeDViewer from "./ThreeDViewer.jsx";
import {
  Gallery3DCanvas,
  Medium3DCanvas,
  Large3DCanvas,
} from "./ThreeDCanvasPresets";
import { threeDCategories, getFormatInfo } from "../../utils/3dCategories.js";

const ThreeDDisplay = ({
  artwork,
  showDetails = true,
  showControls = true,
  autoRotate = true,
  viewerHeight = "500px",
  onLike,
  onPurchase,
  currentUser,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerSettings, setViewerSettings] = useState({
    autoRotate: autoRotate,
    showControls: showControls,
    backgroundColor: "#1a1a1a",
    modelScale: 1,
    cameraPosition: [0, 0, 5],
  });

  // Initialize with first 3D file
  useEffect(() => {
    if (artwork?.files?.length > 0) {
      const firstThreeDFile = artwork.files.find(
        (file) => file.type === "3d_model"
      );
      if (firstThreeDFile) {
        setSelectedFile(firstThreeDFile);
      }
    }
  }, [artwork]);

  if (!artwork) {
    return <div>No artwork data available</div>;
  }

  const threeDFiles =
    artwork.files?.filter((file) => file.type === "3d_model") || [];
  const otherFiles =
    artwork.files?.filter((file) => file.type !== "3d_model") || [];
  const subcategoryInfo =
    threeDCategories["3d_model"]?.subcategories[artwork.subcategory];

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const updateViewerSettings = (newSettings) => {
    setViewerSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div
      className="threed-display"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Main 3D Viewer */}
      <div className="viewer-section" style={{ marginBottom: "30px" }}>
        {selectedFile ? (
          <div style={{ position: "relative" }}>
            <div style={{ height: viewerHeight }}>
              <ThreeDViewer
                fileUrl={
                  selectedFile.url.startsWith("http")
                    ? selectedFile.url
                    : `http://localhost:5000/${selectedFile.url}`
                }
                fileName={selectedFile.filename}
                autoRotate={viewerSettings.autoRotate}
                showControls={viewerSettings.showControls}
                backgroundColor={viewerSettings.backgroundColor}
                modelScale={viewerSettings.modelScale}
                cameraPosition={viewerSettings.cameraPosition}
              />
            </div>

            {/* Viewer Controls */}
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                background: "rgba(0,0,0,0.8)",
                padding: "10px",
                borderRadius: "8px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() =>
                  updateViewerSettings({
                    autoRotate: !viewerSettings.autoRotate,
                  })
                }
                style={{
                  background: viewerSettings.autoRotate ? "#28a745" : "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {viewerSettings.autoRotate ? "⏸️ Stop" : "▶️ Rotate"}
              </button>

              <select
                value={viewerSettings.backgroundColor}
                onChange={(e) =>
                  updateViewerSettings({ backgroundColor: e.target.value })
                }
                style={{
                  background: "#333",
                  color: "white",
                  border: "none",
                  padding: "5px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <option value="#1a1a1a">Dark</option>
                <option value="#ffffff">White</option>
                <option value="#f0f0f0">Light Gray</option>
                <option value="#2c3e50">Blue Gray</option>
              </select>

              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={viewerSettings.modelScale}
                onChange={(e) =>
                  updateViewerSettings({
                    modelScale: parseFloat(e.target.value),
                  })
                }
                style={{ width: "80px" }}
                title="Scale"
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              height: viewerHeight,
              background: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "2px dashed #dee2e6",
              flexDirection: "column",
              color: "#666",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎲</div>
            <div>No 3D files available</div>
          </div>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}
      >
        {/* Artwork Details */}
        {showDetails && (
          <div className="artwork-details">
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
                {artwork.title}
              </h1>
              <p
                style={{
                  color: "#666",
                  fontSize: "18px",
                  margin: "0 0 15px 0",
                }}
              >
                by {artwork.artistName}
              </p>

              {/* Category Badge */}
              {subcategoryInfo && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#e3f2fd",
                    color: "#1976d2",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    marginBottom: "15px",
                  }}
                >
                  <span>{subcategoryInfo.icon}</span>
                  <span>{subcategoryInfo.name}</span>
                </div>
              )}

              <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
                {artwork.description}
              </p>
            </div>

            {/* Technical Details */}
            <div className="technical-details" style={{ marginBottom: "25px" }}>
              <h3 style={{ marginBottom: "15px" }}>Technical Details</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <strong>Category:</strong>
                  <br />
                  <span style={{ color: "#666" }}>3D Model</span>
                </div>
                <div>
                  <strong>Type:</strong>
                  <br />
                  <span style={{ color: "#666" }}>{artwork.artworkType}</span>
                </div>
                <div>
                  <strong>Style:</strong>
                  <br />
                  <span style={{ color: "#666" }}>
                    {artwork.style || "Not specified"}
                  </span>
                </div>
                <div>
                  <strong>Technique:</strong>
                  <br />
                  <span style={{ color: "#666" }}>
                    {artwork.technique || "Not specified"}
                  </span>
                </div>
              </div>

              {artwork.dimensions &&
                (artwork.dimensions.width ||
                  artwork.dimensions.height ||
                  artwork.dimensions.depth) && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>Dimensions:</strong>
                    <br />
                    <span style={{ color: "#666" }}>
                      {artwork.dimensions.width &&
                        `${artwork.dimensions.width}${artwork.dimensions.unit}`}
                      {artwork.dimensions.width &&
                        artwork.dimensions.height &&
                        " × "}
                      {artwork.dimensions.height &&
                        `${artwork.dimensions.height}${artwork.dimensions.unit}`}
                      {artwork.dimensions.height &&
                        artwork.dimensions.depth &&
                        " × "}
                      {artwork.dimensions.depth &&
                        `${artwork.dimensions.depth}${artwork.dimensions.unit}`}
                    </span>
                  </div>
                )}

              {artwork.yearCreated && (
                <div style={{ marginTop: "15px" }}>
                  <strong>Year Created:</strong>
                  <br />
                  <span style={{ color: "#666" }}>{artwork.yearCreated}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="tags-section" style={{ marginBottom: "25px" }}>
                <h3 style={{ marginBottom: "10px" }}>Tags</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {artwork.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#f8f9fa",
                        color: "#495057",
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "14px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              className="action-buttons"
              style={{ display: "flex", gap: "15px", marginTop: "25px" }}
            >
              {onLike && (
                <button
                  onClick={() => onLike(artwork._id)}
                  style={{
                    background: "none",
                    border: "2px solid #dc3545",
                    color: "#dc3545",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ❤️ Like ({artwork.likes?.length || 0})
                </button>
              )}

              {onPurchase && (
                <button
                  onClick={() => onPurchase(artwork)}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Buy Now - ${artwork.price?.amount || 0}
                </button>
              )}
            </div>
          </div>
        )}

        {/* File List & Info */}
        <div className="file-info">
          <h3 style={{ marginBottom: "15px" }}>
            3D Files ({threeDFiles.length})
          </h3>

          {threeDFiles.length > 0 ? (
            <div className="file-list" style={{ marginBottom: "25px" }}>
              {threeDFiles.map((file, index) => {
                const formatInfo = getFormatInfo(
                  file.filename.split(".").pop()
                );
                const isSelected = selectedFile?.filename === file.filename;

                return (
                  <div
                    key={index}
                    onClick={() => handleFileSelect(file)}
                    style={{
                      padding: "12px",
                      border: `2px solid ${isSelected ? "#007bff" : "#dee2e6"}`,
                      borderRadius: "8px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      background: isSelected ? "#f8f9ff" : "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div style={{ fontSize: "24px" }}>🎲</div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontWeight: "bold", marginBottom: "4px" }}
                        >
                          {file.filename}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {formatInfo?.name || "Unknown format"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ color: "#007bff", fontWeight: "bold" }}>
                          ✓ Viewing
                        </div>
                      )}
                    </div>

                    {formatInfo && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#666",
                          borderTop: "1px solid #eee",
                          paddingTop: "8px",
                        }}
                      >
                        <div>
                          <strong>Supports:</strong>{" "}
                          {formatInfo.supports.join(", ")}
                        </div>
                        <div>
                          <strong>Compatibility:</strong>{" "}
                          {formatInfo.compatibility}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#666",
                background: "#f8f9fa",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            >
              No 3D files available
            </div>
          )}

          {/* Other Files */}
          {otherFiles.length > 0 && (
            <div>
              <h4 style={{ marginBottom: "10px" }}>
                Additional Files ({otherFiles.length})
              </h4>
              <div className="other-files">
                {otherFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>
                      {file.type === "image" && "🖼️"}
                      {file.type === "video" && "🎥"}
                      {file.type === "audio" && "🎵"}
                      {file.type === "document" && "📄"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px" }}>{file.filename}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {file.type} • {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artwork Stats */}
          <div
            className="artwork-stats"
            style={{
              marginTop: "25px",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>Statistics</h4>
            <div style={{ fontSize: "14px", color: "#666" }}>
              <div>Views: {artwork.views || 0}</div>
              <div>Likes: {artwork.likes?.length || 0}</div>
              <div>Available: {artwork.quantity || 0}</div>
              <div>
                Created: {new Date(artwork.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDDisplay;
