import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const TextureLoadingTest = ({ fileUrl, fileName }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const [status, setStatus] = useState("Ready to load");
  const [textureInfo, setTextureInfo] = useState([]);
  const [materialInfo, setMaterialInfo] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!fileUrl || !fileName) return;

    initScene();
    loadModel();

    return () => {
      cleanup();
    };
  }, [fileUrl, fileName]);

  const initScene = () => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting for texture visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, 10, -5);
    scene.add(pointLight);

    // Controls
    import("three/examples/jsm/controls/OrbitControls.js").then(
      ({ OrbitControls }) => {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const loadModel = async () => {
    if (!sceneRef.current) return;

    setStatus("Initializing loader...");
    setTextureInfo([]);
    setMaterialInfo([]);
    setLoadingProgress(0);

    try {
      const fileExtension = fileName.split(".").pop().toLowerCase();
      let loader;

      // Enhanced loading manager with detailed progress tracking
      const loadingManager = new THREE.LoadingManager();

      loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
        console.log("Started loading:", url);
        setStatus(`Loading: ${itemsLoaded}/${itemsTotal} items`);
      };

      loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const progress = (itemsLoaded / itemsTotal) * 100;
        setLoadingProgress(progress);
        setStatus(
          `Loading: ${itemsLoaded}/${itemsTotal} items (${progress.toFixed(
            1
          )}%)`
        );
        console.log("Loading progress:", url, `${progress.toFixed(1)}%`);
      };

      loadingManager.onLoad = () => {
        console.log("✅ All resources loaded successfully");
        setStatus("All resources loaded - analyzing textures...");
        setLoadingProgress(100);
      };

      loadingManager.onError = (url) => {
        console.error("❌ Failed to load resource:", url);
        setStatus(`Error loading: ${url}`);
      };

      // Initialize appropriate loader
      switch (fileExtension) {
        case "fbx":
          const { FBXLoader } = await import(
            "three/examples/jsm/loaders/FBXLoader.js"
          );
          loader = new FBXLoader(loadingManager);
          break;
        case "gltf":
        case "glb":
          const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );
          loader = new GLTFLoader(loadingManager);
          break;
        case "obj":
          const { OBJLoader } = await import(
            "three/examples/jsm/loaders/OBJLoader.js"
          );
          loader = new OBJLoader(loadingManager);
          break;
        default:
          throw new Error(`Unsupported file format: ${fileExtension}`);
      }

      setStatus(`Loading ${fileExtension.toUpperCase()} file...`);

      loader.load(
        fileUrl,
        (loadedModel) => {
          setStatus("Processing model and analyzing textures...");

          // Extract model from GLTF if needed
          const model = loadedModel.scene || loadedModel;

          // Analyze textures and materials before enhancement
          const textureAnalysis = analyzeTextures(model);
          const materialAnalysis = analyzeMaterials(model);

          setTextureInfo(textureAnalysis);
          setMaterialInfo(materialAnalysis);

          // Enhanced material processing with texture preservation
          enhanceModelMaterials(model);

          // Add to scene
          if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
          }

          sceneRef.current.add(model);
          modelRef.current = model;

          // Auto-fit camera
          fitCameraToModel(model);

          setStatus(
            `✅ Model loaded successfully! Found ${textureAnalysis.length} textures, ${materialAnalysis.length} materials`
          );
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            setLoadingProgress(percentComplete);
            setStatus(`Loading: ${percentComplete.toFixed(1)}%`);
          }
        },
        (error) => {
          console.error("❌ Model loading error:", error);
          setStatus(`Error: ${error.message}`);
        }
      );
    } catch (error) {
      console.error("❌ Loader initialization error:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const analyzeTextures = (model) => {
    const textures = [];
    const textureMap = new Map();

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material) => {
          // Check all possible texture properties
          const textureProperties = [
            "map",
            "normalMap",
            "bumpMap",
            "displacementMap",
            "roughnessMap",
            "metalnessMap",
            "alphaMap",
            "emissiveMap",
            "envMap",
            "lightMap",
            "aoMap",
            "specularMap",
          ];

          textureProperties.forEach((prop) => {
            if (material[prop] && material[prop].isTexture) {
              const texture = material[prop];
              const textureId = texture.uuid;

              if (!textureMap.has(textureId)) {
                textureMap.set(textureId, {
                  id: textureId,
                  type: prop,
                  image: texture.image,
                  source: texture.image
                    ? texture.image.src ||
                      texture.image.currentSrc ||
                      "embedded"
                    : "no image",
                  width: texture.image ? texture.image.width : "unknown",
                  height: texture.image ? texture.image.height : "unknown",
                  format: texture.format,
                  wrapS: texture.wrapS,
                  wrapT: texture.wrapT,
                  magFilter: texture.magFilter,
                  minFilter: texture.minFilter,
                  loaded: texture.image ? texture.image.complete : false,
                });
              }
            }
          });
        });
      }
    });

    return Array.from(textureMap.values());
  };

  const analyzeMaterials = (model) => {
    const materials = [];
    const materialMap = new Map();

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const childMaterials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        childMaterials.forEach((material) => {
          const materialId = material.uuid;

          if (!materialMap.has(materialId)) {
            materialMap.set(materialId, {
              id: materialId,
              name: material.name || "Unnamed",
              type: material.type,
              color: material.color
                ? `#${material.color.getHexString()}`
                : "none",
              hasTexture: !!material.map,
              textureCount: Object.keys(material).filter(
                (key) => material[key] && material[key].isTexture
              ).length,
              transparent: material.transparent,
              opacity: material.opacity,
              side:
                material.side === THREE.DoubleSide
                  ? "DoubleSide"
                  : material.side === THREE.BackSide
                  ? "BackSide"
                  : "FrontSide",
              wireframe: material.wireframe,
            });
          }
        });
      }
    });

    return Array.from(materialMap.values());
  };

  const enhanceModelMaterials = (model) => {
    let enhancedCount = 0;
    let preservedCount = 0;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material, index) => {
          const enhancedMaterial = material.clone();

          if (enhancedMaterial.map) {
            // Has texture - preserve and enhance
            enhancedMaterial.transparent = false;
            enhancedMaterial.opacity = 1.0;
            enhancedMaterial.side = THREE.DoubleSide;

            // Boost brightness if too dark
            if (enhancedMaterial.color) {
              const hsl = {};
              enhancedMaterial.color.getHSL(hsl);
              if (hsl.l < 0.3) {
                enhancedMaterial.color.setHSL(
                  hsl.h,
                  hsl.s,
                  Math.max(0.5, hsl.l * 1.5)
                );
                enhancedCount++;
              }
            }

            materials[index] = enhancedMaterial;
            preservedCount++;
          } else {
            // No texture - enhance or create visible material
            if (
              enhancedMaterial.color &&
              enhancedMaterial.color.getHex() !== 0x000000
            ) {
              const hsl = {};
              enhancedMaterial.color.getHSL(hsl);
              enhancedMaterial.color.setHSL(
                hsl.h,
                Math.max(0.6, hsl.s),
                Math.max(0.4, hsl.l)
              );
              enhancedMaterial.side = THREE.DoubleSide;
              materials[index] = enhancedMaterial;
              enhancedCount++;
            } else {
              materials[index] = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
                side: THREE.DoubleSide,
              });
              enhancedCount++;
            }
          }
        });

        child.material = Array.isArray(child.material)
          ? materials
          : materials[0];
      }
    });

    console.log(
      `✅ Material enhancement complete: ${preservedCount} textures preserved, ${enhancedCount} materials enhanced`
    );
  };

  const fitCameraToModel = (model) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    cameraZ *= 2; // Add some padding
    cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  const cleanup = () => {
    if (mountRef.current && rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #444",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>🔍 Texture Loading Test:</strong> {status}
        </div>
        {loadingProgress > 0 && loadingProgress < 100 && (
          <div
            style={{
              width: "200px",
              height: "6px",
              backgroundColor: "#444",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: "100%",
                backgroundColor: "#4ecdc4",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </div>

      {/* 3D Viewer */}
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#2a2a2a",
        }}
      />

      {/* Analysis Results */}
      <div style={{ padding: "20px", backgroundColor: "#1a1a1a" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Texture Analysis */}
          <div>
            <h3 style={{ marginTop: 0, color: "#4ecdc4" }}>
              🎨 Texture Analysis ({textureInfo.length})
            </h3>
            {textureInfo.length > 0 ? (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {textureInfo.map((texture, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundColor: "#2a2a2a",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <strong>Type:</strong> {texture.type}
                    </div>
                    <div>
                      <strong>Size:</strong> {texture.width} × {texture.height}
                    </div>
                    <div>
                      <strong>Source:</strong> {texture.source}
                    </div>
                    <div>
                      <strong>Loaded:</strong> {texture.loaded ? "✅" : "❌"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{ padding: "20px", textAlign: "center", opacity: 0.5 }}
              >
                No textures found or model not loaded yet
              </div>
            )}
          </div>

          {/* Material Analysis */}
          <div>
            <h3 style={{ marginTop: 0, color: "#6c5ce7" }}>
              🎭 Material Analysis ({materialInfo.length})
            </h3>
            {materialInfo.length > 0 ? (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {materialInfo.map((material, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundColor: "#2a2a2a",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <strong>Name:</strong> {material.name}
                    </div>
                    <div>
                      <strong>Type:</strong> {material.type}
                    </div>
                    <div>
                      <strong>Color:</strong>{" "}
                      <span style={{ color: material.color }}>
                        {material.color}
                      </span>
                    </div>
                    <div>
                      <strong>Has Texture:</strong>{" "}
                      {material.hasTexture ? "✅" : "❌"}
                    </div>
                    <div>
                      <strong>Texture Count:</strong> {material.textureCount}
                    </div>
                    <div>
                      <strong>Opacity:</strong> {material.opacity}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{ padding: "20px", textAlign: "center", opacity: 0.5 }}
              >
                No materials found or model not loaded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextureLoadingTest;
