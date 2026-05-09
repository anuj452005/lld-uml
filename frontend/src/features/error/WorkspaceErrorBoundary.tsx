"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WorkspaceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Workspace Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 h-full bg-bg-canvas flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-bg-surface-primary border border-border-primary rounded-2xl p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-status-error/10 text-status-error rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            
            <h2 className="text-xl font-bold text-text-primary mb-3">Workspace Crashed</h2>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              An unexpected rendering error occurred. This could be due to malformed diagram data or a temporary system issue.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full py-3 bg-accent-primary text-text-inverse rounded-xl font-bold hover:bg-accent-primary-hover transition-all"
              >
                <RefreshCcw size={18} />
                Reload Workspace
              </button>
              
              <Link 
                href="/workspace"
                className="flex items-center justify-center gap-2 w-full py-3 bg-bg-surface-tertiary text-text-primary border border-border-primary rounded-xl font-bold hover:bg-bg-surface-hover transition-all"
              >
                <Home size={18} />
                Back to Dashboard
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left p-4 bg-bg-surface-secondary rounded-lg border border-border-primary overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-status-error uppercase mb-2">Debug Info</p>
                <p className="text-[11px] font-mono text-text-tertiary whitespace-pre-wrap">
                  {this.state.error?.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
