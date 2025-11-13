import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const SimpleThreeDViewer = ({
  fileUrl,
  fileName,
  width = 400,
  height = 300,
  autoRotate = true,
  showControls = true,
  showInfo = true,
  backgroundColor = "#1a1a1a",
  modelScale = 1,
  cameraPosition = [0, 0, 5],
}) => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const [status, setStatus] = useState("Ready to load");
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(autoRotate);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showCoordinatePanel, setShowCoordinatePanel] = useState(false);
  const [currentCameraPos, setCurrentCameraPos] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const lastPosUpdateRef = useRef(0);

  useEffect(() => {
    if (!fileUrl || !mountRef.current) return;

    let scene, camera, renderer, controls;
    let animationId;

    const init = async () => {
      try {
        setStatus("Initializing Three.js...");
        setError(null);

        // Clear previous content
        mountRef.current.innerHTML = "";

        // Basic scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        sceneRef.current = scene;

        // Camera
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        camera.position.set(...cameraPosition);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(backgroundColor);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Enhanced lighting setup for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight1.position.set(100, 100, 100);
        directionalLight1.castShadow = true;
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-100, 100, -100);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight3.position.set(0, -100, 0);
        scene.add(directionalLight3);

        // Enhanced OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = autoRotateEnabled;
        controls.autoRotateSpeed = 2.0;
        controlsRef.current = controls;

        setStatus("Loading 3D model...");

        // Load model with camera reference
        await loadModel(fileUrl, scene, camera, controls);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();

          // Update camera position display (throttled and only if panel is shown)
          if (showCoordinatePanel && camera) {
            const now = performance.now();
            if (now - (lastPosUpdateRef.current || 0) > 200) {
              lastPosUpdateRef.current = now;
              setCurrentCameraPos({
                x: camera.position.x.toFixed(2),
                y: camera.position.y.toFixed(2),
                z: camera.position.z.toFixed(2),
              });
            }
          }

          renderer.render(scene, camera);
        };
        animate();
      } catch (err) {
        console.error("Setup error:", err);
        setError(`Setup failed: ${err.message}`);
        setStatus("Setup failed");
      }
    };

    init();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [fileUrl, autoRotateEnabled, wireframeMode]);

  const loadModel = async (url, scene, camera, controls) => {
    try {
      if (!url) {
        throw new Error("No model URL provided");
      }

      const extension = fileName?.toLowerCase().split(".").pop() || "unknown";
      let loader;

      // Load appropriate loader based on file extension
      switch (extension) {
        case "gltf":
        case "glb":
          const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );
          loader = new GLTFLoader();
          break;
        case "obj":
          const { OBJLoader } = await import(
            "three/examples/jsm/loaders/OBJLoader.js"
          );
          loader = new OBJLoader();
          break;
        case "fbx":
          const { FBXLoader } = await import(
            "three/examples/jsm/loaders/FBXLoader.js"
          );
          loader = new FBXLoader();
          break;
        case "stl":
          const { STLLoader } = await import(
            "three/examples/jsm/loaders/STLLoader.js"
          );
          loader = new STLLoader();
          break;
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }

      // Load the model
      loader.load(
        url,
        (loadedModel) => {
          setStatus("Processing model...");

          // Handle different loader return types
          let model;
          if (extension === "gltf" || extension === "glb") {
            model = loadedModel.scene;
          } else if (extension === "stl") {
            const material = new THREE.MeshLambertMaterial({
              color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
              side: THREE.DoubleSide,
            });
            model = new THREE.Mesh(loadedModel, material);
          } else {
            model = loadedModel;
          }

          // Count meshes and vertices for detailed info first
          let meshCount = 0;
          let vertexCount = 0;
          let faceCount = 0;
          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              meshCount++;
              if (child.geometry.attributes.position) {
                vertexCount += child.geometry.attributes.position.count;
              }
              if (child.geometry.index) {
                faceCount += child.geometry.index.count / 3;
              } else if (child.geometry.attributes.position) {
                faceCount += child.geometry.attributes.position.count / 3;
              }
            }
          });

          // ENHANCED MATERIAL HANDLING - PRESERVE TEXTURES BUT ENSURE VISIBILITY
          let textureCount = 0;
          let materialCount = 0;
          let enhancedCount = 0;
          let preservedCount = 0;

          model.traverse((child) => {
            if (child.isMesh) {
              if (child.material) {
                const materials = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                materialCount += materials.length;

                materials.forEach((material, index) => {
                  // Count textures first
                  if (material.map) textureCount++;
                  if (material.normalMap) textureCount++;
                  if (material.bumpMap) textureCount++;
                  if (material.roughnessMap) textureCount++;
                  if (material.metalnessMap) textureCount++;

                  // Strategy 1: Has textures - preserve and enhance
                  if (material.map || material.normalMap || material.bumpMap) {

                    // Ensure visibility without destroying textures
                    material.transparent = false;
                    material.opacity = 1.0;
                    material.side = THREE.DoubleSide;

                    // Ensure material has proper color for texture visibility
                    if (!material.color) {
                      material.color = new THREE.Color(0xffffff); // White to show texture
                    } else if (
                      material.color.r < 0.2 &&
                      material.color.g < 0.2 &&
                      material.color.b < 0.2
                    ) {
                      // Very dark - lighten to show texture
                      material.color.setRGB(0.8, 0.8, 0.8);
                    }

                    material.needsUpdate = true;
                    preservedCount++;
                  }
                  // Strategy 2: Has color but no texture - enhance color
                  else if (
                    material.color &&
                    material.color.getHex() !== 0x000000
                  ) {

                    material.side = THREE.DoubleSide;
                    material.transparent = false;
                    material.opacity = 1.0;

                    // Brighten dark colors
                    const hsl = {};
                    material.color.getHSL(hsl);
                    if (hsl.l < 0.4) {
                      material.color.setHSL(
                        hsl.h,
                        Math.max(0.6, hsl.s),
                        Math.max(0.5, hsl.l * 1.5)
                      );
                    }
                    material.needsUpdate = true;
                    enhancedCount++;
                  }
                  // Strategy 3: No texture, no color, or black - create visible material
                  else {

                    // Create a bright, visible color
                    material.color = new THREE.Color().setHSL(
                      Math.random(),
                      0.8,
                      0.6
                    );
                    material.side = THREE.DoubleSide;
                    material.transparent = false;
                    material.opacity = 1.0;
                    material.needsUpdate = true;
                    enhancedCount++;
                  }
                });
              } else {
                // No material at all - create one
                child.material = new THREE.MeshLambertMaterial({
                  color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                  side: THREE.DoubleSide,
                });
                enhancedCount++;
              }

              // Ensure geometry exists
              if (child.geometry) {
                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
              }
            }
          });

          // Material enhancement summary (silenced in production)

          // STANDARDIZED AUTO-SCALING - All models same relative size
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          // Apply model scale
          if (modelScale !== 1) {
            model.scale.setScalar(modelScale);
          } else {
            // CONSISTENT SCALING - Target size of 5 units for all models
            const targetSize = 5;
            const scaleFactor = targetSize / maxDim;
            model.scale.setScalar(scaleFactor);
            // Autoscaled to target size
          }

          // Center the model
          model.position.sub(center);
          scene.add(model);

          // Position camera to see the model
          const newBox = new THREE.Box3().setFromObject(model);
          const newSize = newBox.getSize(new THREE.Vector3());
          const boundingSphere = new THREE.Sphere();
          newBox.getBoundingSphere(boundingSphere);

          const sphereRadius = boundingSphere.radius;
          const distance = sphereRadius * 3;

          // Set camera position
          camera.position.set(distance * 0.7, distance * 0.7, distance * 0.7);
          camera.lookAt(boundingSphere.center);
          controls.target.copy(boundingSphere.center);
          controls.update();

          // Configure controls
          controls.minDistance = sphereRadius * 0.5;
          controls.maxDistance = sphereRadius * 10;

          // Store model info
          setModelInfo({
            meshes: meshCount,
            vertices: vertexCount,
            faces: Math.round(faceCount),
            dimensions: {
              width: newSize.x.toFixed(3),
              height: newSize.y.toFixed(3),
              depth: newSize.z.toFixed(3),
            },
            format: extension.toUpperCase(),
            boundingSphere: sphereRadius.toFixed(3),
          });

          setStatus(
            `Model loaded! ${meshCount} meshes, ${vertexCount} vertices, ${Math.round(
              faceCount
            )} faces`
          );
        },
        (progress) => {
          const percent = ((progress.loaded / progress.total) * 100).toFixed(1);
          setStatus(`Loading: ${percent}%`);
        },
        (error) => {
          console.error("Model loading error:", error);
          setError(`Failed to load: ${error.message}`);
          setStatus("Load failed");
        }
      );
    } catch (err) {
      console.error("Error loading 3D model:", err);
      setError(
        `Failed to load ${extension?.toUpperCase() || "unknown"} file: ${
          err.message
        }`
      );
      setStatus("Load failed");
    }
  };

  // Control functions
  const toggleAutoRotate = () => {
    setAutoRotateEnabled(!autoRotateEnabled);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotateEnabled;
    }
  };

  const toggleWireframe = () => {
    setWireframeMode(!wireframeMode);
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = !wireframeMode;
        }
      });
    }
  };

  const resetCamera = () => {
    if (controlsRef.current && modelInfo) {
      const camera = controlsRef.current.object;
      const center = new THREE.Vector3(0, 0, 0);
      const distance = parseFloat(modelInfo.boundingSphere) * 3;

      camera.position.set(distance * 0.7, distance * 0.7, distance * 0.7);
      camera.lookAt(center);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  };

  const toggleCoordinatePanel = () => {
    setShowCoordinatePanel(!showCoordinatePanel);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Main viewer container */}
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          border: "2px solid #4ecdc4",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: backgroundColor,
        }}
      >
        <div
          ref={mountRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {/* Loading overlay */}
        {status !== "Model loaded!" && status.includes("Loading") && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4ecdc4",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {status}
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff6b6b",
              fontSize: "12px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Control buttons */}
        {showControls && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <button
              onClick={toggleAutoRotate}
              style={{
                padding: "5px 8px",
                backgroundColor: autoRotateEnabled
                  ? "#4ecdc4"
                  : "rgba(0,0,0,0.7)",
                color: autoRotateEnabled ? "#000" : "#fff",
                border: "1px solid #4ecdc4",
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
                minWidth: "60px",
              }}
              title="Toggle Auto Rotate"
            >
              🔄 {autoRotateEnabled ? "ON" : "OFF"}
            </button>

            <button
              onClick={toggleWireframe}
              style={{
                padding: "5px 8px",
                backgroundColor: wireframeMode ? "#ffa500" : "rgba(0,0,0,0.7)",
                color: wireframeMode ? "#000" : "#fff",
                border: "1px solid #ffa500",
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
                minWidth: "60px",
              }}
              title="Toggle Wireframe"
            >
              📐 {wireframeMode ? "ON" : "OFF"}
            </button>

            <button
              onClick={resetCamera}
              style={{
                padding: "5px 8px",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "1px solid #666",
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
                minWidth: "60px",
              }}
              title="Reset Camera"
            >
              📷 Reset
            </button>

            <button
              onClick={toggleCoordinatePanel}
              style={{
                padding: "5px 8px",
                backgroundColor: showCoordinatePanel
                  ? "#ff69b4"
                  : "rgba(0,0,0,0.7)",
                color: showCoordinatePanel ? "#000" : "#fff",
                border: "1px solid #ff69b4",
                borderRadius: "4px",
                fontSize: "10px",
                cursor: "pointer",
                minWidth: "60px",
              }}
              title="Show Coordinates"
            >
              📍 {showCoordinatePanel ? "ON" : "OFF"}
            </button>
          </div>
        )}

        {/* Status indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            padding: "4px 8px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: error ? "#ff6b6b" : "#4ecdc4",
            borderRadius: "4px",
            fontSize: "10px",
            maxWidth: "200px",
          }}
        >
          {fileName} • {status}
        </div>

        {/* Camera position display */}
        {showCoordinatePanel && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              padding: "8px",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "10px",
              border: "1px solid #ff69b4",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              📍 Camera Position
            </div>
            <div>X: {currentCameraPos.x}</div>
            <div>Y: {currentCameraPos.y}</div>
            <div>Z: {currentCameraPos.z}</div>
          </div>
        )}
      </div>

      {/* Model Information - Optional */}
      {showInfo && modelInfo && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
            fontSize: "11px",
            border: "1px solid #4ecdc4",
            maxWidth: `${width}px`,
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#4ecdc4",
            }}
          >
            📐 Model Analysis
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
              fontSize: "10px",
            }}
          >
            <div>
              <div style={{ color: "#ffa500", fontWeight: "bold" }}>
                📏 Size
              </div>
              <div>
                {modelInfo.dimensions.width} × {modelInfo.dimensions.height} ×{" "}
                {modelInfo.dimensions.depth}
              </div>
              <div>{modelInfo.meshes} meshes</div>
              <div>{modelInfo.vertices.toLocaleString()} vertices</div>
            </div>
            <div>
              <div style={{ color: "#00ffff", fontWeight: "bold" }}>
                🔧 Format
              </div>
              <div>Type: {modelInfo.format}</div>
              <div>File: {fileName}</div>
              <div>Sphere: {modelInfo.boundingSphere}</div>
            </div>
            <div>
              <div style={{ color: "#ff69b4", fontWeight: "bold" }}>
                📷 Camera
              </div>
              <div>
                Position: {currentCameraPos.x}, {currentCameraPos.y},{" "}
                {currentCameraPos.z}
              </div>
              <div>Auto-rotate: {autoRotateEnabled ? "ON" : "OFF"}</div>
              <div>Wireframe: {wireframeMode ? "ON" : "OFF"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls help */}
      <div
        style={{
          marginTop: "5px",
          fontSize: "10px",
          opacity: 0.7,
          maxWidth: `${width}px`,
          color: "#999",
        }}
      >
        • Drag to rotate • Scroll to zoom • Enhanced 3D viewer with full format
        support
      </div>
    </div>
  );
};

export default SimpleThreeDViewer;
