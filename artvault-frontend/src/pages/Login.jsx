import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Login = () => {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Load user data after successful login
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'An error occurred during login.');
    }
  };
  
  const handleGoogleSignIn = () => {
    // Directly redirect to Google OAuth - no need to check first
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="auth-container">
      <h1>Sign In</h1>
      <button onClick={handleGoogleSignIn} className="google-btn">Sign In with Google</button>
      <div className="divider">OR</div>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;