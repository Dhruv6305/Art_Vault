import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import PasswordStrength from "../components/ui/PasswordStrength.jsx";
import DetailedAddressForm from "../components/ui/DetailedAddressForm.jsx";
import PhoneInput from "../components/ui/PhoneInput.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    contactInfo: "",
    // Detailed address fields
    streetNumber: "",
    streetName: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    countryCode: "",
    postalCode: "",
    neighborhood: "",
    landmark: "",
    coordinates: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { name, email, password, confirmPassword, age, contactInfo } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddressChange = (addressData) => {
    setFormData((prev) => ({ ...prev, ...addressData }));
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData({
      ...formData,
      contactInfo: phoneNumber,
    });
    // Clear phone error when user changes number
    if (errors.contactInfo) {
      setErrors({ ...errors, contactInfo: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (age && (isNaN(age) || age < 13 || age > 120)) {
      newErrors.age = "Please enter a valid age (13-120)";
    }

    if (contactInfo) {
      // Remove all non-digit characters except + for validation
      const cleanPhone = contactInfo.replace(/[^\d+]/g, "");
      if (cleanPhone.length < 7 || !cleanPhone.startsWith("+")) {
        newErrors.contactInfo =
          "Please enter a valid phone number with country code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...submitData } = formData;
      const res = await api.post("/auth/register", submitData);
      localStorage.setItem("token", res.data.token);
      await loadUser();
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "An error occurred during registration.";
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
        <h1>Create Your Account</h1>
        <p>Join ArtVault and start your creative journey</p>
      </div>

      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Account Info</span>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Personal Details</span>
        </div>
      </div>

      {errors.general && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {errors.general}
        </div>
      )}

      {currentStep === 1 && (
        <>
          <button
            onClick={handleGoogleSignIn}
            className="google-btn"
            disabled={isLoading}
          >
            <svg
              className="google-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
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
            <span>or create account with email</span>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className={errors.name ? "error" : ""}
                  disabled={isLoading}
                />
                <span className="input-icon">👤</span>
              </div>
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
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
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
              <PasswordStrength password={password} />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  className={errors.confirmPassword ? "error" : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="btn btn-primary"
              disabled={isLoading}
            >
              Continue
            </button>
          </form>
        </>
      )}

      {currentStep === 2 && (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="age">Age (Optional)</label>
            <div className="input-wrapper">
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                name="age"
                value={age}
                onChange={onChange}
                className={errors.age ? "error" : ""}
                disabled={isLoading}
                min="13"
                max="120"
              />
              <span className="input-icon">🎂</span>
            </div>
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label>Address Information (Optional)</label>
            <DetailedAddressForm
              formData={formData}
              onChange={handleAddressChange}
              disabled={isLoading}
              showLabels={true}
            />
          </div>

          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <PhoneInput
              value={contactInfo}
              onChange={handlePhoneChange}
              disabled={isLoading}
              placeholder="Enter your phone number"
              error={!!errors.contactInfo}
            />
            {errors.contactInfo && (
              <span className="field-error">{errors.contactInfo}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
