import { create } from 'zustand';

interface AuthState {
  token: string | null;
  profile: any | null;
  setToken: (token: string | null) => void;
  setProfile: (profile: any | null) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  profile: null,
  setToken: (token) => set({ token }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ token: null, profile: null }),
}));
