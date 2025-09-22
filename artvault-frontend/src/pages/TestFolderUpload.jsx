import React, { useState } from "react";
import FolderUpload from "../components/ui/FolderUpload.jsx";
import DebugUpload from "../components/DebugUpload.jsx";

const TestFolderUpload = () => {
  const [uploadedFolder, setUploadedFolder] = useState(null);

  const handleFolderUploaded = (folderData) => {
    console.log("Folder uploaded:", folderData);
    setUploadedFolder(folderData);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Test Folder Upload</h1>

      <DebugUpload />

      <FolderUpload onFolderUploaded={handleFolderUploaded} />

      {uploadedFolder && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h3>Upload Result:</h3>
          <pre>{JSON.stringify(uploadedFolder, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestFolderUpload;
