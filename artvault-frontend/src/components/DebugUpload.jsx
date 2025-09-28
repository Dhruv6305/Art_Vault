import React, { useState } from "react";
import { downloadAsJSON, exportSystemState } from "../utils/fileUtils.js";

const DebugUpload = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token ? "Present" : "Missing");

      const response = await fetch("/api/artwork/test-upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResult({ type: "auth", data, status: response.status });
    } catch (err) {
      setResult({ type: "auth", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const testSimpleUpload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Create a simple test file
      const testFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const formData = new FormData();
      formData.append("files", testFile);
      formData.append("folderName", "test_folder");

      console.log("Uploading test file...");

      const response = await fetch("/api/artwork/upload-folder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setResult({ type: "upload", data, status: response.status });
    } catch (err) {
      setResult({ type: "upload", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f8f9fa",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Upload Debug Tools</h3>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testAuth}
          disabled={loading}
          style={{ marginRight: "10px" }}
        >
          Test Auth
        </button>
        <button
          onClick={testSimpleUpload}
          disabled={loading}
          style={{ marginRight: "10px" }}
        >
          Test Simple Upload
        </button>
        <button
          onClick={() => result && downloadAsJSON(result, "upload-debug.json")}
          disabled={!result}
        >
          Save Result
        </button>
        <button onClick={exportSystemState} style={{ marginLeft: "10px" }}>
          Export System State
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div
          style={{ background: "white", padding: "15px", borderRadius: "4px" }}
        >
          <h4>Result ({result.type}):</h4>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          {result.error && (
            <p style={{ color: "red" }}>
              <strong>Error:</strong> {result.error}
            </p>
          )}
          {result.data && (
            <pre
              style={{
                background: "#f1f1f1",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>
          <strong>Current token:</strong>{" "}
          {localStorage.getItem("token") ? "Present" : "Missing"}
        </p>
        <p>
          <strong>API Base:</strong> {window.location.origin}/api/artwork/
        </p>
      </div>
    </div>
  );
};

export default DebugUpload;
