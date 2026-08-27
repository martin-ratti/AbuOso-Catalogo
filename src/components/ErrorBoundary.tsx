import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Fatal Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-abu-light flex flex-col items-center justify-center p-4 sm:p-8 text-center font-sans">
          <div className="bg-red-100 p-5 sm:p-6 rounded-full text-red-500 mb-5 sm:mb-6">
            <AlertOctagon size={56} className="sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-abu-brown mb-3 sm:mb-4">¡Ups! Algo salió mal.</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
            Ocurrió un error inesperado en la aplicación. Nuestro equipo ya fue notificado (mentira, pero lo intentaremos arreglar pronto).
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-abu-brown hover:bg-abu-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-2 font-bold transition-all shadow-md active:scale-95 text-sm sm:text-base"
          >
            <RotateCcw size={18} className="sm:w-5 sm:h-5" /> Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
