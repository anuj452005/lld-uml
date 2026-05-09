import { create } from 'zustand';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface PersistenceStoreState {
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
}

/**
 * Persistence Store (Scaffold)
 * 
 * Owns dirty flags and save status.
 */
export const usePersistenceStore = create<PersistenceStoreState>((set) => ({
  saveStatus: 'idle',
  setSaveStatus: (status) => set({ saveStatus: status }),
}));
