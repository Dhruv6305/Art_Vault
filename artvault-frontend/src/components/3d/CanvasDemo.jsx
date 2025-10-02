import React, { useState } from "react";
import {
  Thumbnail3DCanvas,
  Small3DCanvas,
  Medium3DCanvas,
  Large3DCanvas,
  Square3DCanvas,
  Wide3DCanvas,
  Gallery3DCanvas,
  Preview3DCanvas,
  Card3DCanvas,
  CANVAS_SIZES,
} from "./ThreeDCanvasPresets";

const CanvasDemo = () => {
  const [selectedFile, setSelectedFile] = useState({
    url: "/placeholder-3d-model.obj",
    name: "sample-model.obj",
  });

  const canvasExamples = [
    {
      title: "Thumbnail Canvas",
      description: "Perfect for lists and small previews",
      component: (
        <Thumbnail3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "150×120",
      useCase: "Artwork lists, search results",
    },
    {
      title: "Card Canvas",
      description: "Square format for artwork cards",
      component: (
        <Card3DCanvas fileUrl={selectedFile.url} fileName={selectedFile.name} />
      ),
      size: "200×200",
      useCase: "Gallery cards, featured items",
    },
    {
      title: "Preview Canvas",
      description: "For upload previews and quick views",
      component: (
        <Preview3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "250×200",
      useCase: "Upload preview, quick view",
    },
    {
      title: "Small Canvas",
      description: "Compact interactive viewer",
      component: (
        <Small3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "250×200",
      useCase: "Sidebar previews, compact displays",
    },
    {
      title: "Medium Canvas",
      description: "Standard size for main content",
      component: (
        <Medium3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "400×300",
      useCase: "Main artwork display, product pages",
    },
    {
      title: "Square Canvas",
      description: "Perfect square for uniform layouts",
      component: (
        <Square3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
          size="medium"
        />
      ),
      size: "300×300",
      useCase: "Grid layouts, portfolio displays",
    },
    {
      title: "Wide Canvas",
      description: "Banner-style wide format",
      component: (
        <Wide3DCanvas fileUrl={selectedFile.url} fileName={selectedFile.name} />
      ),
      size: "500×280",
      useCase: "Header banners, featured sections",
    },
    {
      title: "Gallery Canvas",
      description: "Optimized for artwork galleries",
      component: (
        <Gallery3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "400×300",
      useCase: "Art galleries, exhibitions",
    },
    {
      title: "Large Canvas",
      description: "Detailed viewing experience",
      component: (
        <Large3DCanvas
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
        />
      ),
      size: "600×450",
      useCase: "Detailed view, full-screen preview",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#333",
            fontSize: "28px",
          }}
        >
          🎲 3D Canvas Size Demo
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#666",
            fontSize: "16px",
          }}
        >
          Standardized 3D model viewers for consistent UI across your
          application
        </p>

        {/* Size Reference */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            📏 Available Sizes
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            {Object.entries(CANVAS_SIZES).map(([key, size]) => (
              <div
                key={key}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <strong>{key}:</strong> {size.width}×{size.height}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Examples */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px",
            marginBottom: "40px",
          }}
        >
          {canvasExamples.map((example, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fafafa",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  marginBottom: "8px",
                  color: "#333",
                  fontSize: "18px",
                }}
              >
                {example.title}
              </h3>

              <p
                style={{
                  marginBottom: "15px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                {example.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "15px",
                }}
              >
                {example.component}
              </div>

              <div style={{ fontSize: "12px", color: "#888" }}>
                <div>
                  <strong>Size:</strong> {example.size}
                </div>
                <div>
                  <strong>Use Case:</strong> {example.useCase}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Examples */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#333" }}>
            💻 Usage Examples
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              fontSize: "14px",
            }}
          >
            <div>
              <h4 style={{ color: "#555", marginBottom: "10px" }}>
                Import Components:
              </h4>
              <pre
                style={{
                  backgroundColor: "#2d3748",
                  color: "#e2e8f0",
                  padding: "15px",
                  borderRadius: "6px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {`import {
  Medium3DCanvas,
  Card3DCanvas,
  Gallery3DCanvas
} from './components/3d/ThreeDCanvasPresets';`}
              </pre>
            </div>

            <div>
              <h4 style={{ color: "#555", marginBottom: "10px" }}>
                Use in Components:
              </h4>
              <pre
                style={{
                  backgroundColor: "#2d3748",
                  color: "#e2e8f0",
                  padding: "15px",
                  borderRadius: "6px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {`// In artwork card
<Card3DCanvas 
  fileUrl={artwork.fileUrl}
  fileName={artwork.fileName}
/>

// In main display
<Medium3DCanvas
  fileUrl={model.url}
  fileName={model.name}
  autoRotate={false}
/>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            backgroundColor: "#e8f5e8",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#2d5a2d" }}>
            ✨ Features
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
              fontSize: "14px",
            }}
          >
            <div>
              <strong>🎯 Fixed Sizes:</strong> Consistent dimensions across your
              app
            </div>
            <div>
              <strong>🎮 Interactive Controls:</strong> Mouse drag rotation and
              zoom
            </div>
            <div>
              <strong>🔄 Auto-rotation:</strong> Configurable automatic model
              rotation
            </div>
            <div>
              <strong>📱 Responsive:</strong> Adapts to different screen sizes
            </div>
            <div>
              <strong>🎨 Customizable:</strong> Colors, lighting, and camera
              positions
            </div>
            <div>
              <strong>📊 Loading States:</strong> Built-in loading and error
              handling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDemo;
