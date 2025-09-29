import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const DebugUser = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div
        style={{
          padding: "10px",
          background: "#f8d7da",
          border: "1px solid #f5c6cb",
          borderRadius: "4px",
          margin: "10px",
        }}
      >
        <strong>Debug: No user logged in</strong>
      </div>
    );
  }

  return (
    <div>
      <strong>Debug User Object:</strong>
      <pre style={{ fontSize: "12px", margin: "5px 0" }}>
        {JSON.stringify(user, null, 2)}
      </pre>
      <div style={{ marginTop: "10px" }}>
        <strong>User ID Fields:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>user._id: {user._id || "undefined"}</li>
          <li>user.id: {user.id || "undefined"}</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugUser;
