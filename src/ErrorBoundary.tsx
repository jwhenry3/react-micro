import { Component, FC, ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ fallback: FC, name: string }, { hasError: boolean, error: any }> {
  constructor(props: { fallback: FC; name: string; } | Readonly<{ fallback: FC; name: string; }>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.warn(error, errorInfo)
  }

  componentDidUpdate(prevProps: Readonly<{ fallback: FC; name: string }>, _prevState: Readonly<{ hasError: boolean }>, _snapshot?: any): void {
    if (prevProps.name !== this.props.name) {
      this.setState({ hasError: false, error: null })
    }
  }


  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback({ error: this.state.error } as any)
    }

    return this.props.children
  }
}
