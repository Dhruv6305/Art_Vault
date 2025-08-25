import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
// import ScreenshotProtection from "./utils/ScreenshotProtection.js"; // Disabled for now
import "./App.css";
import Navbar from "./components/layout/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import AuthSuccess from "./pages/AuthSuccess.jsx";
import ToastContainer from "./components/ui/ToastContainer.jsx";
import { useToast } from "./hooks/useToast.js";

function App() {
  const { toasts, removeToast } = useToast();

  // Screenshot protection is disabled for now
  // To enable, uncomment the useEffect below and the import above

  // useEffect(() => {
  //   // Initialize screenshot protection
  //   const protection = new ScreenshotProtection({
  //     enableWatermark: true,
  //     enableBlurOnFocus: true,
  //     enableKeyboardBlocking: true,
  //     enableRightClickBlock: true,
  //     enableDevToolsBlock: true,
  //     watermarkText: "ArtVault Protected",
  //   });

  //   // For development, you can disable protection by uncommenting:
  //   // if (process.env.NODE_ENV === 'development') {
  //   //   protection.disable();
  //   // }

  //   return () => {
  //     // Cleanup on unmount
  //     protection.disable();
  //   };
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={
                <div className="container">
                  <Register />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="container">
                  <Login />
                </div>
              }
            />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Router>
    </AuthProvider>
  );
}

export default App;
