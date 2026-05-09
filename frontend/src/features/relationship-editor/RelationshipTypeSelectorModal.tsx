"use client";

import React from 'react';
import { X } from 'lucide-react';
import { UMLRelationshipType } from '@/types/uml';

interface RelationshipTypeSelectorModalProps {
  isOpen: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSelect: (type: UMLRelationshipType) => void;
}

const RELATIONSHIP_OPTIONS: Array<{
  type: UMLRelationshipType;
  label: string;
  preview: string;
}> = [
  { type: 'association', label: 'Association', preview: '──▷' },
  { type: 'inheritance', label: 'Inheritance', preview: '──△' },
  { type: 'realization', label: 'Realization', preview: '- -△' },
  { type: 'aggregation', label: 'Aggregation', preview: '◇──▷' },
  { type: 'composition', label: 'Composition', preview: '◆──▷' },
  { type: 'dependency', label: 'Dependency', preview: '- -▷' },
];

export const RelationshipTypeSelectorModal: React.FC<RelationshipTypeSelectorModalProps> = ({
  isOpen,
  errorMessage,
  onCancel,
  onSelect,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-overlay px-4">
      <div className="w-full max-w-[400px] rounded-xl border border-border-primary bg-bg-surface-primary shadow-lg">
        <div className="flex items-center justify-between border-b border-border-primary px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
            Select Relationship Type
          </h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-bg-surface-tertiary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4">
          {RELATIONSHIP_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className="flex flex-col items-start gap-2 rounded-md border border-border-primary bg-bg-surface-secondary px-3 py-3 text-left transition-colors hover:border-border-active hover:bg-bg-surface-tertiary"
            >
              <span className="text-[11px] font-medium uppercase tracking-tight text-text-secondary">
                {option.label}
              </span>
              <span className="font-mono text-xs text-text-primary">{option.preview}</span>
            </button>
          ))}
        </div>

        {errorMessage ? (
          <div className="px-4 pb-2 text-[11px] text-text-error">{errorMessage}</div>
        ) : null}

        <div className="border-t border-border-primary px-4 py-3">
          <button
            onClick={onCancel}
            className="w-full rounded-md border border-border-primary bg-bg-surface-secondary px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-surface-tertiary hover:text-text-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};