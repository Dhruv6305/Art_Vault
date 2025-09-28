import React, { useState } from "react";
import { LocationService } from "../../services/locationService.js";

const LocationPicker = ({ onLocationSelect, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetLocation = async () => {
    setIsLoading(true);
    setError("");

    try {
      const locationData = await LocationService.getLocationAndAddress();
      onLocationSelect(locationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-picker">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={disabled || isLoading}
        className="location-btn"
      >
        {isLoading ? (
          <>
            <span className="spinner-small"></span>
            Getting Location...
          </>
        ) : (
          <>
            <span className="location-icon">📍</span>
            Use Current Location
          </>
        )}
      </button>

      {error && (
        <div className="location-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="location-help">
        <small>
          Click to automatically fill your address using GPS location
        </small>
      </div>
    </div>
  );
};

export default LocationPicker;
