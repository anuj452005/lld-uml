import { create } from 'zustand';
import { UMLClass, UMLDiagram, UMLRelationship } from '@/types/uml';
import { useLayoutStore } from '@/stores/layoutStore';
import { validateClassName, validateRelationship } from '@/lib/validation';

interface UMLStoreState {
  diagram: UMLDiagram | null;
  setDiagram: (diagram: UMLDiagram) => void;
  clearDiagram: () => void;
  
  // New actions for Unit 5
  addClass: (cls: UMLClass) => void;
  updateClass: (id: string, updates: Partial<UMLClass>) => void;
  deleteClass: (id: string) => void;
  addRelationship: (relationship: UMLRelationship) => void;
  updateRelationship: (id: string, updates: Partial<UMLRelationship>) => void;
  deleteRelationship: (id: string) => void;
}

/**
 * UML Store
 * 
 * Owns the canonical UML semantic model.
 * This is the single source of truth for all UML entities (classes, interfaces, relationships).
 */
/**
 * Wrapper to mark a diagram as modified when a manual edit occurs.
 * If the current sourceType is 'java-generated', it transitions to 'mixed'.
 */
function markModifiedIfGenerated(state: UMLDiagram): Partial<UMLDiagram> {
  if (state.sourceType === 'java-generated') {
    return {
      sourceType: 'mixed',
      metadata: {
        ...state.metadata,
        isModified: true,
        lastManualEditAt: new Date().toISOString(),
      }
    };
  }
  return {
    metadata: {
      ...state.metadata,
      isModified: true,
      lastManualEditAt: new Date().toISOString(),
    }
  };
}

export const useUMLStore = create<UMLStoreState>((set) => ({
  diagram: null,
  setDiagram: (diagram) => set({ diagram }),
  clearDiagram: () => set({ diagram: null }),

  addClass: (cls) => set((state) => {
    if (!state.diagram) return state;

    // Semantic validation
    const existingNames = [
      ...state.diagram.classes.map(c => c.name),
      ...state.diagram.interfaces.map(i => i.name)
    ];
    const validation = validateClassName(cls.name, existingNames);
    if (!validation.valid) {
      console.error(`Store rejection: ${validation.error}`);
      return state;
    }

    const layoutStore = useLayoutStore.getState();
    const existingLayout = layoutStore.nodes.find((node) => node.entityId === cls.id);

    if (!existingLayout) {
      const nextIndex = layoutStore.nodes.length;
      layoutStore.setNodes([
        ...layoutStore.nodes,
        {
          entityId: cls.id,
          x: 80 + (nextIndex % 4) * 280,
          y: 80 + Math.floor(nextIndex / 4) * 220,
        },
      ]);
    }

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...state.diagram,
        ...modifiedFields,
        classes: [...state.diagram.classes, cls],
      }
    };
  }),

  updateClass: (id, updates) => set((state) => {
    if (!state.diagram) return state;

    // Semantic validation if name is being updated
    if (updates.name) {
      const existingNames = [
        ...state.diagram.classes.filter(c => c.id !== id).map(c => c.name),
        ...state.diagram.interfaces.filter(i => i.id !== id).map(i => i.name)
      ];
      const validation = validateClassName(updates.name, existingNames);
      if (!validation.valid) {
        console.error(`Store rejection: ${validation.error}`);
        return state;
      }
    }

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...state.diagram,
        ...modifiedFields,
        classes: state.diagram.classes.map((cls) => 
          cls.id === id ? { ...cls, ...updates, updatedAt: new Date().toISOString() } : cls
        ),
      }
    };
  }),

  deleteClass: (id) => set((state) => {
    if (!state.diagram) return state;

    const layoutStore = useLayoutStore.getState();
    layoutStore.setNodes(layoutStore.nodes.filter((node) => node.entityId !== id));

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...state.diagram,
        ...modifiedFields,
        classes: state.diagram.classes.filter((cls) => cls.id !== id),
        relationships: state.diagram.relationships.filter(
          (rel) => rel.sourceId !== id && rel.targetId !== id
        ),
      }
    };
  }),

  addRelationship: (relationship) => set((state) => {
    if (!state.diagram) return state;

    const validation = validateRelationship(relationship, state.diagram);
    if (!validation.valid) {
      console.error(`Store rejection: ${validation.error}`);
      return state;
    }

    const nextRelationship: UMLRelationship = {
      ...relationship,
      createdAt: relationship.createdAt ?? new Date().toISOString(),
    };

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...state.diagram,
        ...modifiedFields,
        relationships: [...state.diagram.relationships, nextRelationship],
      }
    };
  }),

  updateRelationship: (id, updates) => set((state) => {
    if (!state.diagram) return state;

    const relationship = state.diagram.relationships.find((rel) => rel.id === id);
    if (!relationship) return state;

    const nextRelationship: UMLRelationship = { ...relationship, ...updates };
    const nextDiagram: UMLDiagram = {
      ...state.diagram,
      relationships: state.diagram.relationships.map((rel) =>
        rel.id === id ? nextRelationship : rel
      ),
    };

    const validation = validateRelationship(nextRelationship, nextDiagram);
    if (!validation.valid) {
      console.error(`Store rejection: ${validation.error}`);
      return state;
    }

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...nextDiagram,
        ...modifiedFields,
      }
    };
  }),

  deleteRelationship: (id) => set((state) => {
    if (!state.diagram) return state;

    const modifiedFields = markModifiedIfGenerated(state.diagram);

    return {
      diagram: {
        ...state.diagram,
        ...modifiedFields,
        relationships: state.diagram.relationships.filter((rel) => rel.id !== id),
      }
    };
  }),
}));
