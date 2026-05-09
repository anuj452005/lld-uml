'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { PersistenceService } from '@/services/persistenceService';

/**
 * useSaveVersion
 *
 * Encapsulates the logic for creating an explicit named version.
 * Called when user clicks "Save Version" button.
 *
 * Rules:
 * - Must have a valid version name
 * - Calls POST /api/v1/diagrams/:id/versions
 * - Updates persistenceStore status
 * - Returns the created version or error
 */
export function useSaveVersion(diagramId: string | undefined) {
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);

  const setSaveStatus = usePersistenceStore((state) => state.setSaveStatus);
  const setError = usePersistenceStore((state) => state.setError);
  const clearError = usePersistenceStore((state) => state.clearError);

  const saveVersion = useCallback(
    async (versionName: string) => {
      if (!diagramId || !versionName.trim()) {
        setError('Diagram ID and version name are required');
        return null;
      }

      setIsCreating(true);
      setSaveStatus('saving');

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('Authentication required');
        }

        const version = await PersistenceService.createVersion(
          token,
          diagramId,
          versionName
        );

        clearError();
        setSaveStatus('saved');

        // Auto-reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);

        return version;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [diagramId, supabase, setSaveStatus, setError, clearError]
  );

  return { saveVersion, isCreating };
}
