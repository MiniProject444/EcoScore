import { useAuthStore } from "@/stores/authStore";

const API_URL = "http://localhost:5000/api";

// Free token for non-authenticated users
const FREE_USER_TOKEN = "free-user-token";

// Mock calculation function for when the API is not available
const mockCalculation = (formData: any) => {
  const { transportData, electricityData, wasteData, foodData } = formData;
  
  // Calculate transport emissions
  const transportEmissions = transportData.reduce((total: number, item: any) => {
    if (!item.distance || isNaN(Number(item.distance)) || Number(item.distance) <= 0) return total;
    
    let emissionFactor = 0;
    switch (item.transportType) {
      case 'car':
        emissionFactor = item.vehicleType === 'small' ? 0.15 : item.vehicleType === 'medium' ? 0.2 : 0.3;
        break;
      case 'bus':
        emissionFactor = 0.1;
        break;
      case 'train':
        emissionFactor = 0.05;
        break;
      case 'plane':
        emissionFactor = item.travelClass === 'economy' ? 0.25 : item.travelClass === 'business' ? 0.5 : 0.75;
        break;
    }
    
    let distance = Number(item.distance);
    if (item.distanceUnit === 'miles') {
      distance *= 1.60934; // Convert miles to km
    }
    
    return total + (distance * emissionFactor);
  }, 0);
  
  // Calculate electricity emissions
  const electricityEmissions = electricityData.reduce((total: number, item: any) => {
    if (!item.consumption || isNaN(Number(item.consumption)) || Number(item.consumption) <= 0) return total;
    
    const consumption = Number(item.consumption);
    return total + (consumption * 0.5); // kWh to kg CO2
  }, 0);
  
  // Calculate waste emissions
  const wasteEmissions = wasteData.reduce((total: number, item: any) => {
    if (!item.garbageBags || isNaN(Number(item.garbageBags)) || Number(item.garbageBags) <= 0) return total;
    
    const bags = Number(item.garbageBags);
    return total + (bags * 10); // Bags to kg CO2
  }, 0);
  
  // Calculate food emissions
  const foodEmissions = foodData.reduce((total: number, item: any) => {
    if (!item.moneySpent || isNaN(Number(item.moneySpent)) || Number(item.moneySpent) <= 0) return total;
    
    const spent = Number(item.moneySpent);
    let factor = 0;
    
    switch (item.eateryType) {
      case 'homeCooked':
        factor = 0.5;
        break;
      case 'fastFood':
        factor = 1.2;
        break;
      case 'restaurant':
        factor = 2;
        break;
    }
    
    return total + (spent * factor);
  }, 0);
  
  // Calculate total and percentages
  const total = transportEmissions + electricityEmissions + wasteEmissions + foodEmissions;
  
  // Avoid division by zero
  const getPercentage = (value: number) => total === 0 ? 0 : Math.round((value / total) * 100);
  
  return {
    total: Math.round(total * 10) / 10, // Round to 1 decimal place
    breakdown: {
      transport: { 
        emissions: Math.round(transportEmissions * 10) / 10, 
        percentage: getPercentage(transportEmissions)
      },
      electricity: { 
        emissions: Math.round(electricityEmissions * 10) / 10, 
        percentage: getPercentage(electricityEmissions)
      },
      waste: { 
        emissions: Math.round(wasteEmissions * 10) / 10, 
        percentage: getPercentage(wasteEmissions)
      },
      food: { 
        emissions: Math.round(foodEmissions * 10) / 10, 
        percentage: getPercentage(foodEmissions)
      }
    }
  };
};

export const api = {
  get: async (endpoint: string, requireAuth = true) => {
    try {
      const token = useAuthStore.getState().token || (requireAuth ? null : FREE_USER_TOKEN);
      if (requireAuth && !token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      return await response.json();
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any, requireAuth = true) => {
    try {
      const token = useAuthStore.getState().token || (requireAuth ? null : FREE_USER_TOKEN);
      if (requireAuth && !token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      return await response.json();
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  auth: {
    login: async (email: string, password: string) => {
      try {
        const response = await fetch(`${API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Login failed");
        }

        return await response.json();
      } catch (error) {
        console.error("Login Error:", error);
        throw error;
      }
    },

    signup: async (name: string, email: string, password: string) => {
      try {
        const response = await fetch(`${API_URL}/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Signup failed");
        }

        return await response.json();
      } catch (error) {
        console.error("Signup Error:", error);
        throw error;
      }
    },

    profile: async () => {
      return api.get("/user/profile", true);
    },
  },

  calculator: {
    calculate: async (formData: any, isAuthenticated = false) => {
      try {
        // First try to use the API
        return await api.post("/calculate", formData, isAuthenticated);
      } catch (error) {
        console.log("API calculation failed, using mock calculation instead");
        // If API fails, use our mock calculation
        return mockCalculation(formData);
      }
    },
    
    getUserCalculations: async () => {
      return api.get("/user/calculations", true);
    },
  },
};
