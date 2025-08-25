import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import PhoneInput from "../components/ui/PhoneInput.jsx";

// Countries with their phone codes
const countriesWithCodes = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "+242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Democratic Republic of the Congo", code: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1809", flag: "🇩🇴" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Eswatini", code: "+268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Grenada", code: "+1473", flag: "🇬🇩" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "+1876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "+686", flag: "🇰🇮" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "North Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "+1869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "+1758", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "+1784", flag: "🇻🇨" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "+670", flag: "🇹🇱" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Tonga", code: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "+1868", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "Tuvalu", code: "+688", flag: "🇹🇻" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "+678", flag: "🇻🇺" },
  { name: "Vatican City", code: "+39", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" },
];

// Extract just country names for the country dropdown
const countries = countriesWithCodes.map((country) => country.name);

// API-based Country and State Component
const CountryStateSelector = ({
  selectedCountry,
  selectedState,
  onCountryChange,
  onStateChange,
}) => {
  const [apiCountries, setApiCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Load countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flag"
        );
        const data = await response.json();

        const formattedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flag,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setApiCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback to static list if API fails
        setApiCountries(
          countriesWithCodes.map((c) => ({
            name: c.name,
            code: c.name.substring(0, 2).toUpperCase(),
            flag: c.flag,
          }))
        );
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const fetchStates = async (countryName) => {
    setLoadingStates(true);
    try {
      // Using CountryStateCity API (free tier)
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${getCountryCode(
          countryName
        )}/states`,
        {
          headers: {
            "X-CSCAPI-KEY": "YOUR_API_KEY_HERE", // You'll need to get a free API key from countrystatecity.in
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedStates = data
          .map((state) => ({
            name: state.name,
            code: state.iso2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setStates(formattedStates);
      } else {
        // Fallback for common countries without API
        setStates(getStaticStates(countryName));
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      // Fallback to static states for major countries
      setStates(getStaticStates(countryName));
    } finally {
      setLoadingStates(false);
    }
  };

  // Get country code for API calls
  const getCountryCode = (countryName) => {
    const country = apiCountries.find((c) => c.name === countryName);
    return country ? country.code : countryName.substring(0, 2).toUpperCase();
  };

  // Fallback static states for major countries
  const getStaticStates = (countryName) => {
    const staticStates = {
      "United States": [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      Canada: [
        "Alberta",
        "British Columbia",
        "Manitoba",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Northwest Territories",
        "Nova Scotia",
        "Nunavut",
        "Ontario",
        "Prince Edward Island",
        "Quebec",
        "Saskatchewan",
        "Yukon",
      ],
      India: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
      ],
      Australia: [
        "Australian Capital Territory",
        "New South Wales",
        "Northern Territory",
        "Queensland",
        "South Australia",
        "Tasmania",
        "Victoria",
        "Western Australia",
      ],
      Germany: [
        "Baden-Württemberg",
        "Bavaria",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hesse",
        "Lower Saxony",
        "Mecklenburg-Vorpommern",
        "North Rhine-Westphalia",
        "Rhineland-Palatinate",
        "Saarland",
        "Saxony",
        "Saxony-Anhalt",
        "Schleswig-Holstein",
        "Thuringia",
      ],
    };

    return (staticStates[countryName] || []).map((state) => ({
      name: state,
      code: state,
    }));
  };

  const filteredCountries = apiCountries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    onCountryChange(country.name);
    onStateChange(""); // Reset state when country changes
    setShowCountryDropdown(false);
    setCountrySearchTerm("");
  };

  const handleStateSelect = (state) => {
    onStateChange(state.name);
    setShowStateDropdown(false);
    setStateSearchTerm("");
  };

  return (
    <div className="country-state-selector">
      {/* Country Dropdown */}
      <div className="form-group">
        <label>Country</label>
        <div className="api-dropdown">
          <button
            type="button"
            className="api-dropdown-button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            disabled={loadingCountries}
          >
            <span className="dropdown-content">
              {selectedCountry ? (
                <>
                  <span className="country-flag">
                    {apiCountries.find((c) => c.name === selectedCountry)
                      ?.flag || "🌍"}
                  </span>
                  <span>{selectedCountry}</span>
                </>
              ) : (
                <span>
                  {loadingCountries
                    ? "Loading countries..."
                    : "Select a country"}
                </span>
              )}
            </span>
            <span
              className={`dropdown-arrow ${showCountryDropdown ? "open" : ""}`}
            >
              ▼
            </span>
          </button>

          {showCountryDropdown && (
            <div className="api-dropdown-list">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearchTerm}
                onChange={(e) => setCountrySearchTerm(e.target.value)}
                className="dropdown-search-input"
                autoFocus
              />
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="api-dropdown-item"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div
                  className="api-dropdown-item"
                  style={{ color: "var(--text-muted)" }}
                >
                  No countries found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* State Dropdown */}
      <div className="form-group">
        <label>State/Province</label>
        <div className="api-dropdown">
          <button
            type="button"
            className="api-dropdown-button"
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            disabled={!selectedCountry || loadingStates}
          >
            <span>
              {selectedState ||
                (loadingStates
                  ? "Loading states..."
                  : "Select a state/province")}
            </span>
            <span
              className={`dropdown-arrow ${showStateDropdown ? "open" : ""}`}
            >
              ▼
            </span>
          </button>

          {showStateDropdown && (
            <div className="api-dropdown-list">
              <input
                type="text"
                placeholder="Search states..."
                value={stateSearchTerm}
                onChange={(e) => setStateSearchTerm(e.target.value)}
                className="dropdown-search-input"
                autoFocus
              />
              {filteredStates.map((state) => (
                <button
                  key={state.code}
                  type="button"
                  className="api-dropdown-item"
                  onClick={() => handleStateSelect(state)}
                >
                  {state.name}
                </button>
              ))}
              {filteredStates.length === 0 && (
                <div
                  className="api-dropdown-item"
                  style={{ color: "var(--text-muted)" }}
                >
                  {states.length === 0
                    ? "No states available"
                    : "No states found"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Smart Address Input Component with Location Services
const SmartAddressInput = ({
  value,
  onChange,
  placeholder = "Enter your address",
  onLocationDataUpdate = null,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Enhanced reverse geocoding with multiple service fallbacks
  const getReverseGeocodedAddress = async (latitude, longitude) => {
    console.log(`Attempting reverse geocoding for: ${latitude}, ${longitude}`);

    // Service 1: Nominatim (OpenStreetMap) - Most detailed
    try {
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=en`,
        {
          headers: {
            "User-Agent": "ArtVault-Profile-App/1.0",
          },
        }
      );

      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        console.log("Nominatim result:", nominatimData);

        if (nominatimData && nominatimData.display_name) {
          return nominatimData.display_name;
        }
      }
    } catch (error) {
      console.warn("Nominatim failed:", error);
    }

    // Service 2: BigDataCloud (Free tier, no API key needed)
    try {
      const bigDataResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (bigDataResponse.ok) {
        const bigDataResult = await bigDataResponse.json();
        console.log("BigDataCloud result:", bigDataResult);

        if (bigDataResult) {
          const addressParts = [];

          if (bigDataResult.locality) addressParts.push(bigDataResult.locality);
          if (bigDataResult.principalSubdivision)
            addressParts.push(bigDataResult.principalSubdivision);
          if (bigDataResult.countryName)
            addressParts.push(bigDataResult.countryName);

          if (addressParts.length > 0) {
            return addressParts.join(", ");
          }
        }
      }
    } catch (error) {
      console.warn("BigDataCloud failed:", error);
    }

    // Service 3: IP-API (as last resort, less accurate but works)
    try {
      const ipApiResponse = await fetch(`http://ip-api.com/json/`);

      if (ipApiResponse.ok) {
        const ipApiResult = await ipApiResponse.json();
        console.log("IP-API result:", ipApiResult);

        if (ipApiResult && ipApiResult.status === "success") {
          const addressParts = [];

          if (ipApiResult.city) addressParts.push(ipApiResult.city);
          if (ipApiResult.regionName) addressParts.push(ipApiResult.regionName);
          if (ipApiResult.country) addressParts.push(ipApiResult.country);

          if (addressParts.length > 0) {
            return `${addressParts.join(", ")} (Approximate location)`;
          }
        }
      }
    } catch (error) {
      console.warn("IP-API failed:", error);
    }

    return null;
  };

  // Auto-fill country and state based on GPS coordinates
  const autoFillLocationData = async (latitude, longitude) => {
    if (!onLocationDataUpdate) return;

    try {
      // Get detailed location data from Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=10`,
        {
          headers: {
            "User-Agent": "ArtVault-Profile-App/1.0",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Location data for auto-fill:", data);

        if (data && data.address) {
          const locationData = {};

          // Extract country
          if (data.address.country) {
            locationData.country = data.address.country;
          }

          // Extract state/province/region
          if (data.address.state) {
            locationData.state = data.address.state;
          } else if (data.address.province) {
            locationData.state = data.address.province;
          } else if (data.address.region) {
            locationData.state = data.address.region;
          } else if (data.address.county) {
            locationData.state = data.address.county;
          }

          // Update the form data if we found country or state
          if (locationData.country || locationData.state) {
            onLocationDataUpdate(locationData);
            console.log("Auto-filled location data:", locationData);
          }
        }
      }
    } catch (error) {
      console.warn("Could not auto-fill location data:", error);
    }
  };

  // Get user's current location with enhanced accuracy and error handling
  const getCurrentLocation = () => {
    setUseCurrentLocation(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by this browser. Please enter your address manually."
      );
      setUseCurrentLocation(false);
      return;
    }

    // Check if we're on HTTPS (required for geolocation in most browsers)
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      alert(
        "Location services require a secure connection (HTTPS). Please enter your address manually."
      );
      setUseCurrentLocation(false);
      return;
    }

    // Enhanced options for maximum accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 seconds timeout for maximum accuracy
      maximumAge: 0, // Always get fresh location, no cache
    };

    console.log("Starting GPS location request with high accuracy...");

    // Try to get the most accurate location possible
    let attempts = 0;
    const maxAttempts = 2;

    const tryGetLocation = () => {
      attempts++;
      console.log(`GPS attempt ${attempts}/${maxAttempts}`);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(
            `GPS Success - Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy}m`
          );

          // If accuracy is poor (>100m) and we haven't tried twice, try again
          if (accuracy > 100 && attempts < maxAttempts) {
            console.log(`Poor accuracy (${accuracy}m), trying again...`);
            setTimeout(tryGetLocation, 1000);
            return;
          }

          // Proceed with the location we have
          await processLocation(latitude, longitude, accuracy);
        },
        (error) => {
          console.error(`GPS attempt ${attempts} failed:`, error);

          if (attempts < maxAttempts) {
            console.log("Retrying GPS...");
            setTimeout(tryGetLocation, 2000);
            return;
          }

          // All attempts failed
          handleLocationError(error);
        },
        options
      );
    };

    tryGetLocation();
  };

  // Process the obtained location
  const processLocation = async (latitude, longitude, accuracy) => {
    try {
      console.log(`Processing location with ${accuracy}m accuracy`);

      // Try multiple reverse geocoding services for better accuracy
      const address = await getReverseGeocodedAddress(latitude, longitude);

      if (address) {
        onChange(address);

        // Also try to extract and auto-fill country and state
        await autoFillLocationData(latitude, longitude);

        alert(
          `✅ Location found successfully!\nAccuracy: ${Math.round(accuracy)}m`
        );
      } else {
        throw new Error("No address found for this location");
      }
    } catch (error) {
      console.error("Error processing location:", error);

      // Try alternative approach with coordinates
      const coordsAddress = `Latitude: ${latitude.toFixed(
        6
      )}, Longitude: ${longitude.toFixed(6)}`;
      const useCoords = confirm(
        `Could not get readable address. Would you like to use coordinates instead?\n\n${coordsAddress}\nAccuracy: ${Math.round(
          accuracy
        )}m`
      );

      if (useCoords) {
        onChange(coordsAddress);
      } else {
        alert("Could not get your current address. Please enter manually.");
      }
    } finally {
      setUseCurrentLocation(false);
    }
  };

  // Handle location errors
  const handleLocationError = (error) => {
    console.error("Geolocation error:", error);
    setUseCurrentLocation(false);

    let errorMessage = "Location access failed. ";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage +=
          "Permission denied. Please enable location access in your browser settings and try again.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage +=
          "Location information is unavailable. Please check your GPS/network connection.";
        break;
      case error.TIMEOUT:
        errorMessage +=
          "Location request timed out. Please try again or enter your address manually.";
        break;
      default:
        errorMessage +=
          "An unknown error occurred. Please enter your address manually.";
        break;
    }

    alert(errorMessage);
  };

  // Old code to remove
  const oldGetCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`GPS coordinates: ${latitude}, ${longitude}`);

        try {
          // Try multiple reverse geocoding services for better accuracy
          const address = await getReverseGeocodedAddress(latitude, longitude);

          if (address) {
            onChange(address);

            // Also try to extract and auto-fill country and state
            await autoFillLocationData(latitude, longitude);

            alert("✅ Location found successfully!");
          } else {
            throw new Error("No address found for this location");
          }
        } catch (error) {
          console.error("Error getting address from coordinates:", error);

          // Try alternative approach with coordinates
          const coordsAddress = `Latitude: ${latitude.toFixed(
            6
          )}, Longitude: ${longitude.toFixed(6)}`;
          const useCoords = confirm(
            `Could not get readable address. Would you like to use coordinates instead?\n\n${coordsAddress}`
          );

          if (useCoords) {
            onChange(coordsAddress);
          } else {
            alert("Could not get your current address. Please enter manually.");
          }
        } finally {
          setUseCurrentLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setUseCurrentLocation(false);

        let errorMessage = "Location access failed. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Permission denied. Please enable location access in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage +=
              "Location information is unavailable. Please check your GPS/network connection.";
            break;
          case error.TIMEOUT:
            errorMessage +=
              "Location request timed out. Please try again or enter your address manually.";
            break;
          default:
            errorMessage +=
              "An unknown error occurred. Please enter your address manually.";
            break;
        }

        alert(errorMessage);
      },
      options
    );
  };

  // Search for address suggestions using Nominatim (free) with enhanced error handling
  const searchAddresses = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&countrycodes=&dedupe=1`,
        {
          headers: {
            "User-Agent": "ArtVault-Profile-App",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const formattedSuggestions = data.map((item, index) => ({
          id: index,
          address: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: item.type || "address",
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching addresses:", error);
      setSuggestions([]);
      setShowSuggestions(false);

      // Show error message only if user has typed enough
      if (query.length > 5) {
        console.warn("Address search failed, user can still type manually");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="smart-address-input">
      <div className="address-input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="form-input address-input"
          autoComplete="address-line1"
        />
        <button
          type="button"
          className="location-button"
          onClick={getCurrentLocation}
          disabled={useCurrentLocation}
          title={
            useCurrentLocation
              ? "Getting your location..."
              : "Use current location"
          }
        >
          {useCurrentLocation ? (
            <span className="location-loading">📍</span>
          ) : (
            "🎯"
          )}
        </button>
      </div>

      {isLoading && (
        <div className="address-loading">
          <span className="loading-text">Searching addresses...</span>
        </div>
      )}

      {useCurrentLocation && (
        <div className="gps-status loading">
          <span>🛰️ Getting your precise location...</span>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="address-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="address-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">📍</span>
              <span className="suggestion-text">{suggestion.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Country Dropdown Component
const CountryDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="country-dropdown">
      <button
        type="button"
        className="country-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || "Select a country"}</span>
        <span className={`country-dropdown-arrow ${isOpen ? "open" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="country-dropdown-list">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="country-search-input"
            autoFocus
          />
          {filteredCountries.map((country) => (
            <button
              key={country}
              type="button"
              className="country-dropdown-item"
              onClick={() => handleSelect(country)}
            >
              {country}
            </button>
          ))}
          {filteredCountries.length === 0 && (
            <div
              className="country-dropdown-item"
              style={{ color: "var(--text-muted)" }}
            >
              No countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Phone Number Component with Country Code
const PhoneNumberInput = ({
  countryCode,
  phoneNumber,
  onCountryChange,
  onPhoneChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCountries = countriesWithCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
  );

  const handleCountrySelect = (country) => {
    onCountryChange(country.code);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle phone number input - only allow numbers
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    onPhoneChange(numericValue);
  };

  // Handle key press to prevent non-numeric input
  const handleKeyPress = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const selectedCountry = countriesWithCodes.find(
    (c) => c.code === countryCode
  );

  return (
    <div className="phone-input-container">
      <div className="country-code-dropdown" ref={dropdownRef}> {/* Add ref here */}
        <button
          type="button"
          className="country-code-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="country-flag">{selectedCountry?.flag || "🌍"}</span>
          <div className="country-info">
            <span className="country-code">{countryCode || "+1"}</span>
            {selectedCountry && (
              <span className="country-name-short">
                {selectedCountry.name.length > 12
                  ? selectedCountry.name.substring(0, 12) + "..."
                  : selectedCountry.name}
              </span>
            )}
          </div>
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <div className="country-code-list">
            <input
              type="text"
              placeholder="Search countries or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="country-search-input"
              autoFocus
            />
            {filteredCountries.map((country) => (
              <button
                key={country.name}
                type="button"
                className="country-code-item"
                onClick={() => handleCountrySelect(country)}
              >
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
                <span className="country-code">{country.code}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div
                className="country-code-item"
                style={{ color: "var(--text-muted)" }}
              >
                No countries found
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        onKeyDown={handleKeyPress}
        placeholder="Enter phone number"
        className="phone-number-input"
        inputMode="numeric"
        pattern="[0-9]*"
      />
    </div>
  );
};

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    country: user?.country || "",
    state: user?.state || "",
    address: user?.address || "",
    phoneCountryCode: user?.phoneCountryCode || "+1",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/auth/profile", formData);
      await loadUser(); // Refresh user data
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.msg || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || "",
      country: user?.country || "",
      state: user?.state || "",
      address: user?.address || "",
      phoneCountryCode: user?.phoneCountryCode || "+1",
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  const [activeTab, setActiveTab] = useState('edit'); // default to 'edit' for now

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>
        <div className="profile-header-info">
          <h1>{user?.name || "User"}</h1>
          <p>{user?.email}</p>
          <p className="member-since">
            Member since{" "}
            {user?.date ? new Date(user.date).toLocaleDateString() : "Unknown"}
          </p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Only show detailed info section if activeTab is 'edit' and isEditing is false */}
      {activeTab === 'edit' && !isEditing && (
        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="form-value">
                    {user?.name || "Not provided"}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="form-value">
                    {user?.email || "Not provided"}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span className="form-value">
                    {user?.age || "Not provided"}
                  </span>
                )}
              </div>

              {isEditing ? (
                <CountryStateSelector
                  selectedCountry={formData.country}
                  selectedState={formData.state}
                  onCountryChange={(country) =>
                    setFormData((prev) => ({ ...prev, country }))
                  }
                  onStateChange={(state) =>
                    setFormData((prev) => ({ ...prev, state }))
                  }
                />
              ) : (
                <>
                  <div className="form-group">
                    <label>Country</label>
                    <span className="form-value">
                      {user?.country || "Not provided"}
                    </span>
                  </div>
                  <div className="form-group">
                    <label>State/Province</label>
                    <span className="form-value">
                      {user?.state || "Not provided"}
                    </span>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Address</label>
                {isEditing ? (
                  <SmartAddressInput
                    value={formData.address}
                    onChange={(address) =>
                      setFormData((prev) => ({ ...prev, address }))
                    }
                    onLocationDataUpdate={(locationData) =>
                      setFormData((prev) => ({
                        ...prev,
                        ...locationData,
                      }))
                    }
                    placeholder="Start typing your address..."
                  />
                ) : (
                  <span className="form-value">
                    {user?.address || "Not provided"}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <PhoneInput
                    value={formData.phoneCountryCode + formData.phoneNumber}
                    onChange={(fullNumber) => {
                      // Extract country code and phone number
                      const match = fullNumber.match(/^(\+\d+)(.*)$/);
                      if (match) {
                        setFormData((prev) => ({
                          ...prev,
                          phoneCountryCode: match[1],
                          phoneNumber: match[2].trim(),
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          phoneCountryCode: "+1",
                          phoneNumber: fullNumber,
                        }));
                      }
                    }}
                    disabled={loading}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <span className="form-value phone-display">
                    {user?.phoneCountryCode && user?.phoneNumber ? (
                      <>
                        <span className="phone-country-info">
                          {countriesWithCodes.find(
                            (c) => c.code === user.phoneCountryCode
                          )?.flag || "🌍"}
                          <span className="phone-country-code">
                            {user.phoneCountryCode}
                          </span>
                        </span>
                        <span className="phone-full-number">
                          {user.phoneNumber}
                        </span>
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Artworks</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Collections</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Favorites</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Purchases</h3>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
