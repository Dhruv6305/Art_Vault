import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
// import ScreenshotProtection from "./utils/ScreenshotProtection.js"; // Disabled for now
import "./App.css";
import Navbar from "./components/layout/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import AuthSuccess from "./pages/AuthSuccess.jsx";
import AddArtwork from "./pages/AddArtwork.jsx";
import EditArtwork from "./pages/EditArtwork.jsx";
import MyArtworks from "./pages/MyArtworks.jsx";
import BrowseArtworks from "./pages/BrowseArtworks.jsx";
import ArtworkDetail from "./pages/ArtworkDetail.jsx";
import Orders from "./pages/Orders.jsx";
import CancelledOrders from "./pages/CancelledOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Analytics from "./pages/Analytics.jsx";
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
            <Route path="/browse" element={<BrowseArtworks />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/add-artwork" element={<AddArtwork />} />
            <Route path="/edit-artwork/:id" element={<EditArtwork />} />
            <Route path="/my-artworks" element={<MyArtworks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cancelled-orders" element={<CancelledOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Router>
    </AuthProvider>
  );
}

export default App;
