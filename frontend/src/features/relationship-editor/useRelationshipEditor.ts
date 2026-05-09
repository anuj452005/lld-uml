import { useCallback, useEffect, useMemo, useState } from 'react';
import { Connection } from 'reactflow';
import { validateRelationship } from '@/lib/validation';
import { useUMLStore } from '@/stores/umlStore';
import { useUIStore } from '@/stores/uiStore';
import { UMLRelationship, UMLRelationshipType } from '@/types/uml';

interface PendingConnection {
  sourceId: string;
  targetId: string;
}

export interface RelationshipEditorState {
  pendingConnection: PendingConnection | null;
  isTypeSelectorOpen: boolean;
  isEditorOpen: boolean;
  selectedRelationship: UMLRelationship | null;
  draftType: UMLRelationshipType;
  draftLabel: string;
  relationshipError: string | null;
  openRelationshipTypeSelector: (connection: Connection) => void;
  cancelRelationshipTypeSelector: () => void;
  selectRelationshipType: (type: UMLRelationshipType) => void;
  openRelationshipEditor: (relationshipId: string) => void;
  closeRelationshipEditor: () => void;
  setDraftType: (type: UMLRelationshipType) => void;
  setDraftLabel: (label: string) => void;
  saveRelationship: () => void;
  deleteRelationship: () => void;
  clearRelationshipError: () => void;
}

export const useRelationshipEditor = (): RelationshipEditorState => {
  const diagram = useUMLStore((state) => state.diagram);
  const addRelationship = useUMLStore((state) => state.addRelationship);
  const updateRelationship = useUMLStore((state) => state.updateRelationship);
  const deleteRelationship = useUMLStore((state) => state.deleteRelationship);

  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setSelectedEdge = useUIStore((state) => state.setSelectedEdge);
  const setClassEditorOpen = useUIStore((state) => state.setClassEditorOpen);
  const selectedEdgeId = useUIStore((state) => state.selectedEdgeId);

  const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(null);
  const [draftType, setDraftType] = useState<UMLRelationshipType>('association');
  const [draftLabel, setDraftLabel] = useState('');
  const [relationshipError, setRelationshipError] = useState<string | null>(null);

  const selectedRelationship = useMemo(
    () => diagram?.relationships.find((relationship) => relationship.id === selectedEdgeId) ?? null,
    [diagram, selectedEdgeId]
  );

  useEffect(() => {
    if (selectedRelationship) {
      setDraftType(selectedRelationship.type);
      setDraftLabel(selectedRelationship.label ?? '');
      setRelationshipError(null);
      return;
    }

    if (!selectedEdgeId) {
      setDraftType('association');
      setDraftLabel('');
    }
  }, [selectedRelationship, selectedEdgeId]);

  const resetEditorSelection = useCallback(() => {
    setSelectedEdge(null);
    setRelationshipError(null);
  }, [setSelectedEdge]);

  const openRelationshipTypeSelector = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) {
      return;
    }

    setSelectedNode(null);
    setClassEditorOpen(false);
    resetEditorSelection();
    setPendingConnection({ sourceId: connection.source, targetId: connection.target });
  }, [resetEditorSelection, setClassEditorOpen, setSelectedNode]);

  const cancelRelationshipTypeSelector = useCallback(() => {
    setPendingConnection(null);
    setRelationshipError(null);
  }, []);

  const selectRelationshipType = useCallback((type: UMLRelationshipType) => {
    if (!diagram || !pendingConnection) {
      return;
    }

    const candidateRelationship: UMLRelationship = {
      id: crypto.randomUUID(),
      sourceId: pendingConnection.sourceId,
      targetId: pendingConnection.targetId,
      type,
      createdAt: new Date().toISOString(),
    };

    const candidateDiagram = {
      ...diagram,
      relationships: [...diagram.relationships, candidateRelationship],
    };

    const validation = validateRelationship(candidateRelationship, candidateDiagram);
    if (!validation.valid) {
      setRelationshipError(validation.error ?? 'Unable to create relationship');
      return;
    }

    setRelationshipError(null);
    addRelationship(candidateRelationship);
    setPendingConnection(null);
  }, [addRelationship, diagram, pendingConnection]);

  const openRelationshipEditor = useCallback((relationshipId: string) => {
    setSelectedNode(null);
    setClassEditorOpen(false);
    setSelectedEdge(relationshipId);
    setRelationshipError(null);
  }, [setClassEditorOpen, setSelectedEdge, setSelectedNode]);

  const closeRelationshipEditor = useCallback(() => {
    resetEditorSelection();
  }, [resetEditorSelection]);

  const saveRelationship = useCallback(() => {
    if (!diagram || !selectedRelationship) {
      return;
    }

    const trimmedLabel = draftLabel.trim();
    const updates: Partial<UMLRelationship> = {
      type: draftType,
      label: trimmedLabel ? trimmedLabel : undefined,
    };

    const candidateRelationship: UMLRelationship = {
      ...selectedRelationship,
      ...updates,
    };

    const candidateDiagram = {
      ...diagram,
      relationships: diagram.relationships.map((relationship) =>
        relationship.id === selectedRelationship.id ? candidateRelationship : relationship
      ),
    };

    const validation = validateRelationship(candidateRelationship, candidateDiagram);
    if (!validation.valid) {
      setRelationshipError(validation.error ?? 'Unable to update relationship');
      return;
    }

    setRelationshipError(null);
    updateRelationship(selectedRelationship.id, updates);
    resetEditorSelection();
  }, [diagram, draftLabel, draftType, resetEditorSelection, selectedRelationship, updateRelationship]);

  const deleteSelectedRelationship = useCallback(() => {
    if (!selectedRelationship) {
      return;
    }

    deleteRelationship(selectedRelationship.id);
    resetEditorSelection();
  }, [deleteRelationship, resetEditorSelection, selectedRelationship]);

  return {
    pendingConnection,
    isTypeSelectorOpen: pendingConnection !== null,
    isEditorOpen: selectedRelationship !== null,
    selectedRelationship,
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
    deleteRelationship: deleteSelectedRelationship,
    clearRelationshipError: () => setRelationshipError(null),
  };
};