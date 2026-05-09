'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SaveQueue } from '@repo/persistence';
import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useViewportStore } from '@/stores/viewportStore';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { PersistenceService } from '@/services/persistenceService';
import { useShallow } from 'zustand/react/shallow';

const AUTO_SAVE_DEBOUNCE_MS = 1500; // 1.5 seconds

/**
 * useAutoSave
 *
 * Watches umlStore and layoutStore for changes.
 * Debounces saves via SaveQueue and updates persistenceStore status.
 */
export function useAutoSave(diagramId: string | undefined, enabled: boolean = true) {
  const supabase = createClient();
  const saveQueueRef = useRef<SaveQueue | null>(null);
  
  // Track the last saved/loaded state to avoid redundant saves or saves on hydration
  const lastStateRef = useRef<{
    diagram: string;
    nodes: string;
    viewport: string;
  } | null>(null);

  // Stores
  const diagram = useUMLStore((state) => state.diagram);
  const nodes = useLayoutStore((state) => state.nodes);
  const viewport = useViewportStore(useShallow((state) => ({ 
    x: state.x, 
    y: state.y, 
    zoom: state.zoom 
  })));

  const setSaveStatus = usePersistenceStore((state) => state.setSaveStatus);
  const setDirty = usePersistenceStore((state) => state.setDirty);
  const setLastSavedAt = usePersistenceStore((state) => state.setLastSavedAt);
  const setError = usePersistenceStore((state) => state.setError);
  const clearError = usePersistenceStore((state) => state.clearError);

  // Initialize SaveQueue once
  useEffect(() => {
    if (!saveQueueRef.current) {
      saveQueueRef.current = new SaveQueue({ delay: AUTO_SAVE_DEBOUNCE_MS });
    }
  }, []);

  // Watch for changes and trigger auto-save
  useEffect(() => {
    async function triggerAutoSave() {
      if (!enabled || !diagramId || !diagram || !nodes || !viewport) return;

      const currentState = {
        diagram: JSON.stringify(diagram),
        nodes: JSON.stringify(nodes),
        viewport: JSON.stringify(viewport),
      };

      // If this is the first run after hydration, just capture the state and return
      if (!lastStateRef.current) {
        lastStateRef.current = currentState;
        return;
      }

      // If nothing has changed, don't trigger a save
      if (
        currentState.diagram === lastStateRef.current.diagram &&
        currentState.nodes === lastStateRef.current.nodes &&
        currentState.viewport === lastStateRef.current.viewport
      ) {
        return;
      }

      // Update last state ref immediately to prevent multiple triggers while saving
      lastStateRef.current = currentState;

      // Mark as dirty immediately
      setDirty(true);

      // Get fresh token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError('Authentication required for auto-save');
        return;
      }

      // Queue the save operation
      setSaveStatus('saving');

      if (!saveQueueRef.current) {
        setError('Save queue not initialized');
        return;
      }

      try {
        await saveQueueRef.current.queue({
          execute: async () => {
            await PersistenceService.saveWorkingSnapshot(token, diagramId, {
              diagram,
              layout: { nodes },
              viewport,
            });
          },
          onSuccess: () => {
            setSaveStatus('saved');
            setDirty(false);
            setLastSavedAt(new Date());
            clearError();

            // Auto-reset to idle after 2 seconds
            setTimeout(() => {
              setSaveStatus('idle');
            }, 2000);
          },
          onError: (error) => {
            setError(error.message);
          },
          onCancel: () => {
            // If cancelled, keep dirty flag set
          },
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message);
      }
    }

    triggerAutoSave();
  }, [diagram, nodes, viewport, diagramId, enabled, supabase, setSaveStatus, setDirty, setLastSavedAt, setError, clearError]);

  // Flush on unmount to ensure final save
  useEffect(() => {
    return () => {
      if (saveQueueRef.current) {
        saveQueueRef.current.flush();
      }
    };
  }, []);
}
