"use client";

import React from 'react';
import { History, ArrowRight, X } from 'lucide-react';
import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { LocalDraftManager } from '@repo/persistence';

interface LocalDraftRecoveryPromptProps {
  diagramId: string;
  onDismiss: () => void;
}

export const LocalDraftRecoveryPrompt: React.FC<LocalDraftRecoveryPromptProps> = ({ diagramId, onDismiss }) => {
  const { setDiagram } = useUMLStore();
  const { setNodes } = useLayoutStore();

  const handleRecover = () => {
    const draft = LocalDraftManager.getDraft(diagramId);
    if (draft && draft.data) {
      setDiagram(draft.data);
      if (draft.data.layout?.nodes) {
        setNodes(draft.data.layout.nodes);
      }
    }
    onDismiss();
  };

  return (
    <div className="fixed top-20 right-6 z-[60] w-[320px] animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="bg-bg-surface-primary border border-accent-primary/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 bg-accent-primary/5 border-b border-accent-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-primary font-bold text-xs uppercase tracking-wider">
            <History size={14} />
            Unsaved Draft Found
          </div>
          <button 
            onClick={onDismiss}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            We found unsaved changes in your local browser storage that are newer than the server version. Would you like to restore them?
          </p>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={handleRecover}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent-primary text-text-inverse rounded-xl text-xs font-bold hover:bg-accent-primary-hover transition-all group"
            >
              Restore Changes
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onDismiss}
              className="w-full py-2.5 bg-bg-surface-tertiary text-text-tertiary rounded-xl text-xs font-bold hover:bg-bg-surface-hover hover:text-text-primary transition-all"
            >
              Discard Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
