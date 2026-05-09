"use client";

import React from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useClassEditor } from './useClassEditor';
import { FieldEditor } from './FieldEditor';
import { MethodEditor } from './MethodEditor';
import { UMLVisibility } from '@/types/uml';

/**
 * ClassEditorPanel
 * 
 * Side panel for adding and editing UML classes.
 */
export const ClassEditorPanel: React.FC = () => {
  const {
    name,
    setName,
    visibility,
    setVisibility,
    isAbstract,
    setIsAbstract,
    fields,
    setFields,
    methods,
    setMethods,
    handleSave,
    handleDelete,
    handleCancel,
    isEditMode,
    isOpen
  } = useClassEditor();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-[360px] bg-bg-surface-primary border-l border-border-primary shadow-2xl z-50 flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary min-h-[56px]">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          {isEditMode ? 'Edit Class' : 'Add Class'}
        </h2>
        <button 
          onClick={handleCancel}
          className="p-1 hover:bg-bg-surface-tertiary rounded-md text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Basic Info Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-text-tertiary uppercase tracking-tight">Class Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AuthService"
              className="w-full bg-bg-surface-secondary border border-border-primary rounded-md py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-border-active font-mono transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-text-tertiary uppercase tracking-tight">Visibility</label>
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as UMLVisibility)}
                className="w-full bg-bg-surface-secondary border border-border-primary rounded-md py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-border-active transition-colors appearance-none"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="protected">Protected</option>
                <option value="package">Package</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-text-tertiary uppercase tracking-tight">Modifiers</label>
              <label className="flex items-center gap-2 h-[38px] cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isAbstract}
                  onChange={(e) => setIsAbstract(e.target.checked)}
                  className="w-4 h-4 rounded bg-bg-surface-secondary border-border-primary text-accent-primary focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Abstract</span>
              </label>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-secondary" />

        {/* Fields Section */}
        <FieldEditor fields={fields} onChange={setFields} />

        <div className="h-px bg-border-secondary" />

        {/* Methods Section */}
        <MethodEditor methods={methods} onChange={setMethods} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-primary flex flex-col gap-3">
        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-inverse py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm"
        >
          <Save size={18} />
          {isEditMode ? 'Update Class' : 'Create Class'}
        </button>
        
        {isEditMode && (
          <button 
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 bg-bg-surface-secondary hover:bg-status-error/10 border border-border-primary hover:border-status-error text-text-tertiary hover:text-status-error py-2 rounded-md text-sm font-medium transition-all"
          >
            <Trash2 size={16} />
            Delete Class
          </button>
        )}
      </div>
    </div>
  );
};
