import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error occurred.'
    };
  }

  componentDidCatch(error, info) {
    console.error('[VERILENS Render Error]:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0d0e12] text-[#fcfcfc]">
          <div className="max-w-lg w-full rounded-3xl bg-[#161922] border border-[#27272a] p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h1 className="text-lg font-bold">VERILENS UI Recovery Notice</h1>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              A client rendering error occurred: <code className="font-mono text-red-300">{this.state.errorMessage}</code>
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary text-sm px-5 py-2.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Interface</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
