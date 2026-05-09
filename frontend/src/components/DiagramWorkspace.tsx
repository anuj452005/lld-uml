"use client";

import React from 'react';
import { DiagramCanvas } from '@/features/canvas/DiagramCanvas';
import { useDiagramHydration } from '@/hooks/useDiagramHydration';
import { useAutoSave } from '@/hooks/useAutoSave';
import { ClassEditorPanel } from '@/features/class-editor/ClassEditorPanel';
import { useUIStore } from '@/stores/uiStore';
import { useUMLStore } from '@/stores/umlStore';
import { Plus } from 'lucide-react';
import { CanvasSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyCanvasState } from '@/components/ui/EmptyCanvasState';
import { WorkspaceErrorBoundary } from '@/features/error/WorkspaceErrorBoundary';
import { ParserErrorBanner } from '@/features/error/ParserErrorBanner';
import { LocalDraftRecoveryPrompt } from '@/features/recovery/LocalDraftRecoveryPrompt';

interface DiagramWorkspaceProps {
  diagramId?: string;
}

export const DiagramWorkspace: React.FC<DiagramWorkspaceProps> = ({ diagramId }) => {
  const { isLoading, isHydrated, error, hasNewerDraft, setHasNewerDraft } = useDiagramHydration(diagramId);
  
  // Activate auto-save when diagram loads
  useAutoSave(diagramId, isHydrated);

  const setClassEditorOpen = useUIStore((state) => state.setClassEditorOpen);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const diagram = useUMLStore((state) => state.diagram);

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

  const handleAddClass = () => {
    setSelectedNode(null);
    setClassEditorOpen(true);
  };

  const isEmpty = diagram && diagram.classes.length === 0 && diagram.interfaces.length === 0;

  return (
    <WorkspaceErrorBoundary>
      <main className="flex-1 bg-bg-canvas relative overflow-hidden flex flex-col">
        {isLoading ? (
          <CanvasSkeleton />
        ) : (
          <>
            <DiagramCanvas />
            {isEmpty && <EmptyCanvasState />}
            <ClassEditorPanel />
            <ParserErrorBanner />
            {diagramId && hasNewerDraft && (
              <LocalDraftRecoveryPrompt 
                diagramId={diagramId} 
                onDismiss={() => setHasNewerDraft(false)} 
              />
            )}
          </>
        )}
        
        {/* Floating Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-surface-primary border border-border-primary rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 z-30">
          <ToolbarButton label="Select" active />
          <ToolbarButton label="Add Class" icon={<Plus size={14} />} onClick={handleAddClass} />
          <ToolbarButton label="Connect" />
          <div className="w-[1px] h-4 bg-border-primary mx-1" />
          <ToolbarButton label="Auto Layout" />
        </div>
      </main>
    </WorkspaceErrorBoundary>
  );
};

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, active, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
      ${active 
        ? 'bg-accent-primary text-text-inverse' 
        : 'text-text-secondary hover:bg-bg-surface-tertiary hover:text-text-primary'}
    `}
  >
    {icon}
    {label}
  </button>
);

