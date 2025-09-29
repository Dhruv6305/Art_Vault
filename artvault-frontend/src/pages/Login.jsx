import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Login = () => {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for OAuth errors in URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      const errorMessages = {
        auth_failed: "Google authentication failed. Please try again.",
        token_error: "Authentication token error. Please try again.",
        callback_error: "Authentication callback error. Please try again.",
      };
      setErrors({
        general: errorMessages[error] || "Authentication error occurred.",
      });
    }
  }, []);

  const { email, password } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      await loadUser();
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "An error occurred during login.";
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your ArtVault account</p>
      </div>

      {errors.general && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {errors.general}
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        className="google-btn"
        disabled={isLoading}
      >
        <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="divider">
        <span>or sign in with email</span>
      </div>

      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" style={{ color: "white" }}>Email Address</label>
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onChange}
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            <span className="input-icon">📧</span>
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" style={{ color: "white" }}>Password</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChange}
              className={errors.password ? "error" : ""}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <button

          type="submit"
          className={`btn btn-primary ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
        </div>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
