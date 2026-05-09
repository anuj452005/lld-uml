import React from 'react';
import { Plus, MousePointer2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export const EmptyCanvasState: React.FC = () => {
  const setClassEditorOpen = useUIStore((state) => state.setClassEditorOpen);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);

  const handleAddClass = () => {
    setSelectedNode(null);
    setClassEditorOpen(true);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="max-w-md w-full p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-bg-surface-secondary border border-border-primary rounded-3xl flex items-center justify-center text-text-tertiary mb-6 rotate-3 shadow-xl">
          <MousePointer2 size={40} className="-rotate-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-3">Empty Canvas</h2>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          Your diagram is ready for design. You can start by adding a class manually or importing Java code from the left sidebar.
        </p>

        <button 
          onClick={handleAddClass}
          className="pointer-events-auto flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-text-inverse px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-accent-primary/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} strokeWidth={3} />
          Create First Class
        </button>
        
        <div className="mt-12 flex items-center gap-6 text-text-tertiary text-[11px] font-medium uppercase tracking-widest opacity-50">
          <span>Manual Editing</span>
          <div className="w-1 h-1 bg-text-tertiary rounded-full" />
          <span>Java Import</span>
        </div>
      </div>
    </div>
  );
};
