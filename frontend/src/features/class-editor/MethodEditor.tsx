"use client";

import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { UMLMethod, UMLVisibility } from '@/types/uml';
import { validateMethodSignature, parseMethodSignature } from '@/lib/validation';

interface MethodEditorProps {
  methods: UMLMethod[];
  onChange: (methods: UMLMethod[]) => void;
}

export const MethodEditor: React.FC<MethodEditorProps> = ({ methods, onChange }) => {
  const addMethod = () => {
    const newMethod: UMLMethod = {
      id: crypto.randomUUID(),
      signature: 'newMethod(): void',
      name: 'newMethod',
      parameters: [],
      returnType: 'void',
      visibility: 'public',
      isStatic: false,
      isAbstract: false,
    };
    onChange([...methods, newMethod]);
  };

  const removeMethod = (id: string) => {
    onChange(methods.filter(m => m.id !== id));
  };

  const updateMethod = (id: string, updates: Partial<UMLMethod>) => {
    const updatedMethods = methods.map(m => {
      if (m.id === id) {
        const newMethod = { ...m, ...updates };
        // If signature changed, re-parse name, params, and return type
        if (updates.signature !== undefined) {
          const validation = validateMethodSignature(updates.signature);
          if (validation.valid) {
            const parsed = parseMethodSignature(updates.signature);
            return { ...newMethod, ...parsed };
          }
        }
        return newMethod;
      }
      return m;
    });
    onChange(updatedMethods);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Methods</h4>
        <button 
          onClick={addMethod}
          className="flex items-center gap-1 text-[11px] text-accent-primary hover:text-accent-primary-hover transition-colors font-medium"
        >
          <Plus size={14} />
          Add Method
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {methods.map((method) => (
          (() => {
            const validation = validateMethodSignature(method.signature);

            return (
          <div key={method.id} className="p-2 bg-bg-surface-tertiary rounded-md border border-border-secondary flex flex-col gap-2 group relative">
            <div className="flex gap-2">
              <select 
                value={method.visibility}
                onChange={(e) => updateMethod(method.id, { visibility: e.target.value as UMLVisibility })}
                className="bg-bg-surface-secondary border border-border-primary rounded-sm px-1 py-1 text-xs text-text-primary focus:outline-none focus:border-border-active w-12"
              >
                <option value="public">+</option>
                <option value="private">-</option>
                <option value="protected">#</option>
                <option value="package">~</option>
              </select>
              <input 
                type="text" 
                value={method.signature}
                onChange={(e) => updateMethod(method.id, { signature: e.target.value })}
                placeholder="methodName(p: Type): ReturnType"
                className={`flex-1 bg-bg-surface-secondary border ${!validation.valid ? 'border-status-error' : 'border-border-primary'} rounded-sm px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-border-active font-mono`}
                title={validation.error || ''}
              />
            </div>
            <div className="flex gap-4 items-center pl-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={method.isStatic}
                  onChange={(e) => updateMethod(method.id, { isStatic: e.target.checked })}
                  className="w-3 h-3 rounded bg-bg-surface-secondary border-border-primary text-accent-primary focus:ring-0"
                />
                <span className="text-[10px] text-text-tertiary uppercase font-medium">Static</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={method.isAbstract}
                  onChange={(e) => updateMethod(method.id, { isAbstract: e.target.checked })}
                  className="w-3 h-3 rounded bg-bg-surface-secondary border-border-primary text-accent-primary focus:ring-0"
                />
                <span className="text-[10px] text-text-tertiary uppercase font-medium">Abstract</span>
              </label>
              <button 
                onClick={() => removeMethod(method.id)}
                className="ml-auto p-1 text-text-tertiary hover:text-status-error transition-colors"
                title="Remove method"
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
        {methods.length === 0 && (
          <div className="text-center py-4 border border-dashed border-border-primary rounded-md">
            <p className="text-[11px] text-text-tertiary italic">No methods defined</p>
          </div>
        )}
      </div>
    </div>
  );
};
