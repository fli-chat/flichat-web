import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum AuthStatus {
  authorized,
  pending,
  unauthorized,
}

export interface AuthState {
  authStatus: AuthStatus;
  setAuthStatus: (value: AuthStatus) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      authStatus: AuthStatus.pending,
      setAuthStatus: (value: AuthStatus) => set(() => ({ authStatus: value })),
    }),
    {
      name: 'authStore',
    }
  )
);

export default useAuthStore;
