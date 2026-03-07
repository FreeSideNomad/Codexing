import { Routes, Route } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { NewRequestPage } from '@/pages/NewRequestPage'
import { BundlesPage } from '@/pages/BundlesPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { ReorderPage } from '@/pages/ReorderPage'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { TermsPage } from '@/pages/TermsPage'
import { PaymentPage } from '@/pages/PaymentPage'
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
        <Route path="request/new" element={<NewRequestPage />} />
        <Route path="bundles" element={<BundlesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id/reorder" element={<ReorderPage />} />
        <Route path="workspace/:quoteId" element={<WorkspacePage />} />
        <Route path="workspace/:quoteId/terms" element={<TermsPage />} />
        <Route path="workspace/:quoteId/payment" element={<PaymentPage />} />
      </Route>
    </Routes>
  )
}
