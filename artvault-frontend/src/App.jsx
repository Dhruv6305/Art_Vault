import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthSuccess from './pages/AuthSuccess.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<div className="container"><Register /></div>} />
            <Route path="/login" element={<div className="container"><Login /></div>} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
