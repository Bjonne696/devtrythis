import React from 'react';
import {
  ErrorWrapper as ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  RetryButton
} from '../../styles/ui/errorBoundaryStyles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Noe gikk galt</ErrorTitle>
          <ErrorMessage>
            {this.props.fallbackMessage || 'En uventet feil oppstod. Prøv å laste siden på nytt.'}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Prøv igjen
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;