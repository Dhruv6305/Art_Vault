import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useFBX,
  Environment,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          textAlign: "center",
          background: "rgba(0,0,0,0.8)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div>Loading 3D Model...</div>
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              width: "200px",
              height: "4px",
              background: "#333",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4CAF50",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div style={{ marginTop: "5px", fontSize: "12px" }}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </Html>
  );
}

// GLTF/GLB Model Component
function GLTFModel({ url, scale = 1, position = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Clone the scene to avoid issues with multiple instances
  const clonedScene = scene.clone();

  // Ensure materials are properly set up
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.needsUpdate = true;
      }
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={scale}
      position={position}
    />
  );
}

// FBX Model Component
function FBXModel({ url, scale = 1, position = [0, 0, 0] }) {
  const fbx = useFBX(url);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Set up materials and shadows
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.needsUpdate = true;
      }
    }
  });

  return (
    <primitive ref={meshRef} object={fbx} scale={scale} position={position} />
  );
}

// OBJ Model Component (basic geometry loader)
function OBJModel({ url, scale = 1, position = [0, 0, 0] }) {
  const [geometry, setGeometry] = useState(null);
  const meshRef = useRef();

  React.useEffect(() => {
    const loader = new THREE.OBJLoader();
    loader.load(url, (object) => {
      setGeometry(object);
    });
  }, [url]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  if (!geometry) return null;

  return (
    <primitive
      ref={meshRef}
      object={geometry}
      scale={scale}
      position={position}
    />
  );
}

// Main 3D Viewer Component
const ThreeDViewer = ({
  fileUrl,
  fileType,
  fileName,
  autoRotate = true,
  showControls = true,
  backgroundColor = "#1a1a1a",
  cameraPosition = [0, 0, 5],
  modelScale = 1,
  modelPosition = [0, 0, 0],
}) => {
  const [error, setError] = useState(null);

  // Determine which model component to use based on file extension
  const getModelComponent = () => {
    const extension = fileName.toLowerCase().split(".").pop();

    try {
      switch (extension) {
        case "gltf":
        case "glb":
          return (
            <GLTFModel
              url={fileUrl}
              scale={modelScale}
              position={modelPosition}
            />
          );
        case "fbx":
          return (
            <FBXModel
              url={fileUrl}
              scale={modelScale}
              position={modelPosition}
            />
          );
        case "obj":
          return (
            <OBJModel
              url={fileUrl}
              scale={modelScale}
              position={modelPosition}
            />
          );
        default:
          throw new Error(`Unsupported 3D file format: ${extension}`);
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: backgroundColor,
          color: "white",
          borderRadius: "8px",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>
          ⚠️ Error Loading 3D Model
        </div>
        <div style={{ fontSize: "14px", opacity: 0.8 }}>{error}</div>
        <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.6 }}>
          Supported formats: .gltf, .glb, .fbx, .obj
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: backgroundColor }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment for better reflections */}
        <Environment preset="studio" />

        {/* 3D Model */}
        <Suspense fallback={<Loader />}>{getModelComponent()}</Suspense>

        {/* Controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={1}
            maxDistance={20}
          />
        )}
      </Canvas>

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        <div>
          <strong>{fileName}</strong>
        </div>
        <div style={{ opacity: 0.8, marginTop: "2px" }}>
          {showControls
            ? "Click and drag to rotate • Scroll to zoom"
            : "Auto-rotating"}
        </div>
      </div>

      {/* Controls toggle */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            marginLeft: "5px",
          }}
        >
          {autoRotate ? "⏸️ Stop" : "▶️ Rotate"}
        </button>
      </div>
    </div>
  );
};

export default ThreeDViewer;
