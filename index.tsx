
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
// Debug cleanup
console.log('Root element found:', rootElement);

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          fontFamily: 'sans-serif',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxWidth: '42rem',
            width: '100%',
            border: '1px solid #fee2e2'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dc2626' }}>Application Crashed</h1>
            <div style={{
              backgroundColor: '#0f172a',
              color: '#f1f5f9',
              padding: '1rem',
              borderRadius: '0.25rem',
              overflow: 'auto',
              maxHeight: '24rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}>
              <p style={{ marginBottom: '0.5rem', color: '#fca5a5' }}>{this.state.error?.toString()}</p>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
