"use client";

import React from 'react';
import { DiagramCanvas } from '@/features/canvas/DiagramCanvas';
import { useDiagramHydration } from '@/hooks/useDiagramHydration';

interface DiagramWorkspaceProps {
  diagramId?: string;
}

export const DiagramWorkspace: React.FC<DiagramWorkspaceProps> = ({ diagramId }) => {
  const { isLoading, error } = useDiagramHydration(diagramId);

  if (error) {
    return (
      <main className="flex-1 bg-bg-canvas flex items-center justify-center p-8">
        <div className="bg-bg-surface-primary border border-status-error rounded-lg p-6 max-w-md text-center">
          <h3 className="text-text-error font-bold mb-2">Error Loading Diagram</h3>
          <p className="text-text-secondary text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-bg-surface-tertiary hover:bg-bg-surface-secondary border border-border-primary rounded-md text-text-primary text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-bg-canvas relative overflow-hidden flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <DiagramCanvas />
      )}
      
      {/* Floating Toolbar Placeholder (to be integrated in Unit 5) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-surface-primary border border-border-primary rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 z-30">
        <ToolbarButton label="Select" active />
        <ToolbarButton label="Add Class" />
        <ToolbarButton label="Connect" />
        <div className="w-[1px] h-4 bg-border-primary mx-1" />
        <ToolbarButton label="Auto Layout" />
      </div>
    </main>
  );
};

const ToolbarButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`
    px-3 py-1.5 rounded-md text-xs font-medium transition-colors
    ${active 
      ? 'bg-accent-primary text-text-inverse' 
      : 'text-text-secondary hover:bg-bg-surface-tertiary hover:text-text-primary'}
  `}>
    {label}
  </button>
);

