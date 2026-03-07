import { Outlet } from 'react-router'
import { TopNav } from './TopNav'
import { Footer } from './Footer'

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
