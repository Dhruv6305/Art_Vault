import React from "react";
import Standard3DCanvas from "./3d/Standard3DCanvas.jsx";

const Test3DViewer = () => {
  // Test with known working 3D models
  const testModels = [
    {
      name: "Simple Box",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
      fileName: "box.gltf",
    },
    {
      name: "Duck Model",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
      fileName: "duck.gltf",
    },
    {
      name: "Damaged Helmet",
      url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
      fileName: "damaged_helmet.gltf",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2>🎲 3D Viewer Test</h2>
      <p>Testing 3D model loading and visibility with known working models:</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {testModels.map((model, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#2a2a2a",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{model.name}</h3>
            <Standard3DCanvas
              fileUrl={model.url}
              fileName={model.fileName}
              width={400}
              height={300}
              autoRotate={true}
              showControls={true}
              showInfo={true}
              backgroundColor="#1a1a1a"
            />
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                opacity: 0.7,
                wordBreak: "break-all",
              }}
            >
              URL: {model.url}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#333",
          borderRadius: "8px",
        }}
      >
        <h3>🔍 Debug Information</h3>
        <p>Check the browser console for detailed loading logs.</p>
        <p>Each model should show:</p>
        <ul>
          <li>✅ Loading progress messages</li>
          <li>📐 Model positioning info (size, center, camera distance)</li>
          <li>🔍 Mesh count and material information</li>
          <li>📦 Bounding box calculations</li>
          <li>📷 Camera positioning details</li>
        </ul>
        <p>
          <strong>If models still don't appear:</strong>
        </p>
        <ul>
          <li>Try the wireframe mode (📐 Wire button)</li>
          <li>Check if the model bounds are showing in the info overlay</li>
          <li>Look for any error messages in the console</li>
        </ul>
      </div>
    </div>
  );
};

export default Test3DViewer;
