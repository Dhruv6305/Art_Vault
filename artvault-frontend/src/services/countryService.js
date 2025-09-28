// Country and Phone Code Service
export class CountryService {
  static async getCountries() {
    try {
      // Using REST Countries API (free)
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flag,idd"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();

      return data
        .map((country) => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flag,
          phoneCode: country.idd?.root
            ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
            : null,
        }))
        .filter((country) => country.phoneCode)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // Fallback data for common countries
      return this.getFallbackCountries();
    }
  }

  static async getStates(countryCode) {
    try {
      // Using country-state-city API alternative
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        {
          headers: {
            "X-CSCAPI-KEY": "YOUR_API_KEY", // You'll need to get a free API key
          },
        }
      );

      if (!response.ok) {
        // Fallback for common countries
        return this.getFallbackStates(countryCode);
      }

      const data = await response.json();
      return data.map((state) => ({
        code: state.iso2,
        name: state.name,
      }));
    } catch (error) {
      return this.getFallbackStates(countryCode);
    }
  }

  static getFallbackCountries() {
    return [
      { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
      { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
      { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
      { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
      { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
      { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
      { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
      { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
      { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
      { code: "KR", name: "South Korea", flag: "🇰🇷", phoneCode: "+82" },
      { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
      { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
      { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
      { code: "MX", name: "Mexico", flag: "🇲🇽", phoneCode: "+52" },
      { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
      { code: "ZA", name: "South Africa", flag: "🇿🇦", phoneCode: "+27" },
      { code: "NG", name: "Nigeria", flag: "🇳🇬", phoneCode: "+234" },
      { code: "EG", name: "Egypt", flag: "🇪🇬", phoneCode: "+20" },
      {
        code: "AE",
        name: "United Arab Emirates",
        flag: "🇦🇪",
        phoneCode: "+971",
      },
      { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", phoneCode: "+966" },
    ];
  }

  static getFallbackStates(countryCode) {
    const stateData = {
      US: [
        { code: "AL", name: "Alabama" },
        { code: "AK", name: "Alaska" },
        { code: "AZ", name: "Arizona" },
        { code: "AR", name: "Arkansas" },
        { code: "CA", name: "California" },
        { code: "CO", name: "Colorado" },
        { code: "CT", name: "Connecticut" },
        { code: "DE", name: "Delaware" },
        { code: "FL", name: "Florida" },
        { code: "GA", name: "Georgia" },
        { code: "HI", name: "Hawaii" },
        { code: "ID", name: "Idaho" },
        { code: "IL", name: "Illinois" },
        { code: "IN", name: "Indiana" },
        { code: "IA", name: "Iowa" },
        { code: "KS", name: "Kansas" },
        { code: "KY", name: "Kentucky" },
        { code: "LA", name: "Louisiana" },
        { code: "ME", name: "Maine" },
        { code: "MD", name: "Maryland" },
        { code: "MA", name: "Massachusetts" },
        { code: "MI", name: "Michigan" },
        { code: "MN", name: "Minnesota" },
        { code: "MS", name: "Mississippi" },
        { code: "MO", name: "Missouri" },
        { code: "MT", name: "Montana" },
        { code: "NE", name: "Nebraska" },
        { code: "NV", name: "Nevada" },
        { code: "NH", name: "New Hampshire" },
        { code: "NJ", name: "New Jersey" },
        { code: "NM", name: "New Mexico" },
        { code: "NY", name: "New York" },
        { code: "NC", name: "North Carolina" },
        { code: "ND", name: "North Dakota" },
        { code: "OH", name: "Ohio" },
        { code: "OK", name: "Oklahoma" },
        { code: "OR", name: "Oregon" },
        { code: "PA", name: "Pennsylvania" },
        { code: "RI", name: "Rhode Island" },
        { code: "SC", name: "South Carolina" },
        { code: "SD", name: "South Dakota" },
        { code: "TN", name: "Tennessee" },
        { code: "TX", name: "Texas" },
        { code: "UT", name: "Utah" },
        { code: "VT", name: "Vermont" },
        { code: "VA", name: "Virginia" },
        { code: "WA", name: "Washington" },
        { code: "WV", name: "West Virginia" },
        { code: "WI", name: "Wisconsin" },
        { code: "WY", name: "Wyoming" },
      ],
      CA: [
        { code: "AB", name: "Alberta" },
        { code: "BC", name: "British Columbia" },
        { code: "MB", name: "Manitoba" },
        { code: "NB", name: "New Brunswick" },
        { code: "NL", name: "Newfoundland and Labrador" },
        { code: "NS", name: "Nova Scotia" },
        { code: "ON", name: "Ontario" },
        { code: "PE", name: "Prince Edward Island" },
        { code: "QC", name: "Quebec" },
        { code: "SK", name: "Saskatchewan" },
        { code: "NT", name: "Northwest Territories" },
        { code: "NU", name: "Nunavut" },
        { code: "YT", name: "Yukon" },
      ],
      AU: [
        { code: "NSW", name: "New South Wales" },
        { code: "QLD", name: "Queensland" },
        { code: "SA", name: "South Australia" },
        { code: "TAS", name: "Tasmania" },
        { code: "VIC", name: "Victoria" },
        { code: "WA", name: "Western Australia" },
        { code: "ACT", name: "Australian Capital Territory" },
        { code: "NT", name: "Northern Territory" },
      ],
    };

    return stateData[countryCode] || [];
  }

  static async searchCountries(query) {
    const countries = await this.getCountries();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.phoneCode.includes(query)
    );
  }
}
