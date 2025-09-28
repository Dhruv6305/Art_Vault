import React, { useState } from "react";
import api from "../api/axios.js";

const DebugArtwork = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    setResult("");

    try {
      const tests = [];

      // Test 1: Check server health
      try {
        const healthResponse = await fetch("http://localhost:5000/");
        const healthText = await healthResponse.text();
        tests.push(`✅ Server Health: ${healthText}`);
      } catch (err) {
        tests.push(`❌ Server Health: ${err.message}`);
      }

      // Test 2: Check if artwork routes are loaded
      try {
        const testResponse = await api.get("/artworks/test");
        tests.push(
          `✅ GET /artworks/test: ${testResponse.status} - ${testResponse.data.message}`
        );
      } catch (err) {
        tests.push(
          `❌ GET /artworks/test: ${
            err.response?.status || "No response"
          } - Routes not loaded! Server needs restart.`
        );
      }

      // Test 3: Check artworks endpoint
      try {
        const artworksResponse = await api.get("/artworks");
        tests.push(
          `✅ GET /artworks: ${artworksResponse.status} - Found ${
            artworksResponse.data.artworks?.length || 0
          } artworks`
        );
      } catch (err) {
        tests.push(
          `❌ GET /artworks: ${err.response?.status || "No response"} - ${
            err.response?.data?.msg || err.message
          }`
        );
      }

      // Test 4: Check upload endpoint (without files)
      try {
        const uploadResponse = await api.post(
          "/artworks/upload",
          new FormData()
        );
        tests.push(`✅ POST /artworks/upload: ${uploadResponse.status}`);
      } catch (err) {
        if (
          err.response?.status === 400 &&
          err.response?.data?.msg?.includes("No files")
        ) {
          tests.push(
            `✅ POST /artworks/upload: Endpoint exists (400 - No files uploaded)`
          );
        } else {
          tests.push(
            `❌ POST /artworks/upload: ${
              err.response?.status || "No response"
            } - ${err.response?.data?.msg || err.message}`
          );
        }
      }

      // Test 5: Check auth token
      const token = localStorage.getItem("token");
      tests.push(`🔑 Auth Token: ${token ? "Present" : "Missing"}`);

      setResult(tests.join("\n"));
    } catch (error) {
      setResult(`General Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div
//       style={{
//         padding: "20px",
//         border: "2px solid #e1e5e9",
//         borderRadius: "8px",
//         margin: "20px",
//         backgroundColor: "#f8f9fa",
//       }}
//     >
//       <h3 style={{ color: "#333", marginBottom: "15px" }}>
//         🔧 Artwork API Debug Tool
//       </h3>
//       <button
//         onClick={testEndpoints}
//         disabled={loading}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#667eea",
//           color: "white",
//           border: "none",
//           borderRadius: "6px",
//           cursor: loading ? "not-allowed" : "pointer",
//           marginBottom: "15px",
//         }}
//       >
//         {loading ? "Testing..." : "Test Artwork Endpoints"}
//       </button>

//       {result && (
//         <pre
//           style={{
//             background: "#fff",
//             padding: "15px",
//             borderRadius: "6px",
//             border: "1px solid #dee2e6",
//             whiteSpace: "pre-wrap",
//             fontSize: "14px",
//             lineHeight: "1.5",
//             color: "#333",
//           }}
//         >
//           {result}
//         </pre>
//       )}

//       <div style={{ marginTop: "15px", fontSize: "14px", color: "#6c757d" }}>
//         <strong>Instructions:</strong>
//         <ol style={{ marginTop: "8px", paddingLeft: "20px" }}>
//           <li>Click "Test Artwork Endpoints" to check API status</li>
//           <li>
//             If you see 404 errors, restart your backend server with:{" "}
//             <code>npm run server</code>
//           </li>
//           <li>Make sure you're logged in (auth token should be present)</li>
//           <li>
//             If server health fails, check if backend is running on port 5000
//           </li>
//         </ol>
//       </div>
//     </div>
//   );
 };

export default DebugArtwork;
