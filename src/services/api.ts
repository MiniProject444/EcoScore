
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

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

      // Try to use the real API first
      try {
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
        console.log("API call failed, attempting to use Supabase");
        // If the API call fails, try to use Supabase
        // This is a placeholder and would need to be implemented based on the specific endpoints
        return { message: "Using Supabase as fallback" };
      }
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

      // Try to use the real API first
      try {
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
        console.log("API call failed, attempting to use Supabase");
        // If the API call fails, try to use Supabase
        // This is a placeholder and would need to be implemented based on the specific endpoints
        return { message: "Using Supabase as fallback" };
      }
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  auth: {
    login: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        return {
          user: {
            id: data.user.id,
            name: data.user.user_metadata.name || 'User',
            email: data.user.email || '',
          },
          token: data.session?.access_token || null,
        };
      } catch (error) {
        console.error("Login Error:", error);
        throw error;
      }
    },

    signup: async (name: string, email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });

        if (error) {
          throw error;
        }

        return {
          user: {
            id: data.user?.id || '',
            name,
            email: data.user?.email || '',
          },
          token: data.session?.access_token || null,
        };
      } catch (error) {
        console.error("Signup Error:", error);
        throw error;
      }
    },

    profile: async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.user.id,
        name: data.user.user_metadata.name || 'User',
        email: data.user.email || '',
      };
    },
  },

  calculator: {
    calculate: async (formData: any, isAuthenticated = false) => {
      try {
        // First try to use the API
        try {
          return await api.post("/calculate", formData, isAuthenticated);
        } catch (error) {
          console.log("API calculation failed, using mock calculation instead");
          // If API fails, try to store calculation in Supabase
          const result = mockCalculation(formData);
          
          // If authenticated, store the result in Supabase
          if (isAuthenticated) {
            const { error } = await supabase
              .from('calculations')
              .insert({
                user_id: useAuthStore.getState().user?.id,
                input_data: formData,
                result_data: result
              });
            
            if (error) {
              console.error("Failed to store calculation in Supabase:", error);
            }
          }
          
          return result;
        }
      } catch (error) {
        console.error("Calculation failed:", error);
        return mockCalculation(formData);
      }
    },
    
    getUserCalculations: async () => {
      try {
        // Try to use the API first
        try {
          return await api.get("/user/calculations", true);
        } catch (error) {
          console.log("API getUserCalculations failed, using Supabase instead");
          // If API fails, try to get calculations from Supabase
          const { data, error } = await supabase
            .from('calculations')
            .select('*')
            .eq('user_id', useAuthStore.getState().user?.id);
            
          if (error) {
            throw error;
          }
          
          return data;
        }
      } catch (error) {
        console.error("Get user calculations failed:", error);
        throw error;
      }
    },
  },
};
