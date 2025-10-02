import React, { useState } from "react";
import FBXDebugger from "../components/FBXDebugger.jsx";
import SimpleFBXViewer from "../components/SimpleFBXViewer.jsx";
import Standard3DCanvas from "../components/3d/Standard3DCanvas.jsx";
import TextureLoadingTest from "../components/TextureLoadingTest.jsx";
import TextureDebugger from "../components/TextureDebugger.jsx";

const TestFBX = () => {
  const [customFBXUrl, setCustomFBXUrl] = useState("");
  const [customFileName, setCustomFileName] = useState("");

  // Known working FBX models for testing
  const testFBXModels = [
    {
      name: "Xbot Character (Three.js Example)",
      url: "https://threejs.org/examples/models/fbx/Xbot.fbx",
      fileName: "Xbot.fbx",
      description: "Simple humanoid character model from Three.js examples",
    },
    {
      name: "Samba Dancing (Three.js Example)",
      url: "https://threejs.org/examples/models/fbx/Samba Dancing.fbx",
      fileName: "Samba Dancing.fbx",
      description: "Animated character model with dance animation",
    },
  ];

  // Your uploaded FBX file (from the database search)
  const yourFBXFile = {
    name: "Your Car Model (Uploaded)",
    url: "http://localhost:5000/uploads/3d_models/files-1759409477314-540223085.fbx",
    fileName: "Car.fbx",
    description: "Your uploaded FBX car model",
  };

  const presetFBXModels = [yourFBXFile, ...testFBXModels];

  const loadPresetModel = (model) => {
    setCustomFBXUrl(model.url);
    setCustomFileName(model.fileName);
  };

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        color: "white",
        minHeight: "100vh",
        padding: "0",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)",
          padding: "40px 20px",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              margin: "0 0 16px 0",
              background: "linear-gradient(135deg, #6c5ce7, #4ecdc4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🎯 FBX Model Test Lab
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.8,
              margin: "0",
              maxWidth: "600px",
            }}
          >
            Professional testing environment for FBX files with comprehensive
            debugging tools and enhanced visualization.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Quick Test Models */}
        <div
          style={{
            marginBottom: "50px",
            padding: "30px",
            backgroundColor: "#1a1a1a",
            borderRadius: "16px",
            border: "1px solid #333",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "32px",
                background: "linear-gradient(135deg, #6c5ce7, #4ecdc4)",
                borderRadius: "2px",
                marginRight: "16px",
              }}
            />
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: "0",
                  color: "#fff",
                }}
              >
                🚀 Quick Test Models
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  margin: "4px 0 0 0",
                }}
              >
                Click any model below to load it in the debugger
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {presetFBXModels.map((model, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  backgroundColor: "#0f0f0f",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => loadPresetModel(model)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6c5ce7";
                  e.currentTarget.style.backgroundColor = "#1a1a2e";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(108, 92, 231, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.backgroundColor = "#0f0f0f";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    height: "3px",
                    background: `linear-gradient(90deg, ${
                      index === 0
                        ? "#4ecdc4, #44a08d"
                        : index === 1
                        ? "#6c5ce7, #a8edea"
                        : "#ff6b6b, #ffa726"
                    })`,
                  }}
                />
                <h3
                  style={{
                    marginTop: "0",
                    marginBottom: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {model.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.7,
                    marginBottom: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {model.description}
                </p>
                <div
                  style={{
                    fontSize: "0.75rem",
                    opacity: 0.5,
                    fontFamily: "monospace",
                    backgroundColor: "#1a1a1a",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #333",
                  }}
                >
                  {model.fileName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom FBX Input */}
        <div
          style={{
            marginBottom: "50px",
            padding: "30px",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: "16px",
            border: "1px solid #6c5ce7",
            boxShadow: "0 8px 32px rgba(108, 92, 231, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "32px",
                background: "linear-gradient(135deg, #6c5ce7, #4ecdc4)",
                borderRadius: "2px",
                marginRight: "16px",
              }}
            />
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: "0",
                  color: "#fff",
                }}
              >
                🔧 Custom FBX Testing
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  margin: "4px 0 0 0",
                }}
              >
                Enter any FBX file URL to test it with the debugger
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 240px",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#4ecdc4",
                }}
              >
                FBX File URL:
              </label>
              <input
                type="text"
                value={customFBXUrl}
                onChange={(e) => setCustomFBXUrl(e.target.value)}
                placeholder="http://localhost:5000/uploads/3d_models/your-file.fbx"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#0f0f0f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6c5ce7";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(108, 92, 231, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#333";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#4ecdc4",
                }}
              >
                File Name:
              </label>
              <input
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="model.fbx"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#0f0f0f",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6c5ce7";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(108, 92, 231, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#333";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              opacity: 0.8,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#4ecdc4",
                fontSize: "0.9rem",
              }}
            >
              💡 Tips for finding your FBX URL:
            </h4>
            <ul
              style={{
                marginBottom: 0,
                paddingLeft: "20px",
                lineHeight: "1.5",
              }}
            >
              <li>Go to your artwork detail page</li>
              <li>Right-click on the 3D viewer area and "Inspect Element"</li>
              <li>Look for network requests to .fbx files</li>
              <li>
                Or use the backend script:{" "}
                <code
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  node find-fbx-files.js
                </code>
              </li>
            </ul>
          </div>
        </div>

        {/* Texture Loading Test - NEW! */}
        {customFBXUrl && customFileName && (
          <div
            style={{
              marginBottom: "40px",
              padding: "20px",
              backgroundColor: "#1a3a4a",
              borderRadius: "12px",
              border: "1px solid #4ecdc4",
            }}
          >
            <h2>� Texture Loading Analysis</h2>
            <p style={{ marginBottom: "20px", opacity: 0.8 }}>
              Comprehensive texture and material analysis with enhanced loading:
            </p>
            <TextureLoadingTest
              fileUrl={customFBXUrl}
              fileName={customFileName}
            />
          </div>
        )}

        {/* Texture Debug Analysis - FIRST! */}
        {customFBXUrl && customFileName && (
          <div
            style={{
              marginBottom: "40px",
              padding: "20px",
              backgroundColor: "#1a2a4a",
              borderRadius: "12px",
              border: "1px solid #4ecdc4",
            }}
          >
            <h2>🔍 Raw Texture Analysis</h2>
            <p style={{ marginBottom: "20px", opacity: 0.8 }}>
              First, let's see what textures and materials actually exist in
              your model:
            </p>
            <TextureDebugger fileUrl={customFBXUrl} fileName={customFileName} />
          </div>
        )}

        {/* Simple FBX Viewer - Try this first! */}
        {customFBXUrl && customFileName && (
          <div
            style={{
              marginBottom: "50px",
              padding: "30px",
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              border: "1px solid #4ecdc4",
              boxShadow: "0 8px 32px rgba(78, 205, 196, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "32px",
                  background: "linear-gradient(135deg, #4ecdc4, #44a08d)",
                  borderRadius: "2px",
                  marginRight: "16px",
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    margin: "0",
                    color: "#fff",
                  }}
                >
                  🎯 Enhanced Texture Viewer
                </h2>
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    margin: "4px 0 0 0",
                  }}
                >
                  This viewer preserves original textures while ensuring
                  visibility
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#0f0f0f",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <SimpleFBXViewer
                fileUrl={customFBXUrl}
                fileName={customFileName}
              />
            </div>
          </div>
        )}

        {/* FBX Debugger */}
        {customFBXUrl && customFileName && (
          <div
            style={{
              marginBottom: "40px",
              padding: "20px",
              backgroundColor: "#0f3460",
              borderRadius: "12px",
              border: "1px solid #1e6091",
            }}
          >
            <h2>🔍 FBX Debug Analysis</h2>
            <FBXDebugger fileUrl={customFBXUrl} fileName={customFileName} />
          </div>
        )}

        {/* Standard 3D Canvas Comparison */}
        {customFBXUrl && customFileName && (
          <div
            style={{
              marginBottom: "50px",
              padding: "30px",
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              border: "1px solid #444",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "32px",
                  background: "linear-gradient(135deg, #ff6b6b, #ffa726)",
                  borderRadius: "2px",
                  marginRight: "16px",
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    margin: "0",
                    color: "#fff",
                  }}
                >
                  📊 Standard Viewer Comparison
                </h2>
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    margin: "4px 0 0 0",
                  }}
                >
                  How the same FBX file appears in the standard 3D viewer
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                gap: "30px",
                alignItems: "start",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "16px",
                    color: "#4ecdc4",
                  }}
                >
                  Standard 3D Canvas
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "#0f0f0f",
                    borderRadius: "12px",
                    border: "1px solid #333",
                  }}
                >
                  <Standard3DCanvas
                    fileUrl={customFBXUrl}
                    fileName={customFileName}
                    width={800}
                    height={300}
                    autoRotate={true}
                    showControls={true}
                    showInfo={true}
                    backgroundColor="#1a1a1a"
                  />
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "16px",
                    color: "#4ecdc4",
                  }}
                >
                  Debug Information
                </h3>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#0f0f0f",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    height: "300px",
                    overflowY: "auto",
                    border: "1px solid #333",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#4ecdc4" }}>File:</strong>{" "}
                    {customFileName}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#4ecdc4" }}>URL:</strong>{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        opacity: 0.7,
                        wordBreak: "break-all",
                      }}
                    >
                      {customFBXUrl}
                    </span>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <strong style={{ color: "#4ecdc4" }}>Format:</strong> FBX
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#6c5ce7" }}>
                      Expected Behavior:
                    </strong>
                  </div>
                  <ul
                    style={{
                      marginBottom: "16px",
                      paddingLeft: "20px",
                      lineHeight: "1.4",
                    }}
                  >
                    <li>Model should load and be visible</li>
                    <li>Camera should auto-position</li>
                    <li>Controls should be responsive</li>
                    <li>Materials should render correctly</li>
                  </ul>

                  <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#ff6b6b" }}>
                      If Not Working:
                    </strong>
                  </div>
                  <ul
                    style={{
                      marginBottom: 0,
                      paddingLeft: "20px",
                      lineHeight: "1.4",
                    }}
                  >
                    <li>Check debug log above for errors</li>
                    <li>Try wireframe mode (📐 Wire button)</li>
                    <li>Use coordinate controls (📍 Coords)</li>
                    <li>Reset camera position (📷 Reset)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FBX Format Information */}
        <div
          style={{
            marginBottom: "40px",
            padding: "20px",
            backgroundColor: "#2a2a2a",
            borderRadius: "12px",
            border: "1px solid #444",
          }}
        >
          <h2>📚 FBX Format Information</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <h3>✅ FBX Advantages</h3>
              <ul style={{ fontSize: "14px", opacity: 0.9 }}>
                <li>Rich feature set (animations, materials, etc.)</li>
                <li>Industry standard format</li>
                <li>Supports complex hierarchies</li>
                <li>Good for character models</li>
                <li>Preserves animation data</li>
              </ul>
            </div>

            <div>
              <h3>⚠️ FBX Challenges</h3>
              <ul style={{ fontSize: "14px", opacity: 0.9 }}>
                <li>Binary format (harder to debug)</li>
                <li>Large file sizes</li>
                <li>Complex material systems</li>
                <li>Scale issues common</li>
                <li>Texture dependency problems</li>
              </ul>
            </div>

            <div>
              <h3>🔧 Common Fixes</h3>
              <ul style={{ fontSize: "14px", opacity: 0.9 }}>
                <li>Auto-scale correction (0.01x or 100x)</li>
                <li>Default material fallbacks</li>
                <li>Black material color fixes</li>
                <li>Missing texture handling</li>
                <li>Bounding box recalculation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h2>🛠️ FBX Troubleshooting Guide</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <h3>🔍 Model Not Visible</h3>
              <ol style={{ fontSize: "13px", opacity: 0.9 }}>
                <li>Check debug log for loading errors</li>
                <li>Try wireframe mode to see geometry</li>
                <li>Check model scale (might be too large/small)</li>
                <li>Verify bounding box is not empty</li>
                <li>Reset camera position</li>
              </ol>
            </div>

            <div>
              <h3>⚫ Model Appears Black</h3>
              <ol style={{ fontSize: "13px", opacity: 0.9 }}>
                <li>Material issues - check debug log</li>
                <li>Missing textures</li>
                <li>Lighting problems</li>
                <li>Try wireframe mode</li>
                <li>Check material color values</li>
              </ol>
            </div>

            <div>
              <h3>📏 Scale Problems</h3>
              <ol style={{ fontSize: "13px", opacity: 0.9 }}>
                <li>Model exported at wrong scale</li>
                <li>Auto-scaling should fix this</li>
                <li>Check debug log for scale corrections</li>
                <li>Use coordinate controls to reposition</li>
                <li>Try zoom to fit function</li>
              </ol>
            </div>

            <div>
              <h3>🚫 Loading Fails</h3>
              <ol style={{ fontSize: "13px", opacity: 0.9 }}>
                <li>Check file URL accessibility</li>
                <li>Verify file is not corrupted</li>
                <li>Check CORS headers</li>
                <li>Try with known working FBX files</li>
                <li>Consider converting to GLTF</li>
              </ol>
            </div>
          </div>
        </div>

        {!customFBXUrl && (
          <div
            style={{
              marginTop: "50px",
              padding: "60px 40px",
              textAlign: "center",
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              border: "2px dashed #333",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
                opacity: 0.6,
              }}
            >
              🎯
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "12px",
                color: "#fff",
              }}
            >
              Select a model above to start testing
            </h3>
            <p
              style={{
                opacity: 0.7,
                fontSize: "1rem",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: "1.5",
              }}
            >
              Choose from the preset models or enter your own FBX URL to begin
              debugging with our comprehensive testing tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestFBX;
