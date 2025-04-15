
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

const API_URL = "http://localhost:5000/api";

// Free token for non-authenticated users
const FREE_USER_TOKEN = "free-user-token";

// Mock calculation function for when the API is not available
const mockCalculation = (formData: any) => {
  const { transportData, electricityData, wasteData, foodData } = formData;
  
  console.log("Beginning mock calculation with data:", formData);
  
  // Calculate transport emissions with fixed calculation
  const transportEmissions = transportData.reduce((total: number, item: any) => {
    if (!item.distance || isNaN(Number(item.distance)) || Number(item.distance) <= 0) {
      console.log("Skipping invalid transport item:", item);
      return total;
    }
    
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
    
    const itemEmission = distance * emissionFactor;
    console.log(`Transport calculation: ${distance} km × ${emissionFactor} = ${itemEmission} kg CO2`);
    return total + itemEmission;
  }, 0);
  
  // Calculate electricity emissions with fixed calculation
  const electricityEmissions = electricityData.reduce((total: number, item: any) => {
    if (!item.consumption || isNaN(Number(item.consumption)) || Number(item.consumption) <= 0) {
      console.log("Skipping invalid electricity item:", item);
      return total;
    }
    
    const consumption = Number(item.consumption);
    const itemEmission = consumption * 0.5; // kWh to kg CO2
    console.log(`Electricity calculation: ${consumption} kWh × 0.5 = ${itemEmission} kg CO2`);
    return total + itemEmission;
  }, 0);
  
  // Calculate waste emissions
  const wasteEmissions = wasteData.reduce((total: number, item: any) => {
    if (!item.garbageBags || isNaN(Number(item.garbageBags)) || Number(item.garbageBags) <= 0) {
      console.log("Skipping invalid waste item:", item);
      return total;
    }
    
    const bags = Number(item.garbageBags);
    const itemEmission = bags * 10; // Bags to kg CO2
    console.log(`Waste calculation: ${bags} bags × 10 = ${itemEmission} kg CO2`);
    return total + itemEmission;
  }, 0);
  
  // Calculate food emissions
  const foodEmissions = foodData.reduce((total: number, item: any) => {
    if (!item.moneySpent || isNaN(Number(item.moneySpent)) || Number(item.moneySpent) <= 0) {
      console.log("Skipping invalid food item:", item);
      return total;
    }
    
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
    
    const itemEmission = spent * factor;
    console.log(`Food calculation: $${spent} × ${factor} = ${itemEmission} kg CO2`);
    return total + itemEmission;
  }, 0);
  
  // Calculate total and percentages
  const total = transportEmissions + electricityEmissions + wasteEmissions + foodEmissions;
  
  console.log("Total emissions calculated:", total);
  
  // Avoid division by zero
  const getPercentage = (value: number) => total === 0 ? 0 : Math.round((value / total) * 100);
  
  // Generate the final result
  const result = {
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
  
  console.log("Final calculation result:", result);
  return result;
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
        // Validate email format before sending to Supabase
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address with a proper domain (e.g., example@domain.com)");
        }

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
        console.log("Calculator received form data:", formData);
        
        const validFormData = {
          transportData: Array.isArray(formData.transportData) ? formData.transportData : [],
          electricityData: Array.isArray(formData.electricityData) ? formData.electricityData : [],
          wasteData: Array.isArray(formData.wasteData) ? formData.wasteData : [],
          foodData: Array.isArray(formData.foodData) ? formData.foodData : []
        };
        
        try {
          console.log("Attempting to use API for calculation");
          const apiResult = await api.post("/calculate", validFormData, isAuthenticated);
          console.log("API calculation result:", apiResult);
          
          if (apiResult && typeof apiResult === 'object' && 'total' in apiResult) {
            return apiResult;
          }
          throw new Error("API did not return valid calculation results");
        } catch (apiError) {
          console.log("API calculation failed, using mock calculation instead:", apiError);
          
          const mockResult = mockCalculation(validFormData);
          
          if (isAuthenticated) {
            const calculationId = `calc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const userId = useAuthStore.getState().user?.id;
            
            if (!userId) {
              console.error("No user ID found for calculation storage");
              return mockResult;
            }
            
            const newCalculation = {
              _id: calculationId,
              user_id: userId,
              created_at: new Date().toISOString(),
              result_data: mockResult,
              input_data: validFormData
            };

            // Get existing calculations from localStorage
            const existingData = localStorage.getItem('calculations') || '[]';
            let calculations = [];
            
            try {
              calculations = JSON.parse(existingData);
              if (!Array.isArray(calculations)) {
                console.error("Invalid calculations format in localStorage");
                calculations = [];
              }
            } catch (e) {
              console.error("Error parsing calculations from localStorage:", e);
              calculations = [];
            }
            
            // Add the new calculation and save back to localStorage
            calculations.push(newCalculation);
            localStorage.setItem('calculations', JSON.stringify(calculations));
            
            console.log("Stored new calculation for user:", userId, newCalculation);
          }
          
          return mockResult;
        }
      } catch (error) {
        console.error("Calculation failed:", error);
        throw error;
      }
    },
    
    getUserCalculations: async () => {
      try {
        // Get current user's ID
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          console.error("No user ID found when fetching calculations");
          return [];
        }
        
        console.log("Fetching calculations for user ID:", userId);
        
        try {
          return await api.get("/user/calculations", true);
        } catch (apiError) {
          console.log("API getUserCalculations failed, using localStorage instead");
          
          // Get all calculations from localStorage
          const existingData = localStorage.getItem('calculations') || '[]';
          let allCalculations = [];
          
          try {
            allCalculations = JSON.parse(existingData);
            if (!Array.isArray(allCalculations)) {
              console.error("Invalid calculations format in localStorage");
              return [];
            }
          } catch (e) {
            console.error("Error parsing calculations from localStorage:", e);
            return [];
          }
          
          console.log("All calculations in localStorage:", allCalculations);
          
          // Filter calculations for the current user
          const userCalculations = allCalculations
            .filter((calc: any) => {
              if (!calc) return false;
              
              const isUserCalc = calc.user_id === userId;
              const hasValidData = calc.result_data && calc.result_data.total != null;
              
              if (!isUserCalc) {
                console.log("Skipping calculation for different user:", calc.user_id);
              }
              if (!hasValidData) {
                console.log("Skipping calculation with invalid data:", calc);
              }
              
              return isUserCalc && hasValidData;
            })
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          console.log("Retrieved user calculations from localStorage:", userCalculations);
          return userCalculations;
        }
      } catch (error) {
        console.error("Get user calculations failed:", error);
        throw error;
      }
    },
  },
};
