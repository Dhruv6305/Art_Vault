import React, { useState } from 'react';
import api from '../api/axios.js';

const Test3DUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
    
    if (selectedFile) {
      console.log('Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);

      const response = await api.post('/artworks/test-3d-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.msg || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🎲 3D File Upload Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="file-input" style={{ display: 'block', marginBottom: '8px' }}>
          Select a 3D file to test:
        </label>
        <input
          id="file-input"
          type="file"
          accept=".fbx,.obj,.blend,.dae,.3ds,.ply,.stl,.gltf,.glb,.x3d,.ma,.mb"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        
        {file && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Selected file:</strong><br/>
            Name: {file.name}<br/>
            Type: {file.type || 'Unknown'}<br/>
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB<br/>
            Extension: {file.name.split('.').pop().toUpperCase()}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          padding: '10px 20px',
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {uploading ? 'Uploading...' : 'Test Upload'}
      </button>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          marginBottom: '20px'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          marginBottom: '20px'
        }}>
          <strong>✅ Success:</strong> {result.message}
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            marginTop: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result.file, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        background: '#e3f2fd',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #b3d9ff'
      }}>
        <h3>📋 Supported 3D Formats:</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>FBX</strong> - Autodesk FBX format</li>
          <li><strong>OBJ</strong> - Wavefront OBJ format</li>
          <li><strong>BLEND</strong> - Blender files</li>
          <li><strong>GLTF/GLB</strong> - GL Transmission Format</li>
          <li><strong>DAE</strong> - COLLADA format</li>
          <li><strong>STL</strong> - Stereolithography format</li>
          <li><strong>PLY</strong> - Stanford PLY format</li>
          <li><strong>3DS</strong> - 3D Studio format</li>
          <li><strong>X3D</strong> - Web3D format</li>
          <li><strong>MA/MB</strong> - Maya formats</li>
        </ul>
      </div>
    </div>
  );
};

export default Test3DUpload;