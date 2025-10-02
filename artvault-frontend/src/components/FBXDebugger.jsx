import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const FBXDebugger = ({ fileUrl, fileName }) => {
  const mountRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [showBounds, setShowBounds] = useState(false);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  const addDebugLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => [
      ...prev,
      {
        message,
        type,
        timestamp,
        id: Date.now() + Math.random(),
      },
    ]);
    console.log(`[FBX Debug ${timestamp}] ${message}`);
  };

  const testFBXLoading = async () => {
    if (!fileUrl) {
      addDebugLog("No file URL provided", "error");
      return;
    }

    setLoading(true);
    setError(null);
    setDebugInfo([]);

    addDebugLog(`Starting FBX debug test for: ${fileName}`, "info");
    addDebugLog(`File URL: ${fileUrl}`, "info");

    try {
      // Clear previous scene
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }

      // Setup basic Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x222222);

      const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(400, 300);
      renderer.setClearColor(0x222222);

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      addDebugLog("Basic scene setup complete", "success");

      // Test file accessibility
      addDebugLog("Testing file accessibility...", "info");

      try {
        const response = await fetch(fileUrl, { method: "HEAD" });
        addDebugLog(
          `File response status: ${response.status}`,
          response.ok ? "success" : "error"
        );
        addDebugLog(
          `File content-type: ${response.headers.get("content-type")}`,
          "info"
        );
        addDebugLog(
          `File size: ${response.headers.get("content-length")} bytes`,
          "info"
        );
      } catch (fetchError) {
        addDebugLog(
          `File accessibility test failed: ${fetchError.message}`,
          "error"
        );
      }

      // Import FBX loader
      addDebugLog("Importing FBX loader...", "info");
      const { FBXLoader } = await import(
        "three/examples/jsm/loaders/FBXLoader.js"
      );

      // Create loading manager with detailed logging
      const manager = new THREE.LoadingManager();

      manager.onStart = (url, itemsLoaded, itemsTotal) => {
        addDebugLog(
          `Loading started: ${itemsLoaded}/${itemsTotal} items`,
          "info"
        );
      };

      manager.onLoad = () => {
        addDebugLog("All resources loaded successfully!", "success");
      };

      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        addDebugLog(
          `Loading progress: ${itemsLoaded}/${itemsTotal} - ${url}`,
          "info"
        );
      };

      manager.onError = (url) => {
        addDebugLog(`Resource loading failed: ${url}`, "error");
      };

      const loader = new FBXLoader(manager);
      addDebugLog("FBX loader created with manager", "success");

      // Load the FBX model
      addDebugLog("Starting FBX model loading...", "info");

      loader.load(
        fileUrl,
        (fbxModel) => {
          try {
            addDebugLog("FBX model loaded successfully!", "success");

            // Analyze the loaded model
            addDebugLog(`Model type: ${fbxModel.type}`, "info");
            addDebugLog(`Children count: ${fbxModel.children.length}`, "info");
            addDebugLog(
              `Has animations: ${fbxModel.animations?.length || 0}`,
              "info"
            );

            // Check model scale
            addDebugLog(
              `Original scale: (${fbxModel.scale.x}, ${fbxModel.scale.y}, ${fbxModel.scale.z})`,
              "info"
            );

            // Check bounding box
            const box = new THREE.Box3().setFromObject(fbxModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            addDebugLog(
              `Bounding box size: (${size.x.toFixed(2)}, ${size.y.toFixed(
                2
              )}, ${size.z.toFixed(2)})`,
              "info"
            );
            addDebugLog(
              `Bounding box center: (${center.x.toFixed(2)}, ${center.y.toFixed(
                2
              )}, ${center.z.toFixed(2)})`,
              "info"
            );

            if (box.isEmpty()) {
              addDebugLog("WARNING: Model has empty bounding box!", "error");
            }

            // Analyze materials and meshes
            let meshCount = 0;
            let materialCount = 0;

            fbxModel.traverse((child) => {
              if (child.isMesh) {
                meshCount++;
                addDebugLog(
                  `Mesh ${meshCount}: ${child.name || "Unnamed"}`,
                  "info"
                );

                if (child.material) {
                  materialCount++;
                  const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];

                  materials.forEach((mat, idx) => {
                    addDebugLog(
                      `  Material ${idx}: ${mat.type} - Color: #${
                        mat.color?.getHexString() || "none"
                      }`,
                      "info"
                    );
                    if (mat.map) {
                      addDebugLog(
                        `  Has texture map: ${mat.map.image ? "Yes" : "No"}`,
                        mat.map.image ? "success" : "warning"
                      );
                    }
                  });
                } else {
                  addDebugLog(
                    `  No material assigned to mesh ${meshCount}`,
                    "warning"
                  );
                }
              }
            });

            addDebugLog(`Total meshes found: ${meshCount}`, "info");
            addDebugLog(`Total materials found: ${materialCount}`, "info");

            // Apply fixes for common FBX issues
            if (size.x > 100 || size.y > 100 || size.z > 100) {
              fbxModel.scale.setScalar(0.01);
              addDebugLog(
                "Applied scale fix: Model was too large, scaled down by 0.01",
                "warning"
              );
            } else if (size.x < 0.01 || size.y < 0.01 || size.z < 0.01) {
              fbxModel.scale.setScalar(100);
              addDebugLog(
                "Applied scale fix: Model was too small, scaled up by 100",
                "warning"
              );
            }

            // Enhanced material fixes
            let materialFixCount = 0;
            fbxModel.traverse((child) => {
              if (child.isMesh) {
                if (!child.material) {
                  child.material = new THREE.MeshPhongMaterial({
                    color: 0x00ff00, // Bright green for visibility
                    side: THREE.DoubleSide,
                  });
                  materialFixCount++;
                  addDebugLog(
                    `Applied bright green material to mesh ${
                      child.name || "unnamed"
                    }`,
                    "warning"
                  );
                } else {
                  const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];
                  materials.forEach((mat, idx) => {
                    // Make materials more visible
                    if (mat.color) {
                      const originalColor = mat.color.getHex();
                      if (originalColor === 0x000000) {
                        mat.color.setHex(0xff0000); // Red for black materials
                        materialFixCount++;
                        addDebugLog(
                          `Fixed black material to red on ${
                            child.name || "unnamed"
                          }`,
                          "warning"
                        );
                      } else if (
                        mat.color.r < 0.1 &&
                        mat.color.g < 0.1 &&
                        mat.color.b < 0.1
                      ) {
                        mat.color.setHex(0x0000ff); // Blue for very dark materials
                        materialFixCount++;
                        addDebugLog(
                          `Brightened dark material to blue on ${
                            child.name || "unnamed"
                          }`,
                          "warning"
                        );
                      }
                    }

                    // Ensure materials are visible
                    mat.side = THREE.DoubleSide;
                    if (mat.transparent) {
                      mat.opacity = Math.max(mat.opacity, 0.8);
                    }

                    // Remove any problematic properties
                    if (mat.envMap) {
                      mat.envMap = null;
                      addDebugLog(
                        `Removed environment map from material`,
                        "info"
                      );
                    }
                  });
                }
              }
            });

            addDebugLog(
              `Applied ${materialFixCount} material visibility fixes`,
              materialFixCount > 0 ? "warning" : "success"
            );

            // Center the model
            const newBox = new THREE.Box3().setFromObject(fbxModel);
            const newCenter = newBox.getCenter(new THREE.Vector3());
            fbxModel.position.sub(newCenter);

            // Add to scene
            scene.add(fbxModel);
            addDebugLog("Model added to scene", "success");

            // Store references
            sceneRef.current = scene;
            modelRef.current = fbxModel;
            rendererRef.current = renderer;
            cameraRef.current = camera;

            // Position camera with multiple fallback strategies
            const finalBox = new THREE.Box3().setFromObject(fbxModel);
            const finalSize = finalBox.getSize(new THREE.Vector3());
            const finalCenter = finalBox.getCenter(new THREE.Vector3());
            const maxDim = Math.max(finalSize.x, finalSize.y, finalSize.z);

            let distance = maxDim * 3;
            if (distance < 1) distance = 10; // Minimum distance
            if (distance > 1000) distance = 100; // Maximum distance

            // Try multiple camera positions
            const positions = [
              [distance, distance, distance],
              [0, 0, distance],
              [distance, 0, 0],
              [0, distance, 0],
              [-distance, distance, distance],
            ];

            camera.position.set(...positions[0]);
            camera.lookAt(finalCenter);

            addDebugLog(
              `Camera positioned at: (${camera.position.x.toFixed(
                2
              )}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(
                2
              )})`,
              "info"
            );
            addDebugLog(
              `Looking at center: (${finalCenter.x.toFixed(
                2
              )}, ${finalCenter.y.toFixed(2)}, ${finalCenter.z.toFixed(2)})`,
              "info"
            );

            // Add dynamic bounding box helper for debugging
            const boxHelper = new THREE.Box3Helper(finalBox, 0xffff00);
            // Make box helper line width dynamic based on model size
            if (boxHelper.material && maxDim > 0) {
              boxHelper.material.linewidth = Math.max(
                1,
                Math.min(5, maxDim / 10)
              );
            }
            scene.add(boxHelper);

            // Add coordinate axes scaled to model size
            const axesSize = maxDim * 0.5;
            const axesHelper = new THREE.AxesHelper(axesSize);
            scene.add(axesHelper);

            addDebugLog(
              `Added dynamic bounding box helper - Size: ${finalSize.x.toFixed(
                2
              )} × ${finalSize.y.toFixed(2)} × ${finalSize.z.toFixed(2)}`,
              "info"
            );
            addDebugLog(
              `Added coordinate axes - Size: ${axesSize.toFixed(2)}`,
              "info"
            );

            // Setup controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            // Render loop
            const animate = () => {
              requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();

            addDebugLog(
              "Rendering started - Model should be visible now!",
              "success"
            );
          } catch (processError) {
            addDebugLog(
              `Error processing FBX model: ${processError.message}`,
              "error"
            );
            setError(`Processing failed: ${processError.message}`);
          }
        },
        (progress) => {
          const percent = ((progress.loaded / progress.total) * 100).toFixed(1);
          addDebugLog(`Loading progress: ${percent}%`, "info");
        },
        (loadError) => {
          addDebugLog(`FBX loading failed: ${loadError.message}`, "error");
          setError(`Loading failed: ${loadError.message}`);
        }
      );
    } catch (error) {
      addDebugLog(`Setup error: ${error.message}`, "error");
      setError(`Setup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleWireframe = () => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.wireframe = !wireframe;
          });
        }
      });
      setWireframe(!wireframe);
      addDebugLog(`Wireframe mode: ${!wireframe ? "ON" : "OFF"}`, "info");
    }
  };

  const resetCamera = () => {
    if (cameraRef.current && modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 4;

      cameraRef.current.position.set(distance, distance, distance);
      cameraRef.current.lookAt(center);
      addDebugLog("Camera reset to default position", "info");
    }
  };

  const forceVisibility = () => {
    if (modelRef.current && sceneRef.current) {
      // Apply extreme visibility fixes
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          // Force bright material
          child.material = new THREE.MeshBasicMaterial({
            color: 0xff00ff, // Bright magenta
            side: THREE.DoubleSide,
            wireframe: false,
          });
        }
      });

      // Add bright lighting
      const brightLight = new THREE.DirectionalLight(0xffffff, 2);
      brightLight.position.set(0, 10, 10);
      sceneRef.current.add(brightLight);

      addDebugLog(
        "Applied EXTREME visibility fixes - model should be bright magenta!",
        "warning"
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "white",
        borderRadius: "8px",
        margin: "20px 0",
      }}
    >
      <h3>🔧 FBX Debug Tool</h3>

      <div style={{ marginBottom: "20px" }}>
        <div>
          <strong>File:</strong> {fileName}
        </div>
        <div style={{ wordBreak: "break-all", fontSize: "12px", opacity: 0.8 }}>
          <strong>URL:</strong> {fileUrl}
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={testFBXLoading}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#666" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "🔄 Testing..." : "🧪 Test FBX Loading"}
        </button>

        <button
          onClick={toggleWireframe}
          disabled={!modelRef.current}
          style={{
            padding: "10px 15px",
            backgroundColor: wireframe ? "#ff6b6b" : "#4ecdc4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: modelRef.current ? "pointer" : "not-allowed",
          }}
        >
          📐 {wireframe ? "Solid" : "Wire"}
        </button>

        <button
          onClick={resetCamera}
          disabled={!cameraRef.current}
          style={{
            padding: "10px 15px",
            backgroundColor: "#ffa500",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: cameraRef.current ? "pointer" : "not-allowed",
          }}
        >
          📷 Reset Cam
        </button>

        <button
          onClick={forceVisibility}
          disabled={!modelRef.current}
          style={{
            padding: "10px 15px",
            backgroundColor: "#ff00ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: modelRef.current ? "pointer" : "not-allowed",
          }}
        >
          🔆 Force Visible
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 3D Viewer */}
        <div>
          <h4>3D Viewer</h4>
          <div
            ref={mountRef}
            style={{
              width: "400px",
              height: "300px",
              border: "1px solid #333",
              borderRadius: "4px",
              backgroundColor: "#222",
            }}
          />
        </div>

        {/* Debug Log */}
        <div style={{ flex: 1 }}>
          <h4>Debug Log</h4>
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              backgroundColor: "#000",
              border: "1px solid #333",
              borderRadius: "4px",
              padding: "10px",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {debugInfo.map((log) => (
              <div
                key={log.id}
                style={{
                  color:
                    log.type === "error"
                      ? "#ff6b6b"
                      : log.type === "warning"
                      ? "#ffa500"
                      : log.type === "success"
                      ? "#4ecdc4"
                      : "#fff",
                  marginBottom: "4px",
                }}
              >
                <span style={{ opacity: 0.6 }}>[{log.timestamp}]</span>{" "}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#dc3545",
            borderRadius: "4px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FBXDebugger;
