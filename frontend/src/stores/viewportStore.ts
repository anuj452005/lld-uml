import { create } from 'zustand';
import { DiagramViewportState } from '@/types/uml';

interface ViewportStoreState {
  zoom: number;
  x: number;
  y: number;
  setViewport: (viewport: DiagramViewportState) => void;
}

/**
 * Viewport Store
 * 
 * Owns zoom and pan state.
 * Ensures the canvas restores exactly where the user left off.
 */
export const useViewportStore = create<ViewportStoreState>((set) => ({
  zoom: 1,
  x: 0,
  y: 0,
  setViewport: (viewport) => set({ 
    zoom: viewport.zoom, 
    x: viewport.x, 
    y: viewport.y 
  }),
}));
