import { create } from 'zustand';
import { ParserError, ParserWarning } from '@/types/uml';

export type ParseStatus = 'idle' | 'loading' | 'success' | 'error';

interface ParserStoreState {
  status: ParseStatus;
  warnings: ParserWarning[];
  errors: ParserError[];
  lastParsedSource: string | null;
  setStatus: (status: ParseStatus) => void;
  setResult: (warnings: ParserWarning[], errors: ParserError[]) => void;
  setLastParsedSource: (source: string | null) => void;
  clearResult: () => void;
}

/**
 * Parser Store
 * 
 * Owns the lifecycle state of the Java parsing process.
 * Does NOT directly mutate the UML store.
 */
export const useParserStore = create<ParserStoreState>((set) => ({
  status: 'idle',
  warnings: [],
  errors: [],
  lastParsedSource: null,

  setStatus: (status) => set({ status }),

  setResult: (warnings, errors) => set({ 
    warnings, 
    errors,
    status: errors.length > 0 ? 'error' : 'success'
  }),

  setLastParsedSource: (source) => set({ lastParsedSource: source }),

  clearResult: () => set({ 
    warnings: [], 
    errors: [], 
    status: 'idle' 
  }),
}));
