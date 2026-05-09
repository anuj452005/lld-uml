'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PersistenceService, DiagramVersion } from '@/services/persistenceService';
import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useViewportStore } from '@/stores/viewportStore';
import { usePersistenceStore } from '@/stores/persistenceStore';

export interface VersionListPanelProps {
  diagramId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VersionListPanel
 *
 * Sidebar panel showing all saved versions for a diagram.
 * Users can click "Restore" to restore a version to the working snapshot.
 *
 * Rules:
 * - Fetch versions list on mount
 * - Show loading state while fetching
 * - Show error if fetch fails
 * - Restore updates all stores (uml, layout, viewport)
 * - Show confirmation before restoring
 */
export function VersionListPanel({
  diagramId,
  isOpen,
  onClose,
}: VersionListPanelProps) {
  const supabase = createClient();
  const [versions, setVersions] = useState<DiagramVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  // Stores
  const setDiagram = useUMLStore((state) => state.setDiagram);
  const setNodes = useLayoutStore((state) => state.setNodes);
  const setViewport = useViewportStore((state) => state.setViewport);
  const setSaveStatus = usePersistenceStore((state) => state.setSaveStatus);
  const setDirty = usePersistenceStore((state) => state.setDirty);

  // Load versions
  useEffect(() => {
    async function loadVersions() {
      if (!diagramId || !isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('Authentication required');
        }

        const versionsList = await PersistenceService.getVersions(token, diagramId);
        setVersions(versionsList);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Failed to load versions';
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    }

    loadVersions();
  }, [diagramId, isOpen, supabase]);

  const handleRestore = async (versionId: string) => {
    try {
      setIsRestoring(versionId);
      setSaveStatus('saving');

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Authentication required');
      }

      // Restore version to working snapshot
      const snapshot = await PersistenceService.restoreVersion(token, versionId);

      // Update all stores
      setDiagram(snapshot.diagram);
      setNodes(snapshot.layout.nodes);
      setViewport(snapshot.viewport);

      setDirty(false);
      setSaveStatus('saved');

      // Auto-reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

      setConfirmRestoreId(null);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to restore version';
      setError(errMsg);
      setSaveStatus('error');
    } finally {
      setIsRestoring(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-[56px] bottom-0 w-80 border-l border-border-primary bg-bg-surface-primary shadow-2xl z-[40] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="border-b border-border-primary p-4 flex items-center justify-between bg-bg-surface-secondary">
        <h2 className="text-md font-semibold text-text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
          Version History
        </h2>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="p-8 flex flex-col items-center justify-center gap-3 text-text-tertiary">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-primary"></div>
            <span className="text-xs">Loading history...</span>
          </div>
        )}

        {error && (
          <div className="m-4 p-3 bg-status-error/10 border border-status-error/20 rounded-md">
            <p className="text-xs text-status-error">{error}</p>
          </div>
        )}

        {!isLoading && versions.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center gap-2 text-text-tertiary">
            <div className="w-12 h-12 rounded-full bg-bg-surface-tertiary flex items-center justify-center mb-2">
              <span className="text-lg">📂</span>
            </div>
            <p className="text-xs font-medium">No versions yet</p>
            <p className="text-[10px] opacity-70">Save a version to see it here</p>
          </div>
        )}

        <div className="flex flex-col">
          {versions.map((version) => (
            <div 
              key={version.id} 
              className="border-b border-border-primary p-4 hover:bg-bg-surface-tertiary/30 transition-colors group"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                    {version.version_name || 'Unnamed Version'}
                  </h3>
                  <p className="text-[10px] text-text-tertiary mt-1 font-mono uppercase tracking-wider">
                    {new Date(version.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                {confirmRestoreId === version.id ? (
                  <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => setConfirmRestoreId(null)}
                      disabled={isRestoring === version.id}
                      className="flex-1 text-[11px] font-medium px-2 py-1.5 rounded-md border border-border-primary text-text-secondary hover:bg-bg-surface-tertiary disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRestore(version.id)}
                      disabled={isRestoring === version.id}
                      className="flex-1 text-[11px] font-medium px-2 py-1.5 rounded-md bg-status-success text-text-inverse hover:bg-status-success/90 disabled:opacity-50 shadow-sm transition-colors"
                    >
                      {isRestoring === version.id ? 'Restoring...' : 'Confirm Restore'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRestoreId(version.id)}
                    disabled={isRestoring !== null}
                    className="text-[11px] font-medium w-fit px-4 py-1.5 rounded-md border border-border-primary text-text-secondary hover:border-accent-primary hover:text-accent-primary disabled:opacity-50 transition-all"
                  >
                    Restore this version
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
