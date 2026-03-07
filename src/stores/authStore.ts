import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { users } from '@/data/users'

interface AuthState {
  isLoggedIn: boolean
  currentUser: User | null
  login: (role: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      currentUser: null,
      login: (role) => set({ isLoggedIn: true, currentUser: users[role] }),
      logout: () => set({ isLoggedIn: false, currentUser: null }),
      switchRole: (role) => set({ currentUser: users[role] }),
    }),
    { name: 'vi-auth' },
  ),
)
