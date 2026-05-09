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
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useShallow } from 'zustand/react/shallow';

import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useViewportStore } from '@/stores/viewportStore';
import { useUIStore } from '@/stores/uiStore';
import { transformDiagramToFlow } from '@/lib/diagram-engine/transformers/transformDiagramToFlow';
import { edgeTypes } from '@/components/canvas/edgeTypes';
import { RelationshipTypeSelectorModal } from '@/features/relationship-editor/RelationshipTypeSelectorModal';
import { RelationshipEditorPanel } from '@/features/relationship-editor/RelationshipEditorPanel';
import { useRelationshipEditor } from '@/features/relationship-editor/useRelationshipEditor';
import { UMLClassNode } from './UMLClassNode';

const nodeTypes = {
  umlNode: UMLClassNode,
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
  const setClassEditorOpen = useUIStore((state) => state.setClassEditorOpen);
  const setSelectedEdge = useUIStore((state) => state.setSelectedEdge);
  const updateNodePosition = useLayoutStore((state) => state.updateNodePosition);
  const {
    isTypeSelectorOpen,
    isEditorOpen,
    draftType,
    draftLabel,
    relationshipError,
    openRelationshipTypeSelector,
    cancelRelationshipTypeSelector,
    selectRelationshipType,
    openRelationshipEditor,
    closeRelationshipEditor,
    setDraftType,
    setDraftLabel,
    saveRelationship,
    deleteRelationship,
    clearRelationshipError,
  } = useRelationshipEditor();

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

  const setViewport = useViewportStore((state) => state.setViewport);

  // Handle node drag stop to persist position
  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    updateNodePosition(node.id, node.position.x, node.position.y);
  }, [updateNodePosition]);

  // Handle viewport change
  const onMoveEnd = useCallback((_: any, viewport: { x: number; y: number; zoom: number }) => {
    setViewport(viewport);
  }, [setViewport]);

  // Handle node click to open editor
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    closeRelationshipEditor();
    setSelectedNode(node.id);
    setClassEditorOpen(true);
  }, [closeRelationshipEditor, setSelectedNode, setClassEditorOpen]);

  const onConnect = useCallback((connection: Connection) => {
    openRelationshipTypeSelector(connection);
    clearRelationshipError();
  }, [clearRelationshipError, openRelationshipTypeSelector]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedNode(null);
    setClassEditorOpen(false);
    setSelectedEdge(edge.id);
    openRelationshipEditor(edge.id);
  }, [openRelationshipEditor, setClassEditorOpen, setSelectedEdge, setSelectedNode]);

  // Handle selection
  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNode(nodes.length > 0 ? nodes[0].id : null);
    setSelectedEdge(edges.length > 0 ? edges[0].id : null);
  }, [setSelectedEdge, setSelectedNode]);

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
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onSelectionChange={onSelectionChange}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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

      <RelationshipTypeSelectorModal
        isOpen={isTypeSelectorOpen}
        errorMessage={relationshipError}
        onCancel={cancelRelationshipTypeSelector}
        onSelect={selectRelationshipType}
      />

      <RelationshipEditorPanel
        isOpen={isEditorOpen}
        type={draftType}
        label={draftLabel}
        errorMessage={relationshipError}
        onTypeChange={setDraftType}
        onLabelChange={setDraftLabel}
        onSave={saveRelationship}
        onDelete={deleteRelationship}
        onCancel={closeRelationshipEditor}
      />
    </div>
  );
};
