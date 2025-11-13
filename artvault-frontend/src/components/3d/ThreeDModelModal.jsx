import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeDModelModal = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  artworkTitle,
  artworkArtist,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);

  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isOpen || !mountRef.current || !fileUrl) return;

    let cleanupFn = null;

    const timer = setTimeout(async () => {
      cleanupFn = await initScene();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanupFn) cleanupFn();
    };
  }, [isOpen, fileUrl]);

  const initScene = async () => {
    if (!mountRef.current) return;

    try {
      mountRef.current.innerHTML = "";

      const container = mountRef.current.parentElement;
      const width = container?.clientWidth || window.innerWidth;
      const height = container?.clientHeight || window.innerHeight - 120;

      console.log("Initializing canvas:", width, "x", height);

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#1a1a1a");
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
      camera.position.set(5, 5, 5);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Make canvas fill container completely
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      canvas.addEventListener("contextmenu", (e) => e.preventDefault());
      mountRef.current.appendChild(canvas);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
      light1.position.set(100, 100, 100);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
      light2.position.set(-100, 100, -100);
      scene.add(light2);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 2.0;
      controls.enablePan = true;
      controlsRef.current = controls;

      // Load model
      await loadModel(scene, camera, controls);

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize handler
      const handleResize = () => {
        if (!mountRef.current?.parentElement) return;
        const container = mountRef.current.parentElement;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        console.log("Resizing to:", newWidth, "x", newHeight);

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight, false);
      };

      window.addEventListener("resize", handleResize);

      // Return cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationIdRef.current)
          cancelAnimationFrame(animationIdRef.current);
        if (renderer) renderer.dispose();
        if (mountRef.current) mountRef.current.innerHTML = "";
      };
    } catch (err) {
      console.error("Scene init error:", err);
      setError(`Failed to initialize: ${err.message}`);
    }
  };

  // Load 3D model
  const loadModel = async (scene, camera, controls) => {
    try {
      setStatus("Loading model...");
      setError(null);

      const extension = fileName?.toLowerCase().split(".").pop() || "glb";
      let loader;

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
          throw new Error(`Unsupported format: ${extension}`);
      }

      return new Promise((resolve, reject) => {
        loader.load(
          fileUrl,
          (loadedData) => {
            let model;

            if (extension === "gltf" || extension === "glb") {
              model = loadedData.scene;
            } else if (extension === "stl") {
              const material = new THREE.MeshLambertMaterial({
                color: 0x00ff00,
                side: THREE.DoubleSide,
              });
              model = new THREE.Mesh(loadedData, material);
            } else {
              model = loadedData;
            }

            // Enhance materials
            model.traverse((child) => {
              if (child.isMesh) {
                if (child.material) {
                  const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];
                  materials.forEach((mat) => {
                    mat.side = THREE.DoubleSide;
                    if (!mat.color || mat.color.getHex() === 0x000000) {
                      mat.color = new THREE.Color().setHSL(
                        Math.random(),
                        0.7,
                        0.6
                      );
                    }
                    mat.needsUpdate = true;
                  });
                } else {
                  child.material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                    side: THREE.DoubleSide,
                  });
                }

                if (child.geometry) {
                  child.geometry.computeBoundingBox();
                  child.geometry.computeVertexNormals();
                }
              }
            });

            // Scale and center
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);
            modelRef.current = model;

            // Position camera
            const distance = 7.5;
            camera.position.set(distance, distance, distance);
            camera.lookAt(0, 0, 0);
            controls.target.set(0, 0, 0);
            controls.update();

            setStatus("Model loaded");
            resolve();
          },
          (progress) => {
            const percent = ((progress.loaded / progress.total) * 100).toFixed(
              0
            );
            setStatus(`Loading: ${percent}%`);
          },
          (err) => {
            console.error("Model load error:", err);
            setError(`Failed to load: ${err.message}`);
            reject(err);
          }
        );
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
      throw err;
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !autoRotate;
    }
  };

  const toggleWireframe = () => {
    const newWireframe = !wireframe;
    setWireframe(newWireframe);
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.wireframe = newWireframe;
            mat.needsUpdate = true;
          });
        }
      });
    }
  };

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(7.5, 7.5, 7.5);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          flexShrink: 0,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            {artworkTitle || fileName || "3D Model"}
          </h3>
          {artworkArtist && (
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
              by {artworkArtist}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* 3D Viewer */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
          backgroundColor: "#1a1a1a",
        }}
      >
        <div
          ref={mountRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 100,
          }}
        >
          <button
            onClick={toggleAutoRotate}
            style={{
              padding: "8px 12px",
              backgroundColor: autoRotate ? "#4ecdc4" : "rgba(0,0,0,0.7)",
              color: autoRotate ? "#000" : "#fff",
              border: "1px solid #4ecdc4",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔄 Auto-Rotate {autoRotate ? "ON" : "OFF"}
          </button>

          <button
            onClick={toggleWireframe}
            style={{
              padding: "8px 12px",
              backgroundColor: wireframe ? "#ffa500" : "rgba(0,0,0,0.7)",
              color: wireframe ? "#000" : "#fff",
              border: "1px solid #ffa500",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📐 Wireframe {wireframe ? "ON" : "OFF"}
          </button>

          <button
            onClick={resetCamera}
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "#fff",
              border: "1px solid #666",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            📷 Reset View
          </button>
        </div>

        {/* Status */}
        {status && status !== "Model loaded" && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "#4ecdc4",
              padding: "20px 40px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {status}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "#ff6b6b",
              padding: "20px 40px",
              borderRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderTop: "1px solid #333",
          color: "white",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ opacity: 0.8 }}>
          🖱️ Drag to orbit • 🔍 Scroll to zoom • ⌨️ ESC to close
        </div>
        <div style={{ fontSize: "11px", opacity: 0.6 }}>
          🔒 Download protected
        </div>
      </div>
    </div>
  );
};

export default ThreeDModelModal;
