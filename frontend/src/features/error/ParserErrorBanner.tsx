import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useParserStore } from '@/stores/parserStore';

export const ParserErrorBanner: React.FC = () => {
  const { status, errors, clearResult } = useParserStore();

  if (status !== 'error' || errors.length === 0) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-status-error text-text-inverse px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 border border-white/10">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold mb-0.5">Parsing Failed</p>
          <p className="text-xs opacity-90 truncate">
            {errors[0].message}
            {errors.length > 1 && ` (and ${errors.length - 1} more errors)`}
          </p>
        </div>
        <button 
          onClick={() => clearResult()}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
