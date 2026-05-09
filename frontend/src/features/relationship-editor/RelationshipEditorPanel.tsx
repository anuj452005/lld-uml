"use client";

import React from 'react';
import { Trash2, X, Save } from 'lucide-react';
import { UMLRelationshipType } from '@/types/uml';

interface RelationshipEditorPanelProps {
  isOpen: boolean;
  type: UMLRelationshipType;
  label: string;
  errorMessage?: string | null;
  onTypeChange: (type: UMLRelationshipType) => void;
  onLabelChange: (label: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

const RELATIONSHIP_TYPES: UMLRelationshipType[] = [
  'association',
  'inheritance',
  'realization',
  'aggregation',
  'composition',
  'dependency',
];

export const RelationshipEditorPanel: React.FC<RelationshipEditorPanelProps> = ({
  isOpen,
  type,
  label,
  errorMessage,
  onTypeChange,
  onLabelChange,
  onSave,
  onDelete,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 z-50 flex h-full w-[360px] flex-col border-l border-border-primary bg-bg-surface-primary shadow-2xl transition-transform duration-300">
      <div className="flex min-h-[56px] items-center justify-between border-b border-border-primary p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          Edit Relationship
        </h2>
        <button
          onClick={onCancel}
          className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-bg-surface-tertiary hover:text-text-primary"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-tight text-text-tertiary">
            Type
          </label>
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value as UMLRelationshipType)}
            className="w-full rounded-md border border-border-primary bg-bg-surface-secondary px-3 py-2 text-sm text-text-primary transition-colors focus:border-border-active focus:outline-none"
          >
            {RELATIONSHIP_TYPES.map((relationshipType) => (
              <option key={relationshipType} value={relationshipType}>
                {relationshipType}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-tight text-text-tertiary">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(event) => onLabelChange(event.target.value)}
            placeholder="Optional label"
            className="w-full rounded-md border border-border-primary bg-bg-surface-secondary px-3 py-2 font-mono text-sm text-text-primary transition-colors focus:border-border-active focus:outline-none"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-md border border-status-error/40 bg-status-error/10 px-3 py-2 text-xs text-text-error">
            {errorMessage}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-border-primary p-4">
        <button
          onClick={onSave}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-primary-hover"
        >
          <Save size={18} />
          Save
        </button>

        <button
          onClick={onDelete}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border-primary bg-bg-surface-secondary px-4 py-2 text-sm font-medium text-text-tertiary transition-all hover:border-status-error hover:bg-status-error/10 hover:text-status-error"
        >
          <Trash2 size={16} />
          Delete Relationship
        </button>

        <button
          onClick={onCancel}
          className="w-full rounded-md border border-border-primary bg-bg-surface-secondary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-surface-tertiary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};