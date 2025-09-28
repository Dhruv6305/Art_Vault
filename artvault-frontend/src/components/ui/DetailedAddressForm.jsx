import React, { useState } from "react";
import LocationPicker from "./LocationPicker.jsx";
import CountrySelector from "./CountrySelector.jsx";

const DetailedAddressForm = ({
  formData,
  onChange,
  disabled = false,
  showLabels = true,
}) => {
  const [addressData, setAddressData] = useState({
    streetNumber: formData.streetNumber || "",
    streetName: formData.streetName || "",
    apartment: formData.apartment || "",
    city: formData.city || "",
    state: formData.state || "",
    country: formData.country || "",
    countryCode: formData.countryCode || "",
    postalCode: formData.postalCode || "",
    neighborhood: formData.neighborhood || "",
    landmark: formData.landmark || "",
    coordinates: formData.coordinates || null,
  });

  const handleFieldChange = (field, value) => {
    const newData = { ...addressData, [field]: value };
    setAddressData(newData);
    onChange(newData);
  };

  const handleLocationSelect = (locationData) => {
    const { address, coordinates } = locationData;

    // Parse the address components
    const newData = {
      ...addressData,
      streetNumber: address.houseNumber || "",
      streetName: address.road || "",
      apartment: address.apartment || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      countryCode: address.countryCode || "",
      postalCode: address.postcode || address.zipCode || "",
      neighborhood: address.neighbourhood || "",
      landmark: address.landmark || "",
      coordinates: coordinates,
    };

    setAddressData(newData);
    onChange(newData);

    // Show success message
    if (address.fullAddress) {
      alert(`✅ Address detected successfully!\n\n${address.fullAddress}`);
    }
  };

  const handleCountrySelect = (country) => {
    handleFieldChange("country", country.name);
    handleFieldChange("countryCode", country.code);
  };

  const handleStateSelect = (state) => {
    handleFieldChange("state", state.name);
  };

  return (
    <div className="detailed-address-form">
      {showLabels && (
        <div className="address-section-header">
          <h3>📍 Detailed Address Information</h3>
          <p>
            Provide your complete address for accurate delivery and location
            services
          </p>
        </div>
      )}

      {/* GPS Location Picker */}
      <div className="form-group">
        <label>🛰️ Auto-Fill with GPS</label>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          disabled={disabled}
        />
      </div>

      {/* Street Address */}
      <div className="address-row">
        <div className="form-group">
          <label htmlFor="streetNumber">Street Number</label>
          <div className="input-wrapper">
            <input
              id="streetNumber"
              type="text"
              placeholder="123"
              value={addressData.streetNumber}
              onChange={(e) =>
                handleFieldChange("streetNumber", e.target.value)
              }
              disabled={disabled}
              className="form-input"
            />
            <span className="input-icon">🏠</span>
          </div>
        </div>

        <div className="form-group flex-2">
          <label htmlFor="streetName">Street Name</label>
          <div className="input-wrapper">
            <input
              id="streetName"
              type="text"
              placeholder="Main Street"
              value={addressData.streetName}
              onChange={(e) => handleFieldChange("streetName", e.target.value)}
              disabled={disabled}
              className="form-input"
            />
            <span className="input-icon">🛣️</span>
          </div>
        </div>
      </div>

      {/* Apartment/Unit */}
      <div className="form-group">
        <label htmlFor="apartment">Apartment/Unit/Suite (Optional)</label>
        <div className="input-wrapper">
          <input
            id="apartment"
            type="text"
            placeholder="Apt 4B, Unit 12, Suite 200"
            value={addressData.apartment}
            onChange={(e) => handleFieldChange("apartment", e.target.value)}
            disabled={disabled}
            className="form-input"
          />
          <span className="input-icon">🏢</span>
        </div>
      </div>

      {/* Neighborhood/Area */}
      <div className="form-group">
        <label htmlFor="neighborhood">Neighborhood/Area (Optional)</label>
        <div className="input-wrapper">
          <input
            id="neighborhood"
            type="text"
            placeholder="Downtown, Midtown, etc."
            value={addressData.neighborhood}
            onChange={(e) => handleFieldChange("neighborhood", e.target.value)}
            disabled={disabled}
            className="form-input"
          />
          <span className="input-icon">🏘️</span>
        </div>
      </div>

      {/* City and State */}
      <div className="address-row">
        <div className="form-group flex-2">
          <label htmlFor="city">City</label>
          <div className="input-wrapper">
            <input
              id="city"
              type="text"
              placeholder="New York"
              value={addressData.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              disabled={disabled}
              className="form-input"
            />
            <span className="input-icon">🏙️</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">ZIP/Postal Code</label>
          <div className="input-wrapper">
            <input
              id="postalCode"
              type="text"
              placeholder="10001"
              value={addressData.postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value)}
              disabled={disabled}
              className="form-input"
            />
            <span className="input-icon">📮</span>
          </div>
        </div>
      </div>

      {/* Country and State Selector */}
      <div className="form-group">
        <label>Country & State/Province</label>
        <CountrySelector
          value={addressData.country}
          onChange={handleCountrySelect}
          onStateChange={handleStateSelect}
          disabled={disabled}
          placeholder="Select your country"
          showStates={true}
        />
      </div>

      {/* Landmark */}
      <div className="form-group">
        <label htmlFor="landmark">Nearby Landmark (Optional)</label>
        <div className="input-wrapper">
          <input
            id="landmark"
            type="text"
            placeholder="Near Central Park, Next to Starbucks, etc."
            value={addressData.landmark}
            onChange={(e) => handleFieldChange("landmark", e.target.value)}
            disabled={disabled}
            className="form-input"
          />
          <span className="input-icon">🗺️</span>
        </div>
      </div>

      {/* Address Preview */}
      {(addressData.streetNumber ||
        addressData.streetName ||
        addressData.city) && (
        <div className="address-preview">
          <label>📋 Address Preview</label>
          <div className="preview-content">
            {addressData.streetNumber && addressData.streetName && (
              <div>
                {addressData.streetNumber} {addressData.streetName}
              </div>
            )}
            {addressData.apartment && <div>{addressData.apartment}</div>}
            {addressData.neighborhood && <div>{addressData.neighborhood}</div>}
            {addressData.city && addressData.state && (
              <div>
                {addressData.city}, {addressData.state} {addressData.postalCode}
              </div>
            )}
            {addressData.country && <div>{addressData.country}</div>}
            {addressData.landmark && (
              <div className="landmark">📍 {addressData.landmark}</div>
            )}
          </div>
        </div>
      )}

      {/* Coordinates Display */}
      {addressData.coordinates && (
        <div className="coordinates-info">
          <label>🛰️ GPS Coordinates</label>
          <div className="coordinates-display">
            <span>Lat: {addressData.coordinates.latitude.toFixed(6)}</span>
            <span>Lng: {addressData.coordinates.longitude.toFixed(6)}</span>
            <span>
              Accuracy: ±{Math.round(addressData.coordinates.accuracy)}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedAddressForm;
