
import { useAuthStore } from "@/stores/authStore";

const API_URL = "http://localhost:5000/api";

// Free token for non-authenticated users
const FREE_USER_TOKEN = "free-user-token";

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

  // Authentication functions
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

  // Carbon footprint calculation
  calculator: {
    calculate: async (formData: any, isAuthenticated = false) => {
      return api.post("/calculate", formData, isAuthenticated);
    },
    
    getUserCalculations: async () => {
      return api.get("/user/calculations", true);
    },
  },
};
