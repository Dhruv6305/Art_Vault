import React, { useState } from "react";
import Standard3DCanvas from "../components/3d/Standard3DCanvas.jsx";
import Test3DUpload from "../components/Test3DUpload.jsx";
import FBXDebugger from "../components/FBXDebugger.jsx";

const Test3D = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [customFBXUrl, setCustomFBXUrl] = useState("");
  const [customFileName, setCustomFileName] = useState("");

  // Sample 3D model URLs for testing - using known working models
  const sampleModels = [
    {
      name: "Simple Box (GLTF)",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
      fileName: "box.gltf",
      format: "gltf",
    },
    {
      name: "Duck Model (GLTF)",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
      fileName: "duck.gltf",
      format: "gltf",
    },
    {
      name: "Damaged Helmet (GLTF)",
      url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
      fileName: "damaged_helmet.gltf",
      format: "gltf",
    },
    {
      name: "Avocado (GLTF)",
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf",
      fileName: "avocado.gltf",
      format: "gltf",
    },
    {
      name: "Xbot Character (FBX)",
      url: "https://threejs.org/examples/models/fbx/Xbot.fbx",
      fileName: "xbot.fbx",
      format: "fbx",
    },
    {
      name: "Samba Dancing (FBX)",
      url: "https://threejs.org/examples/models/fbx/Samba Dancing.fbx",
      fileName: "samba_dancing.fbx",
      format: "fbx",
    },
    {
      name: "Bunny Model (OBJ)",
      url: "https://threejs.org/examples/models/obj/bunny.obj",
      fileName: "bunny.obj",
      format: "obj",
    },
  ];

  return (
    <div
      className="test-3d-page"
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>🎲 Enhanced 3D Model Viewer Test</h1>
      <p style={{ marginBottom: "30px", opacity: 0.8 }}>
        Testing the enhanced 3D viewer with improved positioning, debugging, and
        visibility features.
      </p>

      <div className="test-section" style={{ marginBottom: "40px" }}>
        <h2>🚀 Direct 3D File Upload Test</h2>
        <p style={{ marginBottom: "15px", opacity: 0.8 }}>
          Test uploading 3D files directly to the server with authentication.
        </p>
        <Test3DUpload />
      </div>

      <div
        className="fbx-debug-section"
        style={{
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#2d1b69",
          borderRadius: "12px",
          border: "1px solid #6c5ce7",
        }}
      >
        <h2>🔧 FBX Debug Tool</h2>
        <p style={{ marginBottom: "20px", opacity: 0.8 }}>
          Debug your specific FBX file that's not loading. Enter the URL of your
          uploaded FBX model.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              FBX File URL:
            </label>
            <input
              type="text"
              value={customFBXUrl}
              onChange={(e) => setCustomFBXUrl(e.target.value)}
              placeholder="http://localhost:5000/uploads/3d_models/your-file.fbx"
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              File Name:
            </label>
            <input
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="your-model.fbx"
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "10px" }}>
            💡 Tip: Right-click on your FBX model in the artwork detail page and
            copy the image URL, then replace the image extension with .fbx
          </div>
        </div>

        {customFBXUrl && customFileName && (
          <FBXDebugger fileUrl={customFBXUrl} fileName={customFileName} />
        )}

        {(!customFBXUrl || !customFileName) && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            Enter FBX URL and filename above to start debugging
          </div>
        )}
      </div>

      <div className="test-section" style={{ marginBottom: "40px" }}>
        <h2>🎮 Enhanced 3D Viewer Test</h2>
        <p style={{ marginBottom: "20px", opacity: 0.8 }}>
          Testing with sample 3D models using the enhanced Standard3DCanvas
          component:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "25px",
            marginBottom: "30px",
          }}
        >
          {sampleModels.map((model, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#2a2a2a",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#fff" }}>
                {model.name}
              </h3>
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
                  marginTop: "15px",
                  fontSize: "12px",
                  opacity: 0.6,
                  wordBreak: "break-all",
                  padding: "10px",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "6px",
                }}
              >
                <div>
                  <strong>Format:</strong> {model.format.toUpperCase()}
                </div>
                <div>
                  <strong>URL:</strong> {model.url}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="debug-section"
        style={{
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#333",
          borderRadius: "12px",
          border: "1px solid #555",
        }}
      >
        <h2>🔍 Debug Information & Features</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h3>📊 Console Logging</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>✅ Model loading progress</li>
              <li>📐 Bounding box calculations</li>
              <li>📷 Camera positioning details</li>
              <li>🔍 Mesh count and materials</li>
              <li>⚠️ Error handling and warnings</li>
            </ul>
          </div>
          <div>
            <h3>🎮 Interactive Features</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>🖱️ Drag to rotate (orbital controls)</li>
              <li>🔍 Scroll to zoom with limits</li>
              <li>▶️ Auto-rotate toggle</li>
              <li>📐 Wireframe mode toggle</li>
              <li>📊 Real-time model info overlay</li>
            </ul>
          </div>
          <div>
            <h3>🛠️ Enhanced Positioning</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>🎯 Automatic model centering</li>
              <li>📏 Smart camera distance calculation</li>
              <li>🔄 Adaptive zoom limits</li>
              <li>💡 Better lighting setup</li>
              <li>🎨 Material fallbacks for errors</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="fbx-debug-section"
        style={{
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#2d1b69",
          borderRadius: "12px",
          border: "1px solid #6c5ce7",
        }}
      >
        <h2>🎯 FBX Model Debugging</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h3>🔍 Common FBX Issues</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>
                <strong>Model too large/small:</strong> Auto-scaling implemented
              </li>
              <li>
                <strong>Black appearance:</strong> Try wireframe mode (📐 Wire)
              </li>
              <li>
                <strong>Missing textures:</strong> Fallback materials applied
              </li>
              <li>
                <strong>Loading errors:</strong> Check console for details
              </li>
              <li>
                <strong>Wrong positioning:</strong> Use coordinate controls
              </li>
            </ul>
          </div>
          <div>
            <h3>🛠️ Debug Steps</h3>
            <ol style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>Check console for FBX loading logs</li>
              <li>Try wireframe mode to see geometry</li>
              <li>Use coordinate panel to reposition camera</li>
              <li>Reset camera if model seems off-screen</li>
              <li>Compare with working GLTF models</li>
            </ol>
          </div>
          <div>
            <h3>💡 FBX vs Other Formats</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>
                <strong>GLTF:</strong> ⭐⭐⭐⭐⭐ Best web support
              </li>
              <li>
                <strong>FBX:</strong> ⭐⭐⭐ Complex but feature-rich
              </li>
              <li>
                <strong>OBJ:</strong> ⭐⭐⭐⭐ Simple and reliable
              </li>
              <li>
                <strong>STL:</strong> ⭐⭐ Basic geometry only
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="test-section" style={{ marginBottom: "40px" }}>
        <h2>📋 Supported 3D Formats</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              ext: "GLTF",
              desc: "GL Transmission Format",
              support: "✅ Full Support",
              color: "#4CAF50",
            },
            {
              ext: "GLB",
              desc: "GLTF Binary",
              support: "✅ Full Support",
              color: "#4CAF50",
            },
            {
              ext: "FBX",
              desc: "Autodesk FBX",
              support: "⚠️ Limited Support",
              color: "#FF9800",
            },
            {
              ext: "OBJ",
              desc: "Wavefront OBJ",
              support: "⚠️ Basic Support",
              color: "#FF9800",
            },
            {
              ext: "STL",
              desc: "Stereolithography",
              support: "⚠️ Basic Support",
              color: "#FF9800",
            },
            {
              ext: "BLEND",
              desc: "Blender File",
              support: "❌ Upload Only",
              color: "#F44336",
            },
            {
              ext: "DAE",
              desc: "COLLADA",
              support: "❌ Upload Only",
              color: "#F44336",
            },
            {
              ext: "3DS",
              desc: "3D Studio",
              support: "❌ Upload Only",
              color: "#F44336",
            },
          ].map((format, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                border: "1px solid #444",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#2a2a2a",
                borderLeft: `4px solid ${format.color}`,
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                  color: "#fff",
                }}
              >
                {format.ext}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#ccc",
                  marginBottom: "10px",
                }}
              >
                {format.desc}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: format.color,
                }}
              >
                {format.support}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="troubleshooting-section"
        style={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #4a90e2",
        }}
      >
        <h2>🔧 Troubleshooting Guide</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h3>❌ If Models Don't Appear:</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>Check browser console for errors</li>
              <li>Try wireframe mode (📐 Wire button)</li>
              <li>Look for model bounds in info overlay</li>
              <li>Verify model URL is accessible</li>
              <li>Check if model has valid geometry</li>
            </ul>
          </div>
          <div>
            <h3>🐛 Common Issues:</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>
                <strong>Empty viewer:</strong> Model positioning issue
              </li>
              <li>
                <strong>Loading forever:</strong> Network or CORS error
              </li>
              <li>
                <strong>No textures:</strong> Missing texture files
              </li>
              <li>
                <strong>Too small/large:</strong> Scale calculation issue
              </li>
              <li>
                <strong>No interaction:</strong> Controls not enabled
              </li>
            </ul>
          </div>
          <div>
            <h3>✅ Success Indicators:</h3>
            <ul style={{ fontSize: "14px", opacity: 0.9 }}>
              <li>Model bounds shown in info overlay</li>
              <li>Console shows "Successfully loaded"</li>
              <li>Wireframe mode reveals geometry</li>
              <li>Camera positioning logs appear</li>
              <li>Interactive controls respond</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test3D;
