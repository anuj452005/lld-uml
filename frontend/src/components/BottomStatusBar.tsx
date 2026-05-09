import React from 'react';
import { CheckCircle2, Cpu, ZoomIn } from 'lucide-react';

export const BottomStatusBar: React.FC = () => {
  return (
    <footer className="h-[28px] w-full bg-bg-surface-primary border-t border-border-primary flex items-center justify-between px-3 text-[11px] text-text-tertiary select-none z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-status-success">
          <CheckCircle2 size={12} />
          <span>Syncing: All changes saved</span>
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
