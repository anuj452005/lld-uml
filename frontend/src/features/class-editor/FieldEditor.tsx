"use client";

import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { UMLField, UMLVisibility } from '@/types/uml';
import { validateField } from '@/lib/validation';

interface FieldEditorProps {
  fields: UMLField[];
  onChange: (fields: UMLField[]) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ fields, onChange }) => {
  const addField = () => {
    const newField: UMLField = {
      id: crypto.randomUUID(),
      name: 'newField',
      type: 'String',
      visibility: 'private',
      isStatic: false,
      isReadonly: false,
    };
    onChange([...fields, newField]);
  };

  const removeField = (id: string) => {
    onChange(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<UMLField>) => {
    onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Fields</h4>
        <button 
          onClick={addField}
          className="flex items-center gap-1 text-[11px] text-accent-primary hover:text-accent-primary-hover transition-colors font-medium"
        >
          <Plus size={14} />
          Add Field
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field) => (
          (() => {
            const validation = validateField(field);

            return (
          <div key={field.id} className="p-2 bg-bg-surface-tertiary rounded-md border border-border-secondary flex flex-col gap-2 group relative">
            <div className="flex gap-2">
              <select 
                value={field.visibility}
                onChange={(e) => updateField(field.id, { visibility: e.target.value as UMLVisibility })}
                className={`bg-bg-surface-secondary border ${!validation.valid && validation.error?.includes('visibility') ? 'border-status-error' : 'border-border-primary'} rounded-sm px-1 py-1 text-xs text-text-primary focus:outline-none focus:border-border-active w-12`}
              >
                <option value="public">+</option>
                <option value="private">-</option>
                <option value="protected">#</option>
                <option value="package">~</option>
              </select>
              <input 
                type="text" 
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                placeholder="field_name"
                className={`flex-1 bg-bg-surface-secondary border ${!validation.valid && validation.error?.toLowerCase().includes('name') ? 'border-status-error' : 'border-border-primary'} rounded-sm px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-border-active font-mono`}
                title={validation.valid ? '' : validation.error}
              />
            </div>
            <div className="flex gap-2 items-center">
               <input 
                type="text" 
                value={field.type}
                onChange={(e) => updateField(field.id, { type: e.target.value })}
                placeholder="Type"
                className={`flex-1 bg-bg-surface-secondary border ${!validation.valid && validation.error?.toLowerCase().includes('type') ? 'border-status-error' : 'border-border-primary'} rounded-sm px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-border-active font-mono`}
                title={validation.valid ? '' : validation.error}
              />
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={field.isStatic}
                    onChange={(e) => updateField(field.id, { isStatic: e.target.checked })}
                    className="w-3 h-3 rounded bg-bg-surface-secondary border-border-primary text-accent-primary focus:ring-0"
                  />
                  <span className="text-[10px] text-text-tertiary uppercase font-medium">Static</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={field.isReadonly}
                    onChange={(e) => updateField(field.id, { isReadonly: e.target.checked })}
                    className="w-3 h-3 rounded bg-bg-surface-secondary border-border-primary text-accent-primary focus:ring-0"
                  />
                  <span className="text-[10px] text-text-tertiary uppercase font-medium">Readonly</span>
                </label>
              </div>
              <button 
                onClick={() => removeField(field.id)}
                className="p-1 text-text-tertiary hover:text-status-error transition-colors"
                title="Remove field"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {!validation.valid && (
              <p className="text-[10px] text-status-error font-medium">{validation.error}</p>
            )}
          </div>
            );
          })()
        ))}
        {fields.length === 0 && (
          <div className="text-center py-4 border border-dashed border-border-primary rounded-md">
            <p className="text-[11px] text-text-tertiary italic">No fields defined</p>
          </div>
        )}
      </div>
    </div>
  );
};
