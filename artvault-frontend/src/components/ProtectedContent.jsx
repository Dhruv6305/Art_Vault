import React, { useEffect, useRef } from "react";

/**
 * ProtectedContent Component
 * Wraps content with additional protection layers
 */
const ProtectedContent = ({
  children,
  className = "",
  showWatermark = false,
  watermarkText = "Protected Content",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Apply protection styles
    container.style.cssText += `
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
      position: relative;
      overflow: hidden;
    `;

    // Protect all images and videos in this container
    const mediaElements = container.querySelectorAll("img, video");
    mediaElements.forEach((element) => {
      element.style.cssText += `
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      `;

      element.setAttribute("oncontextmenu", "return false");
      element.setAttribute("ondragstart", "return false");
      element.setAttribute("onselectstart", "return false");

      if (element.tagName === "VIDEO") {
        element.setAttribute(
          "controlsList",
          "nodownload nofullscreen noremoteplaybook"
        );
        element.setAttribute("disablePictureInPicture", "true");
      }
    });

    // Add watermark if requested
    let watermark = null;
    if (showWatermark) {
      watermark = document.createElement("div");
      watermark.textContent = watermarkText;
      watermark.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 24px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.1);
        pointer-events: none;
        z-index: 10;
        user-select: none;
        font-family: Arial, sans-serif;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        white-space: nowrap;
      `;
      container.appendChild(watermark);
    }

    // Event handlers
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleSelectStart = (e) => {
      if (
        !["INPUT", "TEXTAREA"].includes(e.target.tagName) &&
        !e.target.contentEditable
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Add event listeners
    container.addEventListener("contextmenu", handleContextMenu, true);
    container.addEventListener("dragstart", handleDragStart, true);
    container.addEventListener("selectstart", handleSelectStart, true);

    // Cleanup
    return () => {
      if (watermark && watermark.parentNode) {
        watermark.parentNode.removeChild(watermark);
      }
      container.removeEventListener("contextmenu", handleContextMenu, true);
      container.removeEventListener("dragstart", handleDragStart, true);
      container.removeEventListener("selectstart", handleSelectStart, true);
    };
  }, [showWatermark, watermarkText]);

  return (
    <div
      ref={containerRef}
      className={`protected-content ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onSelectStart={(e) => {
        if (!["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
};

export default ProtectedContent;
