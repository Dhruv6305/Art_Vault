import React, { useState, useEffect, useRef } from "react";
import { CountryService } from "../../services/countryService.js";
import { handleApiError } from "../../utils/apiUtils.js";

const CountrySelector = ({
  value,
  onChange,
  onStateChange,
  disabled = false,
  placeholder = "Select country",
  showStates = false,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry && showStates) {
      loadStates(selectedCountry.code);
    }
  }, [selectedCountry, showStates]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCountries = async () => {
    setIsLoading(true);
    try {
      const countryData = await CountryService.getCountries();
      setCountries(countryData);
    } catch (error) {
      console.error("Failed to load countries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStates = async (countryCode) => {
    try {
      const stateData = await CountryService.getStates(countryCode);
      setStates(stateData);
    } catch (error) {
      console.error("Failed to load states:", error);
      setStates([]);
    }
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.phoneCode.includes(searchTerm)
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedState("");
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleStateSelect = (state) => {
    setSelectedState(state.name);
    onStateChange && onStateChange(state);
  };

  return (
    <div className="country-selector" ref={dropdownRef}>
      <div className="country-input-wrapper">
        <button
          type="button"
          className={`country-selector-btn ${isOpen ? "open" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="country-display">
            {selectedCountry ? (
              <>
                <span className="country-flag">{selectedCountry.flag}</span>
                <span className="country-name">{selectedCountry.name}</span>
                <span className="country-code">
                  ({selectedCountry.phoneCode})
                </span>
              </>
            ) : (
              <span className="placeholder">{placeholder}</span>
            )}
          </div>
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <div className="country-dropdown">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
              />
            </div>

            <div className="dropdown-list">
              {isLoading ? (
                <div className="dropdown-loading">
                  <span className="spinner-small"></span>
                  Loading countries...
                </div>
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    <span className="country-code">{country.phoneCode}</span>
                  </button>
                ))
              ) : (
                <div className="dropdown-empty">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {showStates && selectedCountry && states.length > 0 && (
        <div className="state-selector">
          <select
            value={selectedState}
            onChange={(e) => {
              const state = states.find((s) => s.name === e.target.value);
              handleStateSelect(state || { name: e.target.value });
            }}
            className="state-select"
            disabled={disabled}
          >
            <option value="">Select state/province</option>
            {states.map((state) => (
              <option key={state.code} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
