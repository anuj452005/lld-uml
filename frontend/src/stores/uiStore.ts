import { create } from 'zustand';

interface UIStoreState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isClassEditorOpen: boolean;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setClassEditorOpen: (isOpen: boolean) => void;
}

/**
 * UI Store (Scaffold)
 * 
 * Owns temporary UI state such as selections, panel visibility, and modal states.
 */
export const useUIStore = create<UIStoreState>((set) => ({
  selectedNodeId: null,
  selectedEdgeId: null,
  isClassEditorOpen: false,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setSelectedEdge: (id) => set({ selectedEdgeId: id }),
  setClassEditorOpen: (isOpen) => set({ isClassEditorOpen: isOpen }),
}));
