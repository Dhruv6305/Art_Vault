import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const TextureDebugger = ({ fileUrl, fileName }) => {
  const mountRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    if (!fileUrl || !fileName) return;

    debugModel();
  }, [fileUrl, fileName]);

  const debugModel = async () => {
    setStatus("Loading model for texture analysis...");
    setDebugInfo(null);

    try {
      const extension = fileName.toLowerCase().split(".").pop();
      let loader;

      // Initialize loader
      switch (extension) {
        case "fbx":
          const { FBXLoader } = await import(
            "three/examples/jsm/loaders/FBXLoader.js"
          );
          loader = new FBXLoader();
          break;
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
        default:
          throw new Error(`Unsupported format: ${extension}`);
      }

      // Load and analyze
      loader.load(
        fileUrl,
        (loadedModel) => {
          setStatus("Analyzing textures and materials...");

          const model = loadedModel.scene || loadedModel;
          const analysis = analyzeModelTextures(model);

          setDebugInfo(analysis);
          setStatus(
            `Analysis complete: ${analysis.materials.length} materials, ${analysis.textures.length} textures`
          );
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total) * 100;
            setStatus(`Loading: ${percent.toFixed(1)}%`);
          }
        },
        (error) => {
          console.error("Loading error:", error);
          setStatus(`Error: ${error.message}`);
        }
      );
    } catch (error) {
      console.error("Debug error:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const analyzeModelTextures = (model) => {
    const materials = [];
    const textures = [];
    const textureMap = new Map();
    let meshCount = 0;

    model.traverse((child) => {
      if (child.isMesh) {
        meshCount++;

        if (child.material) {
          const childMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          childMaterials.forEach((material) => {
            // Analyze material
            const materialInfo = {
              name: material.name || `Material_${materials.length}`,
              type: material.type,
              uuid: material.uuid,
              color: material.color
                ? `#${material.color.getHexString()}`
                : "none",
              transparent: material.transparent,
              opacity: material.opacity,
              side:
                material.side === THREE.DoubleSide
                  ? "DoubleSide"
                  : material.side === THREE.BackSide
                  ? "BackSide"
                  : "FrontSide",
              textures: [],
            };

            // Check for all texture types
            const textureTypes = [
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

            textureTypes.forEach((textureType) => {
              if (material[textureType] && material[textureType].isTexture) {
                const texture = material[textureType];
                const textureId = texture.uuid;

                materialInfo.textures.push(textureType);

                if (!textureMap.has(textureId)) {
                  const textureInfo = {
                    id: textureId,
                    type: textureType,
                    name: texture.name || `Texture_${textures.length}`,
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
                    loaded: texture.image ? texture.image.complete : false,
                    flipY: texture.flipY,
                    generateMipmaps: texture.generateMipmaps,
                  };

                  textureMap.set(textureId, textureInfo);
                  textures.push(textureInfo);
                }
              }
            });

            materials.push(materialInfo);
          });
        }
      }
    });

    return {
      meshCount,
      materials,
      textures,
      summary: {
        totalMaterials: materials.length,
        totalTextures: textures.length,
        texturedMaterials: materials.filter((m) => m.textures.length > 0)
          .length,
        untexturedMaterials: materials.filter((m) => m.textures.length === 0)
          .length,
      },
    };
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        padding: "20px",
        color: "white",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#4ecdc4" }}>
        🔍 Texture Debug Analysis
      </h3>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#2a2a2a",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <strong>Status:</strong> {status}
      </div>

      {debugInfo && (
        <div>
          {/* Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2a2a2a",
                padding: "15px",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#4ecdc4",
                }}
              >
                {debugInfo.meshCount}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Meshes</div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                padding: "15px",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#6c5ce7",
                }}
              >
                {debugInfo.summary.totalMaterials}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Materials</div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                padding: "15px",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#00b894",
                }}
              >
                {debugInfo.summary.totalTextures}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Textures</div>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                padding: "15px",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fdcb6e",
                }}
              >
                {debugInfo.summary.texturedMaterials}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Textured</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Materials */}
            <div>
              <h4 style={{ color: "#6c5ce7", marginBottom: "15px" }}>
                🎭 Materials ({debugInfo.materials.length})
              </h4>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {debugInfo.materials.map((material, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#2a2a2a",
                      padding: "12px",
                      marginBottom: "10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {material.name}
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
                      <strong>Opacity:</strong> {material.opacity}
                    </div>
                    <div>
                      <strong>Textures:</strong>{" "}
                      {material.textures.length > 0
                        ? material.textures.join(", ")
                        : "None"}
                    </div>
                    {material.textures.length > 0 && (
                      <div
                        style={{
                          marginTop: "5px",
                          padding: "5px",
                          backgroundColor: "#1a1a1a",
                          borderRadius: "3px",
                          color: "#00b894",
                        }}
                      >
                        ✅ Has {material.textures.length} texture(s)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Textures */}
            <div>
              <h4 style={{ color: "#00b894", marginBottom: "15px" }}>
                🎨 Textures ({debugInfo.textures.length})
              </h4>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {debugInfo.textures.length > 0 ? (
                  debugInfo.textures.map((texture, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#2a2a2a",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        {texture.name}
                      </div>
                      <div>
                        <strong>Type:</strong> {texture.type}
                      </div>
                      <div>
                        <strong>Size:</strong> {texture.width} ×{" "}
                        {texture.height}
                      </div>
                      <div>
                        <strong>Source:</strong> {texture.source}
                      </div>
                      <div>
                        <strong>Loaded:</strong>{" "}
                        {texture.loaded ? "✅ Yes" : "❌ No"}
                      </div>
                      <div>
                        <strong>Format:</strong> {texture.format}
                      </div>
                      {texture.loaded && (
                        <div
                          style={{
                            marginTop: "5px",
                            padding: "5px",
                            backgroundColor: "#1a4a3a",
                            borderRadius: "3px",
                            color: "#4ecdc4",
                          }}
                        >
                          🎯 Texture loaded successfully
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#2a2a2a",
                      borderRadius: "6px",
                      opacity: 0.7,
                    }}
                  >
                    No textures found in this model
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#2d1b69",
              borderRadius: "6px",
              border: "1px solid #6c5ce7",
            }}
          >
            <h4 style={{ marginTop: 0, color: "#6c5ce7" }}>
              💡 Recommendations
            </h4>
            {debugInfo.summary.totalTextures > 0 ? (
              <div style={{ fontSize: "14px" }}>
                ✅ <strong>Good news!</strong> This model has{" "}
                {debugInfo.summary.totalTextures} texture(s). The enhanced
                viewers should preserve and display these textures correctly.
                {debugInfo.summary.untexturedMaterials > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    ⚠️ Note: {debugInfo.summary.untexturedMaterials} material(s)
                    have no textures and will use enhanced colors for
                    visibility.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: "14px" }}>
                ⚠️ <strong>No textures found.</strong> This model uses only
                solid colors or materials. The viewers will enhance the colors
                for better visibility.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextureDebugger;
