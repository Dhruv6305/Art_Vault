import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const SimpleFBXViewer = ({
  fileUrl,
  fileName,
  width = 800,
  height = 300,
  showControls = true,
  showInfo = true,
  autoRotate = false,
  backgroundColor = "#222222",
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
        camera.position.set(50, 50, 50);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(backgroundColor);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting - VERY bright setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight1.position.set(100, 100, 100);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight2.position.set(-100, 100, -100);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight3.position.set(0, -100, 0);
        scene.add(directionalLight3);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = autoRotateEnabled;
        controls.autoRotateSpeed = 2.0;
        controlsRef.current = controls;

        setStatus("Loading FBX file...");

        // Load FBX with enhanced texture support
        const { FBXLoader } = await import(
          "three/examples/jsm/loaders/FBXLoader.js"
        );
        const loader = new FBXLoader();

        // Add texture loading manager for better texture handling
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onLoad = () => {
          console.log("All textures loaded successfully");
        };
        loadingManager.onError = (url) => {
          console.warn("Failed to load texture:", url);
        };
        loader.manager = loadingManager;

        loader.load(
          fileUrl,
          (fbxModel) => {
            setStatus("Processing model...");

            // Count meshes and vertices for detailed info first
            let meshCount = 0;
            let vertexCount = 0;
            let faceCount = 0;
            fbxModel.traverse((child) => {
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
            console.log("🎨 Analyzing and enhancing model materials...");
            let textureCount = 0;
            let materialCount = 0;
            let enhancedCount = 0;
            let preservedCount = 0;

            fbxModel.traverse((child) => {
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
                    if (
                      material.map ||
                      material.normalMap ||
                      material.bumpMap
                    ) {
                      console.log(
                        "✅ Preserving textured material:",
                        material.name || "unnamed"
                      );

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
                        console.log("🔆 Lightened dark textured material");
                      }

                      material.needsUpdate = true;
                      preservedCount++;
                    }
                    // Strategy 2: Has color but no texture - enhance color
                    else if (
                      material.color &&
                      material.color.getHex() !== 0x000000
                    ) {
                      console.log(
                        "🎨 Enhancing colored material:",
                        material.name || "unnamed"
                      );

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
                      console.log(
                        "⚠️ Creating visible material for:",
                        material.name || "unnamed"
                      );

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
                  console.log("🆕 Creating material for mesh without material");
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

            console.log(
              `🎯 Material enhancement complete: ${materialCount} materials, ${textureCount} textures, ${preservedCount} preserved, ${enhancedCount} enhanced`
            );

            // STANDARDIZED AUTO-SCALING - All models same relative size
            const box = new THREE.Box3().setFromObject(fbxModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // CONSISTENT SCALING - Target size of 5 units for all models
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 5;
            const scaleFactor = targetSize / maxDim;
            fbxModel.scale.setScalar(scaleFactor);
            console.log(
              `📏 Auto-scaled FBX model: ${maxDim.toFixed(
                2
              )} → ${targetSize} (scale: ${scaleFactor.toFixed(3)})`
            );

            // Center the model
            fbxModel.position.sub(center);

            // Add to scene
            scene.add(fbxModel);

            // Position camera to see the model
            const newBox = new THREE.Box3().setFromObject(fbxModel);
            const newSize = newBox.getSize(new THREE.Vector3());
            const newMaxDim = Math.max(newSize.x, newSize.y, newSize.z);

            // Calculate optimal camera position using sphere fitting and FOV
            const boundingSphere = new THREE.Sphere();
            newBox.getBoundingSphere(boundingSphere);

            // Create adaptive reference geometry based on model characteristics
            const sphereRadius = boundingSphere.radius;
            const modelComplexity = Math.min(meshCount / 10, 3); // Complexity factor 0-3
            const sizeCategory =
              maxDim > 50 ? "large" : maxDim > 10 ? "medium" : "small";

            // Adaptive reference sphere sizing based on model properties
            let refSphereMultiplier = 1.2; // Base 20% larger
            if (sizeCategory === "large") refSphereMultiplier = 1.15; // Tighter for large models
            if (sizeCategory === "small") refSphereMultiplier = 1.3; // More space for small models
            if (modelComplexity > 2) refSphereMultiplier += 0.1; // Extra space for complex models

            const refSphereRadius = sphereRadius * refSphereMultiplier;

            // Create enhanced reference sphere with adaptive opacity
            const refSphereGeometry = new THREE.SphereGeometry(
              refSphereRadius,
              Math.max(16, Math.min(32, meshCount * 2)), // Adaptive detail
              Math.max(12, Math.min(24, meshCount * 1.5))
            );
            const refSphereMaterial = new THREE.MeshBasicMaterial({
              color: 0x00ffff,
              wireframe: true,
              transparent: true,
              opacity: Math.max(
                0.15,
                Math.min(0.3, 0.2 + modelComplexity * 0.05)
              ), // Adaptive opacity
              side: THREE.DoubleSide,
            });
            const refSphere = new THREE.Mesh(
              refSphereGeometry,
              refSphereMaterial
            );
            refSphere.position.copy(boundingSphere.center);
            scene.add(refSphere);

            // Create adaptive reference grid
            const gridSize = refSphereRadius * (2.0 + modelComplexity * 0.2); // Larger grid for complex models
            const gridDivisions = Math.max(
              8,
              Math.min(20, Math.round(gridSize / 2))
            ); // Adaptive divisions
            const gridHelper = new THREE.GridHelper(
              gridSize,
              gridDivisions,
              0x444444,
              0x222222
            );
            gridHelper.position.copy(boundingSphere.center);
            gridHelper.position.y = newBox.min.y - sphereRadius * 0.08; // Slightly below model
            scene.add(gridHelper);

            // Add reference axes for orientation (subtle)
            const axesHelper = new THREE.AxesHelper(refSphereRadius * 0.8);
            axesHelper.position.copy(boundingSphere.center);
            scene.add(axesHelper);

            // Advanced camera positioning using reference geometry and model analysis
            const fov = camera.fov * (Math.PI / 180); // Convert to radians

            // Calculate base distance using reference sphere and FOV mathematics
            const baseDistance = (refSphereRadius * 2.1) / Math.tan(fov / 2);

            // Apply adaptive multipliers based on model characteristics
            let distanceMultiplier = 1.5; // Base comfortable viewing distance

            // Adjust for model size category
            if (sizeCategory === "large") distanceMultiplier = 1.3; // Closer for large models
            if (sizeCategory === "small") distanceMultiplier = 1.8; // Further for small models

            // Adjust for model complexity (more complex = need more viewing distance)
            distanceMultiplier += modelComplexity * 0.15;

            // Adjust for aspect ratio (tall/wide models need different distances)
            const aspectRatio = Math.max(newSize.x, newSize.z) / newSize.y;
            if (aspectRatio > 2) distanceMultiplier += 0.2; // Wide models need more distance
            if (aspectRatio < 0.5) distanceMultiplier += 0.3; // Tall models need more distance

            const cameraDistance = baseDistance * distanceMultiplier;

            // Set adaptive bounds relative to reference geometry
            const minDistance = refSphereRadius * (0.8 + modelComplexity * 0.1);
            const maxDistance = refSphereRadius * (6 + modelComplexity * 1.5);
            const finalDistance = Math.max(
              minDistance,
              Math.min(cameraDistance, maxDistance)
            );

            // Calculate optimal viewing angles based on model dimensions
            let elevation = Math.PI / 6; // Default 30 degrees
            let azimuth = Math.PI / 4; // Default 45 degrees

            // Adjust elevation for model height
            if (newSize.y > Math.max(newSize.x, newSize.z) * 1.5) {
              elevation = Math.PI / 4; // Higher angle for tall models
            } else if (newSize.y < Math.max(newSize.x, newSize.z) * 0.5) {
              elevation = Math.PI / 8; // Lower angle for flat models
            }

            // Adjust azimuth for model width/depth ratio
            if (newSize.x > newSize.z * 1.5) {
              azimuth = Math.PI / 3; // Better angle for wide models
            } else if (newSize.z > newSize.x * 1.5) {
              azimuth = Math.PI / 6; // Better angle for deep models
            }

            // Calculate final camera position using spherical coordinates
            const cameraX =
              boundingSphere.center.x +
              finalDistance * Math.sin(elevation) * Math.cos(azimuth);
            const cameraY =
              boundingSphere.center.y + finalDistance * Math.cos(elevation);
            const cameraZ =
              boundingSphere.center.z +
              finalDistance * Math.sin(elevation) * Math.sin(azimuth);

            // Set camera position and target
            camera.position.set(cameraX, cameraY, cameraZ);
            camera.lookAt(boundingSphere.center);
            controls.target.copy(boundingSphere.center);
            controls.update();

            // Configure adaptive controls based on reference geometry and model properties
            controls.minDistance =
              refSphereRadius * (0.5 + modelComplexity * 0.1);
            controls.maxDistance = refSphereRadius * (8 + modelComplexity * 2);

            // Adaptive control sensitivity based on model size
            controls.rotateSpeed =
              sizeCategory === "small"
                ? 1.2
                : sizeCategory === "large"
                ? 0.8
                : 1.0;
            controls.zoomSpeed =
              sizeCategory === "small"
                ? 1.3
                : sizeCategory === "large"
                ? 0.7
                : 1.0;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            // Calculate volume and surface area estimates
            const volume = newSize.x * newSize.y * newSize.z;
            const surfaceArea =
              2 *
              (newSize.x * newSize.y +
                newSize.y * newSize.z +
                newSize.z * newSize.x);

            // Store comprehensive model information
            const detailedInfo = {
              dimensions: {
                width: newSize.x.toFixed(3),
                height: newSize.y.toFixed(3),
                depth: newSize.z.toFixed(3),
                maxDimension: newMaxDim.toFixed(3),
                diagonal: Math.sqrt(
                  newSize.x * newSize.x +
                    newSize.y * newSize.y +
                    newSize.z * newSize.z
                ).toFixed(3),
              },
              geometry: {
                meshes: meshCount,
                vertices: vertexCount,
                faces: Math.round(faceCount),
                volume: volume.toFixed(3),
                surfaceArea: surfaceArea.toFixed(3),
              },
              boundingBox: {
                min: `(${newBox.min.x.toFixed(2)}, ${newBox.min.y.toFixed(
                  2
                )}, ${newBox.min.z.toFixed(2)})`,
                max: `(${newBox.max.x.toFixed(2)}, ${newBox.max.y.toFixed(
                  2
                )}, ${newBox.max.z.toFixed(2)})`,
                center: `(${center.x.toFixed(2)}, ${center.y.toFixed(
                  2
                )}, ${center.z.toFixed(2)})`,
              },
              referenceGeometry: {
                modelSphereRadius: sphereRadius.toFixed(3),
                refSphereRadius: refSphereRadius.toFixed(3),
                refMultiplier: refSphereMultiplier.toFixed(2),
                gridSize: gridSize.toFixed(3),
                gridDivisions: gridDivisions,
                baseDistance: baseDistance.toFixed(3),
                finalDistance: finalDistance.toFixed(3),
                distanceMultiplier: distanceMultiplier.toFixed(2),
              },
              modelAnalysis: {
                sizeCategory: sizeCategory,
                complexity: modelComplexity.toFixed(1),
                aspectRatio: aspectRatio.toFixed(2),
                elevationAngle: ((elevation * 180) / Math.PI).toFixed(1) + "°",
                azimuthAngle: ((azimuth * 180) / Math.PI).toFixed(1) + "°",
              },
              camera: {
                position: `(${cameraX.toFixed(2)}, ${cameraY.toFixed(
                  2
                )}, ${cameraZ.toFixed(2)})`,
                target: `(${boundingSphere.center.x.toFixed(
                  2
                )}, ${boundingSphere.center.y.toFixed(
                  2
                )}, ${boundingSphere.center.z.toFixed(2)})`,
                distanceFromRef:
                  (finalDistance / refSphereRadius).toFixed(2) + "x ref radius",
              },
            };

            setModelInfo(detailedInfo);
            setStatus(
              `Model loaded! ${meshCount} meshes, ${vertexCount} vertices, ${Math.round(
                faceCount
              )} faces`
            );
          },
          (progress) => {
            const percent = ((progress.loaded / progress.total) * 100).toFixed(
              1
            );
            setStatus(`Loading: ${percent}%`);
          },
          (error) => {
            console.error("FBX loading error:", error);
            setError(`Failed to load: ${error.message}`);
            setStatus("Load failed");
          }
        );

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();

          // Update camera position display
          if (camera) {
            setCurrentCameraPos({
              x: camera.position.x.toFixed(2),
              y: camera.position.y.toFixed(2),
              z: camera.position.z.toFixed(2),
            });
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

  // Control functions
  const toggleAutoRotate = () => {
    setAutoRotateEnabled(!autoRotateEnabled);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotateEnabled;
    }
  };

  const toggleWireframe = () => {
    setWireframeMode(!wireframeMode);
    // Apply wireframe to all materials in the scene
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
      const center = new THREE.Vector3(0, 0, 0); // Model is centered at origin
      const distance = parseFloat(modelInfo.referenceGeometry.finalDistance);

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

      {/* Detailed Model Information - Optional */}
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
              <div>{modelInfo.geometry.meshes} meshes</div>
              <div>{modelInfo.geometry.vertices.toLocaleString()} vertices</div>
            </div>
            <div>
              <div style={{ color: "#00ffff", fontWeight: "bold" }}>
                🔵 Reference
              </div>
              <div>Sphere: {modelInfo.referenceGeometry.refSphereRadius}</div>
              <div>Grid: {modelInfo.referenceGeometry.gridSize}</div>
              <div>Category: {modelInfo.modelAnalysis.sizeCategory}</div>
            </div>
            <div>
              <div style={{ color: "#ff69b4", fontWeight: "bold" }}>
                📷 Camera
              </div>
              <div>Distance: {modelInfo.camera.distanceFromRef}</div>
              <div>Elevation: {modelInfo.modelAnalysis.elevationAngle}</div>
              <div>Azimuth: {modelInfo.modelAnalysis.azimuthAngle}</div>
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
        • Drag to rotate • Scroll to zoom • Bright colors for visibility
      </div>
    </div>
  );
};

export default SimpleFBXViewer;
