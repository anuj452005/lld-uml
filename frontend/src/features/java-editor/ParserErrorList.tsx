import React from 'react';
import { ParserError } from '@/types/uml';
import { AlertCircle } from 'lucide-react';

interface ParserErrorListProps {
  errors: ParserError[];
}

export const ParserErrorList: React.FC<ParserErrorListProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-text-error font-semibold mb-2">
        <AlertCircle size={16} />
        <span>Parser Errors ({errors.length})</span>
      </div>
      <ul className="space-y-2">
        {errors.map((error, index) => (
          <li 
            key={index} 
            className="p-3 bg-status-error/10 border border-border-error rounded-md text-sm"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-text-error bg-bg-surface-tertiary px-1.5 py-0.5 rounded">
                {error.code}
              </span>
              {error.line !== undefined && (
                <span className="text-text-tertiary text-xs">
                  Line {error.line}{error.column !== undefined ? `:${error.column}` : ''}
                </span>
              )}
            </div>
            <p className="mt-1 text-text-primary leading-tight">
              {error.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
