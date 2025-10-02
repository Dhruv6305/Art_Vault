import React, { useState } from "react";
import api from "../api/axios.js";
import SimpleThreeDViewer from "./3d/SimpleThreeDViewer.jsx";
import Standard3DCanvas from "./3d/Standard3DCanvas.jsx";
import ThreeDModelModal from "./3d/ThreeDModelModal.jsx";
import {
  Preview3DCanvas,
  Medium3DCanvas,
  Large3DCanvas,
} from "./3d/ThreeDCanvasPresets";

const Test3DUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [canvasSize, setCanvasSize] = useState("enhanced");
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);

    if (selectedFile) {
      console.log("Selected file:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);

      const response = await api.post("/artworks/test-3d-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.msg || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🎲 3D File Upload Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="file-input"
          style={{ display: "block", marginBottom: "8px" }}
        >
          Select a 3D file to test:
        </label>
        <input
          id="file-input"
          type="file"
          accept=".fbx,.obj,.blend,.dae,.3ds,.ply,.stl,.gltf,.glb,.x3d,.ma,.mb"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />

        {file && (
          <div
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <strong>Selected file:</strong>
            <br />
            Name: {file.name}
            <br />
            Type: {file.type || "Unknown"}
            <br />
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            <br />
            Extension: {file.name.split(".").pop().toUpperCase()}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          padding: "10px 20px",
          backgroundColor: uploading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {uploading ? "Uploading..." : "Test Upload"}
      </button>

      {error && (
        <div
          style={{
            background: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            marginBottom: "20px",
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #c3e6cb",
            marginBottom: "20px",
          }}
        >
          <strong>✅ Success:</strong> {result.message}
          {/* 3D Viewer */}
          {result.file && result.file.url && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "10px", color: "#155724" }}>
                🎲 3D Model Preview:
              </h4>

              {/* Canvas Size Selector */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ marginRight: "10px", fontWeight: "bold" }}>
                  Canvas Type:
                </label>
                <select
                  value={canvasSize}
                  onChange={(e) => setCanvasSize(e.target.value)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="enhanced">
                    Enhanced 3D Canvas (Recommended)
                  </option>
                  <option value="preview">Preview (250×200)</option>
                  <option value="medium">Medium (400×300)</option>
                  <option value="large">Large (600×450)</option>
                </select>
              </div>

              {/* Enhanced 3D Canvas with all new features */}
              {canvasSize === "enhanced" && (
                <div>
                  <Standard3DCanvas
                    fileUrl={
                      result.file.url.startsWith("http")
                        ? result.file.url
                        : `http://localhost:5000${result.file.url}`
                    }
                    fileName={result.file.originalname}
                    width={600}
                    height={400}
                    autoRotate={true}
                    showControls={true}
                    backgroundColor="#1a1a1a"
                    showInfo={true}
                    preventDownload={true}
                    onModelClick={() => setShowModal(true)}
                    style={{
                      cursor: "pointer",
                      border: "2px solid #4caf50",
                      borderRadius: "12px",
                    }}
                  />

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      background: "#e8f5e8",
                      borderRadius: "8px",
                      border: "1px solid #4caf50",
                    }}
                  >
                    <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>
                      ✨ Enhanced Features:
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "20px",
                        color: "#2e7d32",
                      }}
                    >
                      <li>🎯 Auto bounding box & smart camera positioning</li>
                      <li>📏 Real-time model dimensions display</li>
                      <li>🔒 Download protection enabled</li>
                      <li>🖱️ Click to open full-screen modal</li>
                      <li>💡 Enhanced lighting system</li>
                      <li>🔍 Dynamic zoom limits</li>
                    </ul>

                    <button
                      onClick={() => setShowModal(true)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      🔍 Open Full Screen Modal
                    </button>
                  </div>
                </div>
              )}

              {/* Render appropriate canvas based on selection */}
              {canvasSize === "preview" && (
                <Preview3DCanvas
                  fileUrl={
                    result.file.url.startsWith("http")
                      ? result.file.url
                      : `http://localhost:5000${result.file.url}`
                  }
                  fileName={result.file.originalname}
                />
              )}

              {canvasSize === "medium" && (
                <Medium3DCanvas
                  fileUrl={
                    result.file.url.startsWith("http")
                      ? result.file.url
                      : `http://localhost:5000${result.file.url}`
                  }
                  fileName={result.file.originalname}
                />
              )}

              {canvasSize === "large" && (
                <Large3DCanvas
                  fileUrl={
                    result.file.url.startsWith("http")
                      ? result.file.url
                      : `http://localhost:5000${result.file.url}`
                  }
                  fileName={result.file.originalname}
                />
              )}

              {/* Original SimpleThreeDViewer for comparison */}
              <details style={{ marginTop: "15px" }}>
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                  🔍 Compare with Original Viewer
                </summary>
                <div style={{ marginTop: "10px" }}>
                  <SimpleThreeDViewer
                    fileUrl={
                      result.file.url.startsWith("http")
                        ? result.file.url
                        : `http://localhost:5000${result.file.url}`
                    }
                    fileName={result.file.originalname}
                    autoRotate={true}
                    showControls={true}
                    backgroundColor="#2a2a2a"
                    modelScale={1}
                  />
                </div>
              </details>
            </div>
          )}
          <details style={{ marginTop: "15px" }}>
            <summary
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "#155724",
              }}
            >
              📋 Upload Details
            </summary>
            <pre
              style={{
                background: "#fff",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "4px",
                fontSize: "12px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(result.file, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div
        style={{
          background: "#e3f2fd",
          padding: "15px",
          borderRadius: "4px",
          border: "1px solid #b3d9ff",
        }}
      >
        <h3>📋 Supported 3D Formats:</h3>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            <strong>FBX</strong> - Autodesk FBX format
          </li>
          <li>
            <strong>OBJ</strong> - Wavefront OBJ format
          </li>
          <li>
            <strong>BLEND</strong> - Blender files
          </li>
          <li>
            <strong>GLTF/GLB</strong> - GL Transmission Format
          </li>
          <li>
            <strong>DAE</strong> - COLLADA format
          </li>
          <li>
            <strong>STL</strong> - Stereolithography format
          </li>
          <li>
            <strong>PLY</strong> - Stanford PLY format
          </li>
          <li>
            <strong>3DS</strong> - 3D Studio format
          </li>
          <li>
            <strong>X3D</strong> - Web3D format
          </li>
          <li>
            <strong>MA/MB</strong> - Maya formats
          </li>
        </ul>
      </div>

      {/* Enhanced 3D Model Modal */}
      {result && result.file && (
        <ThreeDModelModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          fileUrl={
            result.file.url.startsWith("http")
              ? result.file.url
              : `http://localhost:5000${result.file.url}`
          }
          fileName={result.file.originalname}
          artworkTitle={`Test Upload: ${result.file.originalname}`}
          artworkArtist="Test User"
        />
      )}
    </div>
  );
};

export default Test3DUpload;
