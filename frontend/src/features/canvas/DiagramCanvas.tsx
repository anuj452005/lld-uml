"use client";

import React, { useMemo, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useShallow } from 'zustand/react/shallow';

import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useViewportStore } from '@/stores/viewportStore';
import { useUIStore } from '@/stores/uiStore';
import { transformDiagramToFlow } from '@/lib/diagram-engine/transformers/transformDiagramToFlow';
import { PlaceholderNode } from './PlaceholderNode';

const nodeTypes = {
  umlNode: PlaceholderNode,
};

/**
 * DiagramCanvas
 * 
 * The main React Flow workspace.
 * Renders nodes and edges derived from the semantic UML model.
 */
export const DiagramCanvas: React.FC = () => {
  const diagram = useUMLStore((state) => state.diagram);
  const layoutNodes = useLayoutStore((state) => state.nodes);
  const viewport = useViewportStore(useShallow((state) => ({ x: state.x, y: state.y, zoom: state.zoom })));
  
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const updateNodePosition = useLayoutStore((state) => state.updateNodePosition);

  // Derive Flow elements from Semantic model + Layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!diagram) return { nodes: [], edges: [] };
    return transformDiagramToFlow(diagram, layoutNodes);
  }, [diagram, layoutNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync internal nodes state with store updates
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle node drag stop to persist position
  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    updateNodePosition(node.id, node.position.x, node.position.y);
  }, [updateNodePosition]);

  // Handle selection
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNode(nodes.length > 0 ? nodes[0].id : null);
  }, [setSelectedNode]);

  if (!diagram) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-tertiary">
        <p>Loading diagram...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full bg-bg-canvas relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        defaultViewport={viewport}
        minZoom={0.2}
        maxZoom={2.5}
        fitView={!viewport.x && !viewport.y}
      >
        <Background 
          color="#161B22" // diagram.grid
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1} 
        />
        <Controls 
          className="!bg-bg-surface-primary !border-border-primary !fill-text-secondary"
          showInteractive={false}
        />
      </ReactFlow>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center z-10">
            <h2 className="text-text-tertiary text-lg font-medium mb-2">Diagram is empty</h2>
            <p className="text-text-tertiary opacity-50 text-sm">
              Add a class node to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
