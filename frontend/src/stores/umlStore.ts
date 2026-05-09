import { create } from 'zustand';
import { UMLDiagram } from '@/types/uml';

interface UMLStoreState {
  diagram: UMLDiagram | null;
  setDiagram: (diagram: UMLDiagram) => void;
  clearDiagram: () => void;
}

/**
 * UML Store
 * 
 * Owns the canonical UML semantic model.
 * This is the single source of truth for all UML entities (classes, interfaces, relationships).
 */
export const useUMLStore = create<UMLStoreState>((set) => ({
  diagram: null,
  setDiagram: (diagram) => set({ diagram }),
  clearDiagram: () => set({ diagram: null }),
}));
