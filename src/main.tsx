import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './index.css'

const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={base}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
