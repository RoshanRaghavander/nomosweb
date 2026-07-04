import { type ErrorInfo, type ReactNode, Component } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nomos web crashed', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen items-center justify-center px-6"
          style={{
            background:
              'radial-gradient(120% 130% at 0% 0%, rgba(197,232,108,0.2) 0%, transparent 38%), radial-gradient(90% 120% at 100% 0%, rgba(207,233,245,0.5) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f9faf7 100%)',
          }}
        >
          <div className="max-w-xl rounded-[32px] border border-[#e7e7ea] bg-white p-8 text-[#111114] shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Application error</p>
            <h1 className="mt-4 font-display text-3xl">The Nomos web app hit a runtime error.</h1>
            <p className="mt-4 text-sm leading-7 text-[#3c3c43]">
              Refresh the page to retry. If the problem persists, inspect the browser console and the latest deployment logs.
            </p>
            <a
              className="mt-6 inline-flex items-center rounded-full bg-[#111114] px-5 py-3 text-sm font-medium text-white"
              href="/"
            >
              Return to homepage
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
