import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        localStorage.setItem('token', token);
        // Load user data after successful Google OAuth
        await loadUser();
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleAuth();
  }, [location, navigate, loadUser]);

  return (
    <div className="page-container">
      <h2>Authenticating...</h2>
      <p>Please wait.</p>
    </div>
  );
};

export default AuthSuccess;