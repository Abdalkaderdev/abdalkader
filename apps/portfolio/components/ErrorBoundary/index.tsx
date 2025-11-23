import React, { ReactNode, ReactElement } from 'react';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can also log the error message to an error reporting service here
    if (typeof window !== 'undefined') {
      // Example: send to error tracking service
      // trackError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1>Oops! Something went wrong</h1>
            <p>We're sorry for the inconvenience. An unexpected error has occurred.</p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            
            <div className={styles.actions}>
              <button 
                onClick={this.handleReset}
                className={styles.primaryBtn}
              >
                Try Again
              </button>
              <a 
                href="/"
                className={styles.secondaryBtn}
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
