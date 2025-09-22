// GPS Location Service
export class LocationService {
  static async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  static async reverseGeocode(latitude, longitude) {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
      const address = data.address || {};

      const streetNumber = address.house_number || "";
      const streetName = address.road || "";
      const street = [streetNumber, streetName].filter(Boolean).join(" ");

      return {
        fullAddress: data.display_name || "Address not found",
        houseNumber: streetNumber,
        road: streetName,
        street: street,
        apartment: address.unit || address.apartment || "",
        city: address.city || address.town || address.village || "",
        state: address.state || address.province || "",
        county: address.county || "",
        country: address.country || "",
        countryCode: address.country_code?.toUpperCase() || "",
        postcode: address.postcode || "",
        zipCode: address.postcode || "",
        neighbourhood: address.neighbourhood || address.suburb || "",
        landmark: address.amenity || address.shop || "",
      };
    } catch (error) {
      throw new Error("Failed to get address from coordinates");
    }
  }

  static async getLocationAndAddress() {
    try {
      const position = await this.getCurrentPosition();
      const address = await this.reverseGeocode(
        position.latitude,
        position.longitude
      );

      return {
        coordinates: position,
        address: address,
      };
    } catch (error) {
      throw error;
    }
  }
}
