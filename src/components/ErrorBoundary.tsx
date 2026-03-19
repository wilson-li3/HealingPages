import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '2rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>We're sorry — please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '0.75rem 2rem', background: '#f5c542', color: '#0d1117', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
