import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

// Loading component
const Loader = () => (
  <Html center>
    <div className="loading-3d">
      <div className="spinner"></div>
      <p>Loading 3D Model...</p>
    </div>
  </Html>
);

// Error component
const ErrorDisplay = ({ error }) => (
  <Html center>
    <div className="error-3d">
      <p>❌ Failed to load 3D model</p>
      <small>{error}</small>
    </div>
  </Html>
);

// Simple 3D Model placeholder component
const Model = ({ url, format, onLoad, onError }) => {
  const meshRef = useRef();
  
  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // For now, show a placeholder for all formats
  // In a production app, you'd implement proper loaders for each format
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {format?.toUpperCase() || '3D'} Model
      </Text>
    </mesh>
  );
};

const ThreeDViewer = ({ 
  fileUrl, 
  format, 
  className = '', 
  showControls = true,
  autoRotate = true,
  environment = 'city'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setLoading(false);
    setError(errorMessage);
  };

  // Determine file format from URL if not provided
  const getFormat = () => {
    if (format) return format.toLowerCase();
    const extension = fileUrl?.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const modelFormat = getFormat();

  return (
    <div className={`threed-viewer ${className}`}>
      <div className="viewer-container">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          style={{ width: '100%', height: '400px' }}
        >
          <Suspense fallback={<Loader />}>
            <Environment preset={environment} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            {fileUrl && !error && (
              <Model
                url={fileUrl}
                format={modelFormat}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
            
            {showControls && (
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
      
      {showControls && (
        <div className="viewer-controls">
          <div className="format-badge">
            {modelFormat.toUpperCase()} Model
          </div>
          <div className="control-hints">
            <span>🖱️ Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>⚡ Right-click + drag to pan</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="viewer-error">
          <p>Failed to load 3D model: {error}</p>
          <small>Supported formats: GLTF, GLB, FBX</small>
        </div>
      )}
    </div>
  );
};

export default ThreeDViewer;