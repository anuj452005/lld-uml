import { create } from 'zustand';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface PersistenceStoreState {
  // State
  saveStatus: SaveStatus;
  isDirty: boolean;
  lastSavedAt: Date | null;
  retryCount: number;
  errorMessage: string | null;

  // Actions
  setSaveStatus: (status: SaveStatus) => void;
  setDirty: (dirty: boolean) => void;
  setLastSavedAt: (date: Date | null) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

/**
 * Persistence Store
 *
 * Owns:
 * - save status (idle | dirty | saving | saved | error)
 * 
 * Owns dirty flags, save status, and versioning metadata.
 */
export const usePersistenceStore = create<PersistenceStoreState>((set) => ({
  saveStatus: 'idle',
  lastSavedAt: null,
  isDirty: false,
  errorMessage: null,
  retryCount: 0,

  setSaveStatus: (status) => set({ saveStatus: status }),
  setDirty: (dirty) => set({ isDirty: dirty }),

  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  incrementRetry: () =>
    set((state) => ({ retryCount: state.retryCount + 1 })),

  resetRetry: () => set({ retryCount: 0 }),

  setError: (error) => set({ errorMessage: error, saveStatus: 'error' }),

  clearError: () => set({ errorMessage: null }),
}));
