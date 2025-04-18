
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => {
        console.log("Logging in user:", user);
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        console.log("Logging out user");
        // Clear calculations from localStorage when logging out for a clean slate
        localStorage.removeItem('calculations');
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: 'eco-score-auth',
    }
  )
);
