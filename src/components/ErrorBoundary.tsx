import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary: Captura errores en componentes React
 * Evita que la app se bloquee completamente
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-foreground mb-2">
                    Algo salió mal
                  </h1>
                  <p className="text-sm text-muted-foreground mb-4">
                    {this.state.error?.message || 'Ha ocurrido un error inesperado'}
                  </p>
                  <details className="mb-4">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Ver detalles del error
                    </summary>
                    <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-40">
                      {this.state.error?.stack}
                    </pre>
                  </details>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={this.handleReset}
                    >
                      Reintentar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = '/'}
                    >
                      Ir al inicio
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
