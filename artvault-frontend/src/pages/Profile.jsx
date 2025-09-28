import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import DetailedAddressForm from "../components/ui/DetailedAddressForm.jsx";
import PhoneInput from "../components/ui/PhoneInput.jsx";

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  // Load user data into form when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        contactInfo: user.contactInfo || "",
        // Address fields
        streetNumber: user.streetNumber || "",
        streetName: user.streetName || "",
        apartment: user.apartment || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        countryCode: user.countryCode || "",
        postalCode: user.postalCode || "",
        neighborhood: user.neighborhood || "",
        landmark: user.landmark || "",
        coordinates: user.coordinates || null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (addressData) => {
    setFormData((prev) => ({ ...prev, ...addressData }));
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData((prev) => ({ ...prev, contactInfo: phoneNumber }));

    // Clear phone error when user changes number
    if (errors.contactInfo) {
      setErrors((prev) => ({ ...prev, contactInfo: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.age &&
      (isNaN(formData.age) || formData.age < 13 || formData.age > 120)
    ) {
      newErrors.age = "Please enter a valid age (13-120)";
    }

    if (formData.contactInfo) {
      const cleanPhone = formData.contactInfo.replace(/[^\d+]/g, "");
      if (cleanPhone.length < 7 || !cleanPhone.startsWith("+")) {
        newErrors.contactInfo =
          "Please enter a valid phone number with country code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("");

    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        contactInfo: user.contactInfo || "",
        streetNumber: user.streetNumber || "",
        streetName: user.streetName || "",
        apartment: user.apartment || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        countryCode: user.countryCode || "",
        postalCode: user.postalCode || "",
        neighborhood: user.neighborhood || "",
        landmark: user.landmark || "",
        coordinates: user.coordinates || null,
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    console.log("Sending profile data:", formData);
    console.log("Current token:", localStorage.getItem("token"));

    try {
      const response = await api.put("/auth/profile", formData);
      console.log("Profile update response:", response.data);

      // Handle both response formats:
      // New format: { success: true, user: {...} }
      // Old format: { _id, name, email, ... } (user object directly)
      const isSuccess =
        response.data.success === true ||
        (response.data._id && response.data.email && !response.data.msg);

      if (isSuccess) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);

        // Reload user data to get the updated information
        await loadUser();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Profile update failed:", response.data);
        setErrors({ general: response.data.msg || "Failed to update profile" });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      let errorMsg = "Failed to update profile";
      if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.response?.status === 401) {
        errorMsg = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = () => {
    const addressParts = [];

    if (user?.streetNumber && user?.streetName) {
      addressParts.push(`${user.streetNumber} ${user.streetName}`);
    }

    if (user?.apartment) {
      addressParts.push(user.apartment);
    }

    if (user?.neighborhood) {
      addressParts.push(user.neighborhood);
    }

    if (user?.city && user?.state) {
      addressParts.push(
        `${user.city}, ${user.state} ${user.postalCode || ""}`.trim()
      );
    }

    if (user?.country) {
      addressParts.push(user.country);
    }

    return addressParts.length > 0 ? addressParts.join("\n") : "Not provided";
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <span className="spinner"></span>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">{getInitials(user.name)}</div>
        <div className="profile-header-info">
          <h1>{user.name || "User"}</h1>
          <p>{user.email}</p>
          {user.country && <p>📍 {user.country}</p>}
          <p className="member-since">
            Member since{" "}
            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="btn btn-primary">
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleSave}
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {successMessage}
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {errors.general}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>

          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              {isEditing ? (
                <div className="input-wrapper">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? "error" : ""}`}
                    disabled={loading}
                    placeholder="Enter your full name"
                  />
                  <span className="input-icon">👤</span>
                </div>
              ) : (
                <span className="form-value">
                  {user.name || "Not provided"}
                </span>
              )}
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              {isEditing ? (
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    disabled={loading}
                    placeholder="Enter your email"
                  />
                  <span className="input-icon">📧</span>
                </div>
              ) : (
                <span className="form-value">
                  {user.email || "Not provided"}
                </span>
              )}
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              {isEditing ? (
                <div className="input-wrapper">
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`form-input ${errors.age ? "error" : ""}`}
                    disabled={loading}
                    placeholder="Enter your age"
                    min="13"
                    max="120"
                  />
                  <span className="input-icon">🎂</span>
                </div>
              ) : (
                <span className="form-value">{user.age || "Not provided"}</span>
              )}
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <>
                  <PhoneInput
                    value={formData.contactInfo}
                    onChange={handlePhoneChange}
                    disabled={loading}
                    placeholder="Enter your phone number"
                    error={!!errors.contactInfo}
                  />
                  {errors.contactInfo && (
                    <span className="field-error">{errors.contactInfo}</span>
                  )}
                </>
              ) : (
                <span className="form-value">
                  {user.contactInfo || "Not provided"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Address Information</h2>

          {isEditing ? (
            <DetailedAddressForm
              formData={formData}
              onChange={handleAddressChange}
              disabled={loading}
              showLabels={false}
            />
          ) : (
            <div className="address-display">
              <div className="form-group">
                <label>Complete Address</label>
                <div className="address-preview">
                  <pre className="form-value">{formatAddress()}</pre>
                </div>
              </div>

              {user.coordinates && (
                <div className="coordinates-info">
                  <label>🛰️ GPS Location</label>
                  <div className="coordinates-display">
                    <span>Lat: {user.coordinates.latitude?.toFixed(6)}</span>
                    <span>Lng: {user.coordinates.longitude?.toFixed(6)}</span>
                    {user.coordinates.accuracy && (
                      <span>
                        Accuracy: ±{Math.round(user.coordinates.accuracy)}m
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
