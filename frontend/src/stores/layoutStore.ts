import { create } from 'zustand';
import { DiagramNodeLayout } from '@/types/uml';

interface LayoutStoreState {
  nodes: DiagramNodeLayout[];
  setNodes: (nodes: DiagramNodeLayout[]) => void;
  updateNodePosition: (entityId: string, x: number, y: number) => void;
}

/**
 * Layout Store
 * 
 * Owns node coordinates and dimensions.
 * Separates visual layout from semantic UML data.
 */
export const useLayoutStore = create<LayoutStoreState>((set) => ({
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  updateNodePosition: (entityId, x, y) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.entityId === entityId ? { ...node, x, y } : node
    )
  })),
}));
