import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    // Clear all persisted state to recover from stale data
    localStorage.removeItem('vi-auth')
    localStorage.removeItem('vi-quotes')
    localStorage.removeItem('vi-chat')
    localStorage.removeItem('vi-timeline')
    localStorage.removeItem('vi-requests')
    window.location.href = import.meta.env.BASE_URL || '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">
              Something went wrong
            </h1>
            <p className="text-text-secondary">
              The application encountered an error. This may be caused by outdated saved data.
            </p>
            {this.state.error && (
              <pre className="text-xs text-danger bg-surface-raised rounded-lg p-3 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
