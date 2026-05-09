"use client";

import React from 'react';
import { CheckCircle2, Cpu, ZoomIn, AlertCircle, Loader2 } from 'lucide-react';
import { usePersistenceStore } from '@/stores/persistenceStore';

export const BottomStatusBar: React.FC = () => {
  const saveStatus = usePersistenceStore((state) => state.saveStatus);
  const errorMessage = usePersistenceStore((state) => state.errorMessage);

  const getStatusIcon = () => {
    if (errorMessage) return <AlertCircle size={12} />;
    if (saveStatus === 'saving') return <Loader2 size={12} className="animate-spin" />;
    if (saveStatus === 'saved') return <CheckCircle2 size={12} />;
    return <CheckCircle2 size={12} />;
  };

  const getStatusText = () => {
    if (errorMessage) return `Save Error: ${errorMessage}`;
    if (saveStatus === 'saving') return 'Saving...';
    if (saveStatus === 'saved') return 'All changes saved';
    if (saveStatus === 'dirty') return 'Unsaved changes';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (errorMessage) return 'text-status-error';
    if (saveStatus === 'saving') return 'text-status-warning';
    if (saveStatus === 'saved') return 'text-status-success';
    return 'text-text-tertiary';
  };

  return (
    <footer className="h-[28px] w-full bg-bg-surface-primary border-t border-border-primary flex items-center justify-between px-3 text-[11px] text-text-tertiary select-none z-50">
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu size={12} />
          <span>Parser: Idle</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span>Untitled Diagram</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-text-secondary cursor-pointer transition-colors">
          <ZoomIn size={12} />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>UTF-8</span>
        </div>
      </div>
    </footer>
  );
};
