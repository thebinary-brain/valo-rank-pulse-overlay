import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted session/local state and reload cleanly
    try {
      localStorage.removeItem('valorant_stream_overlay_config');
      localStorage.removeItem('valorant_overlay_henrik_config_v4');
      sessionStorage.removeItem('valorant_overlay_henrik_config_v4');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0e14] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#151b26] border border-red-500/40 rounded-xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-[#ff4655]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">Something went wrong</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              An unexpected render error occurred. You can reset the overlay to its default state or reload.
            </p>
            {this.state.error && (
              <div className="text-[11px] font-mono bg-black/50 text-red-300 p-3 rounded-lg border border-white/5 break-words text-left max-h-32 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-[#ff4655] hover:bg-[#ff5865] text-white py-2 px-4 rounded-lg text-xs font-bold transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
