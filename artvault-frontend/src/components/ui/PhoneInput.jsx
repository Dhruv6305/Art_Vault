import React, { useState, useEffect, useRef } from "react";
import { CountryService } from "../../services/countryService.js";

const PhoneInput = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter phone number",
  error = false,
}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    // Parse existing value if provided
    if (value && !selectedCountry) {
      parsePhoneNumber(value);
    }
  }, [value, selectedCountry]);

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
    try {
      const countryData = await CountryService.getCountries();
      setCountries(countryData);

      // Set default to US if no country selected
      if (!selectedCountry) {
        const defaultCountry =
          countryData.find((c) => c.code === "US") || countryData[0];
        setSelectedCountry(defaultCountry);
      }
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  };

  const parsePhoneNumber = (fullNumber) => {
    // Try to extract country code from full number
    const country = countries.find((c) => fullNumber.startsWith(c.phoneCode));

    if (country) {
      setSelectedCountry(country);
      setPhoneNumber(fullNumber.substring(country.phoneCode.length));
    } else {
      setPhoneNumber(fullNumber);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
    updateFullNumber(country.phoneCode, phoneNumber);
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/[^\d\s\-\(\)]/g, "");
    setPhoneNumber(number);
    updateFullNumber(selectedCountry?.phoneCode || "", number);
  };

  const updateFullNumber = (countryCode, number) => {
    const fullNumber = number ? `${countryCode}${number}` : "";
    onChange(fullNumber);
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.phoneCode.includes(searchTerm)
  );

  const formatPhoneNumber = (number) => {
    // Basic formatting for US numbers
    if (selectedCountry?.code === "US" && number.length === 10) {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return number;
  };

  return (
    <div className="phone-input-container">
      <div className="country-code-selector" ref={dropdownRef}>
        <button
          type="button"
          className={`country-code-btn ${isOpen ? "open" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="country-flag">{selectedCountry?.flag || "🌍"}</span>
          <span className="country-code">
            {selectedCountry?.phoneCode || "+1"}
          </span>
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <div className="phone-dropdown">
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
              {filteredCountries.length > 0 ? (
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

      <input
        type="tel"
        value={formatPhoneNumber(phoneNumber)}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`phone-number-input ${error ? "error" : ""}`}
      />
    </div>
  );
};

export default PhoneInput;
