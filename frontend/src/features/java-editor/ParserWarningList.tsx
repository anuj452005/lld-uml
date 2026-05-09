import React, { useState } from 'react';
import { ParserWarning } from '@/types/uml';
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ParserWarningListProps {
  warnings: ParserWarning[];
}

export const ParserWarningList: React.FC<ParserWarningListProps> = ({ warnings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (warnings.length === 0) return null;

  return (
    <div className="mt-4 border border-status-warning/30 rounded-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-status-warning/10 hover:bg-status-warning/20 transition-colors text-status-warning text-sm font-medium"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{warnings.length} Warnings</span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isExpanded && (
        <ul className="bg-bg-surface-secondary divide-y divide-border-secondary">
          {warnings.map((warning, index) => (
            <li key={index} className="p-3 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] text-status-warning uppercase tracking-wider bg-bg-surface-tertiary px-1 rounded">
                  {warning.code}
                </span>
                {warning.line !== undefined && (
                  <span className="text-text-tertiary">Line {warning.line}</span>
                )}
              </div>
              <p className="mt-1 text-text-secondary leading-normal italic">
                {warning.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
