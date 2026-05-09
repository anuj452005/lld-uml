"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

/**
 * PlaceholderNode
 * 
 * Temporary node renderer until Unit 5.
 * Renders a simple box with the entity name.
 */
export const PlaceholderNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`
      px-4 py-2 rounded-md border text-sm font-mono transition-all
      ${selected 
        ? 'border-accent-primary bg-bg-surface-tertiary ring-1 ring-accent-primary' 
        : 'border-border-primary bg-bg-surface-primary text-text-secondary'}
    `}>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider opacity-50">
          {data.type}
        </span>
        <span className="font-bold text-text-primary">
          {data.name}
        </span>
      </div>

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-border-active" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-border-active" />
    </div>
  );
});

PlaceholderNode.displayName = 'PlaceholderNode';
