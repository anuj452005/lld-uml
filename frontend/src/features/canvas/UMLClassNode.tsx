"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { UMLVisibility, UMLField, UMLMethod } from '@/types/uml';

/**
 * Maps UMLVisibility to its symbol
 */
const getVisibilitySymbol = (visibility: UMLVisibility): string => {
  switch (visibility) {
    case 'public': return '+';
    case 'private': return '-';
    case 'protected': return '#';
    case 'package': return '~';
    default: return '+';
  }
};

interface UMLNodeData {
  name: string;
  type: 'class' | 'interface';
  fields?: UMLField[];
  methods?: UMLMethod[];
  isAbstract?: boolean;
}

/**
 * UMLClassNode
 * 
 * A custom React Flow node that renders a UML class/interface with compartments.
 */
export const UMLClassNode = memo(({ data, selected }: NodeProps<UMLNodeData>) => {
  const { name, type, fields = [], methods = [], isAbstract = false } = data;

  return (
    <div 
      className={`
        min-w-[180px] bg-diagram-node-background border border-diagram-node-border rounded-sm shadow-md
        flex flex-col text-text-primary overflow-hidden
        ${selected ? 'ring-2 ring-diagram-node-selected border-transparent' : ''}
      `}
    >
      {/* Stereotype & Title Compartment */}
      <div className="bg-bg-surface-secondary px-3 py-2 border-b border-diagram-node-border flex flex-col items-center">
        {(isAbstract || type === 'interface') && (
          <span className="text-[10px] text-text-tertiary italic uppercase tracking-tighter">
            «{type === 'interface' ? 'interface' : 'abstract'}»
          </span>
        )}
        <h3 className={`text-sm font-semibold truncate w-full text-center ${isAbstract ? 'italic' : ''}`}>
          {name}
        </h3>
      </div>

      {/* Fields Compartment */}
      {fields.length > 0 && (
        <div className="px-2 py-1.5 border-b border-diagram-node-border flex flex-col gap-0.5">
          {fields.map((field) => (
            <div key={field.id} className="font-mono text-[11px] text-text-secondary flex gap-1.5">
              <span>{getVisibilitySymbol(field.visibility)}</span>
              <span className={`flex-1 truncate ${field.isStatic ? 'underline decoration-1 underline-offset-2' : ''} ${field.isReadonly ? 'italic' : ''}`}>
                {field.name}: {field.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Methods Compartment */}
      {methods.length > 0 && (
        <div className="px-2 py-1.5 flex flex-col gap-0.5">
          {methods.map((method) => (
            <div key={method.id} className="font-mono text-[11px] text-text-secondary flex gap-1.5">
              <span>{getVisibilitySymbol(method.visibility)}</span>
              <span className={`flex-1 truncate ${method.isStatic ? 'underline decoration-1 underline-offset-2' : ''}`}>
                {method.signature || `${method.name}(): ${method.returnType}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* React Flow Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-2 !h-2 !bg-diagram-node-selected !border-diagram-node-border" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-2 !h-2 !bg-diagram-node-selected !border-diagram-node-border" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-diagram-node-selected !border-diagram-node-border" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-diagram-node-selected !border-diagram-node-border" 
      />
    </div>
  );
});

UMLClassNode.displayName = 'UMLClassNode';
