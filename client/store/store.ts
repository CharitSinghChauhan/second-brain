import { create } from "zustand";

interface IUser {
  email: string;
  username: string;
}

type AuthStoreType = {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreType>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: !!user,
    })),

  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));

