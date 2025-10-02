import React, { useState, useEffect } from "react";
import Standard3DCanvas from "./Standard3DCanvas.jsx";

const ThreeDModelModal = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  artworkTitle,
  artworkArtist,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isFullscreen, onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: isFullscreen ? "0" : "20px",
  };

  const contentStyle = {
    position: "relative",
    width: isFullscreen ? "100vw" : "min(90vw, 1200px)",
    height: isFullscreen ? "100vh" : "min(80vh, 800px)",
    backgroundColor: "#1a1a1a",
    borderRadius: isFullscreen ? "0" : "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "16px 20px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  };

  const canvasContainerStyle = {
    flex: 1,
    position: "relative",
    minHeight: 0,
  };

  const buttonStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "8px",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={modalStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              {artworkTitle || fileName || "3D Model"}
            </h3>
            {artworkArtist && (
              <p
                style={{ margin: "4px 0 0 0", fontSize: "14px", opacity: 0.8 }}
              >
                by {artworkArtist}
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              style={buttonStyle}
              onClick={toggleFullscreen}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              {isFullscreen ? "🗗 Exit Fullscreen" : "🗖 Fullscreen"}
            </button>
            <button
              style={buttonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div style={canvasContainerStyle}>
          <Standard3DCanvas
            fileUrl={fileUrl}
            fileName={fileName}
            width={
              isFullscreen
                ? window.innerWidth
                : Math.min(window.innerWidth * 0.9, 1200)
            }
            height={
              isFullscreen
                ? window.innerHeight - 80
                : Math.min(window.innerHeight * 0.8 - 80, 720)
            }
            autoRotate={false}
            showControls={true}
            backgroundColor="#1a1a1a"
            showInfo={true}
            preventDownload={true}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: 0,
            }}
          />
        </div>

        {/* Footer with instructions */}
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderTop: "1px solid #333",
            color: "white",
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ opacity: 0.8 }}>
            🖱️ Drag to orbit • 🔍 Scroll to zoom • ⌨️ Press ESC to close
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "11px",
              opacity: 0.6,
            }}
          >
            🔒 Download protected • 🚫 Right-click disabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDModelModal;
