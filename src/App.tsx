import { Routes, Route } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { useAuthStore } from '@/stores/authStore'

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
      </Route>
    </Routes>
  )
}
