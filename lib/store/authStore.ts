import { create } from 'zustand';
import type { User } from '@/types/user';

//===========================================================================

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
};

//===========================================================================

export const useAuthStore = create<AuthStore>()(set => ({
  isAuthenticated: false,
  user: null,

  setUser: user =>
    set(() => ({
      user,
      isAuthenticated: Boolean(user),
    })),

  clearIsAuthenticated: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));


