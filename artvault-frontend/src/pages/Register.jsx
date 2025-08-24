import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Register = () => {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '',
    address: '', country: '', contactInfo: '',
  });

  const { name, email, password, age, address, country, contactInfo } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      // Load user data after successful registration
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'An error occurred during registration.');
    }
  };

  const handleGoogleSignIn = () => {
    // Directly redirect to Google OAuth - no need to check first
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <button onClick={handleGoogleSignIn} className="google-btn">Sign Up with Google</button>
      <div className="divider">OR</div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
        <input type="number" placeholder="Age" name="age" value={age} onChange={onChange} />
        <input type="text" placeholder="Address" name="address" value={address} onChange={onChange} />
        <input type="text" placeholder="Country" name="country" value={country} onChange={onChange} />
        <input type="text" placeholder="Contact Info (Phone)" name="contactInfo" value={contactInfo} onChange={onChange} />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;